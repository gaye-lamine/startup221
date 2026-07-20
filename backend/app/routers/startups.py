import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, File, UploadFile
from app.core.config import settings
from pydantic import BaseModel, Field
from sqlmodel.ext.asyncio.session import AsyncSession
from app.core.database import get_session
from app.entities.startup import Startup
from app.entities.lead import Lead
from app.repositories.startup_repository import PostgresStartupRepository
from app.repositories.lead_repository import PostgresLeadRepository
from app.repositories.cache_repository import CacheRepository
from app.use_cases.get_startups import GetStartupsUseCase
from app.use_cases.get_startup_by_slug import GetStartupBySlugUseCase
from app.use_cases.create_lead import CreateLeadUseCase

router = APIRouter(prefix="/startups", tags=["Startups"])


class TeamMemberRead(BaseModel):
    id: uuid.UUID
    name: str
    role: str
    avatar_url: str
    linkedin_url: str

    class Config:
        from_attributes = True


class StartupNeedRead(BaseModel):
    id: uuid.UUID
    category: str
    need_type: str
    title: str
    description: str

    class Config:
        from_attributes = True


class StartupRead(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    logo_url: str
    sector: str
    employee_count: int
    description: str
    seeking: List[str]
    created_at: datetime
    primary_color: str
    funding_stage: str
    city: str
    website_url: str
    linkedin_url: str
    twitter_url: str
    problem_statement: str
    solution_statement: str
    team: List[TeamMemberRead] = Field(default_factory=list)
    needs_list: List[StartupNeedRead] = Field(default_factory=list)
    token: Optional[str] = None

    class Config:
        from_attributes = True


class StartupCreate(BaseModel):
    name: str
    slug: str
    email: str
    password: str
    logo_url: str
    sector: str
    employee_count: int = Field(default=0, ge=0)
    description: str
    seeking: List[str] = Field(default_factory=list)
    primary_color: str = "#3545E6"
    funding_stage: str = "Amorçage / Seed"
    city: str = "Dakar, Sénégal"
    website_url: str = "#"
    linkedin_url: str = "#"
    twitter_url: str = "#"
    problem_statement: str = ""
    solution_statement: str = ""
    funding_amount: Optional[str] = None
    pitch_deck_url: Optional[str] = None


class LeadCreate(BaseModel):
    sender_name: str = Field(..., min_length=1)
    sender_entity: str = Field(..., min_length=1)
    sender_email: str = Field(..., min_length=3)
    message_type: str = Field(..., min_length=1)


class LeadRead(BaseModel):
    id: uuid.UUID
    startup_id: uuid.UUID
    sender_name: str
    sender_entity: str
    sender_email: str
    message_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class StartupPaginatedResponse(BaseModel):
    items: List[StartupRead]
    total: int
    page: int
    limit: int
    total_pages: int


class TrendItem(BaseModel):
    name: str
    count: int


class StartupTrendsResponse(BaseModel):
    total_startups: int
    by_sector: List[TrendItem]
    by_city: List[TrendItem]


@router.get("", response_model=StartupPaginatedResponse)
async def list_startups(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=9, ge=1, le=100),
    search: Optional[str] = Query(default=None),
    sector: Optional[List[str]] = Query(default=None),
    size: Optional[List[str]] = Query(default=None),
    seeking: Optional[List[str]] = Query(default=None),
    session: AsyncSession = Depends(get_session),
):
    """
    Get list of startups with pagination, keyword search, and filters.
    Includes Redis caching layer for queries without filters.
    """
    offset = (page - 1) * limit
    
    # Initialize repository and use case
    db_repo = PostgresStartupRepository(session)
    cache_repo = CacheRepository()
    use_case = GetStartupsUseCase(db_repo, cache_repo)
    
    # Execute use case
    startups, total = await use_case.execute(
        limit=limit,
        offset=offset,
        search=search,
        sectors=sector,
        employee_size_ranges=size,
        seeking_needs=seeking,
    )
    
    total_pages = (total + limit - 1) // limit if total > 0 else 1
    
    return StartupPaginatedResponse(
        items=startups,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )


@router.post("", response_model=StartupRead, status_code=201)
async def create_startup(
    payload: StartupCreate,
    session: AsyncSession = Depends(get_session),
):
    """
    Endpoint to add a new startup.
    Useful for populating the database and verifying write actions.
    """
    from app.core.security import hash_password
    from fastapi import HTTPException
    
    db_repo = PostgresStartupRepository(session)
    
    # Check if slug already exists
    existing_slug = await db_repo.get_by_slug(payload.slug)
    if existing_slug:
        raise HTTPException(status_code=400, detail="Ce nom de startup/slug existe déjà.")
        
    # Check if email already exists
    from sqlmodel import select, col
    existing_email_res = await session.execute(
        select(Startup).where(col(Startup.email) == payload.email)
    )
    if existing_email_res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Cette adresse email est déjà associée à une startup.")
        
    startup = Startup(
        name=payload.name,
        slug=payload.slug,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        logo_url=payload.logo_url,
        sector=payload.sector,
        employee_count=payload.employee_count,
        description=payload.description,
        seeking=payload.seeking,
        primary_color=payload.primary_color,
        funding_stage=payload.funding_stage,
        city=payload.city,
        website_url=payload.website_url,
        linkedin_url=payload.linkedin_url,
        twitter_url=payload.twitter_url,
        problem_statement=payload.problem_statement,
        solution_statement=payload.solution_statement,
        funding_amount=payload.funding_amount,
        pitch_deck_url=payload.pitch_deck_url,
    )
    added_startup = await db_repo.add(startup)
    
    # Generate token for autologin
    from app.core.security import create_access_token
    token = create_access_token(data={"slug": added_startup.slug, "email": added_startup.email})
    
    startup_dict = added_startup.model_dump()
    startup_dict["token"] = token
    return startup_dict


