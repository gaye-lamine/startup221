import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
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


# Pydantic Schemas for validation and serialization
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
    )
    return await db_repo.add(startup)


@router.get("/{slug}", response_model=StartupRead)
async def get_startup_by_slug(
    slug: str,
    session: AsyncSession = Depends(get_session),
):
    """
    Retrieve startup detailed profile by its unique slug.
    Integrates 15-minute Redis profile caching.
    """
    db_repo = PostgresStartupRepository(session)
    cache_repo = CacheRepository()
    use_case = GetStartupBySlugUseCase(db_repo, cache_repo)
    
    startup = await use_case.execute(slug)
    if startup is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Startup not found")
    return startup


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