@router.get("/trends", response_model=StartupTrendsResponse)
async def get_startup_trends(
    session: AsyncSession = Depends(get_session),
):
    """
    Get aggregated trends data (total counts, sector breakdown, city breakdown).
    Used to display real-time statistics on the platform.
    """
    from sqlmodel import select, func

    # Total startups
    total_res = await session.execute(select(func.count(Startup.id)))
    total_count = total_res.scalar_one() or 0

    # Group by sector
    sector_res = await session.execute(
        select(Startup.sector, func.count(Startup.id))
        .group_by(Startup.sector)
        .order_by(func.count(Startup.id).desc())
    )
    by_sector = [TrendItem(name=row[0], count=row[1]) for row in sector_res.all()]

    # Group by city
    city_res = await session.execute(
        select(Startup.city, func.count(Startup.id))
        .group_by(Startup.city)
        .order_by(func.count(Startup.id).desc())
    )
    by_city = [TrendItem(name=row[0], count=row[1]) for row in city_res.all()]

    return StartupTrendsResponse(
        total_startups=total_count,
        by_sector=by_sector,
        by_city=by_city,
    )


@router.get("/{slug}", response_model=StartupRead)
async def get_startup_by_slug(
    slug: str,
    session: AsyncSession = Depends(get_session),
):
    """
    Retrieve startup detailed profile by its unique slug.
    Populates real team_members and startup_needs from database.
    """
    from sqlmodel import select, col
    from app.entities.team_member import TeamMember
    from app.entities.startup_need import StartupNeed

    db_repo = PostgresStartupRepository(session)
    cache_repo = CacheRepository()
    use_case = GetStartupBySlugUseCase(db_repo, cache_repo)
    
    startup = await use_case.execute(slug)
    if startup is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Startup not found")
    
    # Increment profile views count in PostgreSQL DB
    try:
        startup.profile_views += 1
        session.add(startup)
        await session.commit()
        await session.refresh(startup)
    except Exception:
        pass

    # Fetch team members
    team_res = await session.execute(
        select(TeamMember).where(col(TeamMember.startup_id) == startup.id)
    )
    team_members = team_res.scalars().all()

    # Fetch needs list
    needs_res = await session.execute(
        select(StartupNeed).where(col(StartupNeed.startup_id) == startup.id)
    )
    startup_needs = needs_res.scalars().all()

    startup_dict = startup.model_dump()
    startup_dict["team"] = [m.model_dump() for m in team_members]
    startup_dict["needs_list"] = [n.model_dump() for n in startup_needs]

    return startup_dict



@router.post("/{id}/contact", response_model=LeadRead, status_code=201)
async def contact_startup(
    id: uuid.UUID,
    payload: LeadCreate,
    session: AsyncSession = Depends(get_session),
):
    """
    Saves contact lead message from an investor to the database.
    """
    lead_repo = PostgresLeadRepository(session)
    use_case = CreateLeadUseCase(lead_repo)
    
    return await use_case.execute(
        startup_id=id,
        sender_name=payload.sender_name,
        sender_entity=payload.sender_entity,
        sender_email=payload.sender_email,
        message_type=payload.message_type,
    )


@router.post("/upload", status_code=200)
async def upload_logo(
    file: UploadFile = File(...),
):
    """
    Uploads a logo to Cloudinary using secure signed backend requests.
    """
    import hashlib
    import time
    import httpx
    from fastapi import HTTPException
    
    # Read file bytes
    file_bytes = await file.read()
    
    timestamp = int(time.time())
    params = {
        "folder": "Root",
        "timestamp": str(timestamp)
    }
    
    sorted_params = sorted(params.items())
    param_str = "&".join(f"{k}={v}" for k, v in sorted_params)
    string_to_sign = f"{param_str}{settings.CLOUDINARY_API_SECRET}"
    signature = hashlib.sha1(string_to_sign.encode("utf-8")).hexdigest()
    
    files = {"file": (file.filename, file_bytes)}
    data = {
        "api_key": settings.CLOUDINARY_API_KEY,
        "timestamp": str(timestamp),
        "folder": "Root",
        "signature": signature
    }
    
    async with httpx.AsyncClient() as client:
        url = f"https://api.cloudinary.com/v1_1/{settings.CLOUDINARY_CLOUD_NAME}/image/upload"
        response = await client.post(url, data=data, files=files)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Cloudinary upload failed: {response.text}")
        
        result = response.json()
        return {"secure_url": result["secure_url"]}
