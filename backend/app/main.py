import json
import uuid
from datetime import datetime
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlmodel import SQLModel, select, func, or_, col, cast, String
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
import redis.asyncio as aioredis

from app.core.config import settings
# Import the existing single definition of Startup to prevent SQLAlchemy double-registration errors
from app.entities.startup import Startup
from app.entities.team_member import TeamMember
from app.entities.startup_need import StartupNeed

from app.core.redis import redis_client

# ---------------------------------------------------------------------------
# Database Engine and Sessions
# ---------------------------------------------------------------------------
engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session

# ---------------------------------------------------------------------------
# Pydantic Schemas for Validation and API Response
# ---------------------------------------------------------------------------
class StartupRead(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    email: EmailStr
    logo_url: str
    sector: str
    employee_count: int
    description: str
    seeking: List[str]
    primary_color: str
    funding_stage: str
    city: str
    website_url: str
    linkedin_url: str
    twitter_url: str
    problem_statement: str
    solution_statement: str
    created_at: datetime

    class Config:
        from_attributes = True

class StartupPaginatedResponse(BaseModel):
    items: List[StartupRead]
    total: int
    page: int
    limit: int
    total_pages: int

# ---------------------------------------------------------------------------
# Lifespan Events
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await redis_client.connect()
    except Exception as e:
        print(f"Redis connection skipped: {e}")
    
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        
    yield
    
    try:
        await redis_client.disconnect()
    except Exception:
        pass

# ---------------------------------------------------------------------------
# FastAPI App Initialization
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://startup221.netlify.app",
        "https://startupsn.netlify.app",
    ],
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# GET /api/v1/startups - Directory Endpoint with Redis Cache & SQL Filtering
# ---------------------------------------------------------------------------
@app.get("/api/v1/startups", response_model=StartupPaginatedResponse)
async def list_startups(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=9, ge=1, le=100),
    search: Optional[str] = Query(default=None),
    sector: Optional[List[str]] = Query(default=None),
    min_employees: Optional[int] = Query(default=None),
    max_employees: Optional[int] = Query(default=None),
    seeking: Optional[List[str]] = Query(default=None),
    session: AsyncSession = Depends(get_session),
):
    offset = (page - 1) * limit

    has_filters = (
        search is not None
        or (sector is not None and len(sector) > 0)
        or min_employees is not None
        or max_employees is not None
        or (seeking is not None and len(seeking) > 0)
    )

    # 1. Redis Cache Route (No Filters Applied)
    if not has_filters:
        cache_key = f"startups:default:page_{page}:limit_{limit}"
        
        if redis_client.client:
            try:
                cached_data = await redis_client.client.get(cache_key)
                if cached_data:
                    parsed = json.loads(cached_data)
                    return StartupPaginatedResponse(**parsed)
            except Exception as e:
                print(f"Redis cache fetch error: {e}")

        # Fetch Items from DB
        items_query = select(Startup).order_by(col(Startup.created_at).desc()).offset(offset).limit(limit)
        items_res = await session.execute(items_query)
        items = list(items_res.scalars().all())

        # Fetch total count
        count_query = select(func.count()).select_from(Startup)
        count_res = await session.execute(count_query)
        total = count_res.scalar_one_or_none() or 0

        total_pages = (total + limit - 1) // limit if total > 0 else 1

        response_data = StartupPaginatedResponse(
            items=[StartupRead.from_orm(item) for item in items],
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
        )

        if redis_client.client:
            try:
                await redis_client.client.set(
                    cache_key,
                    response_data.json(),
                    ex=600
                )
            except Exception as e:
                print(f"Redis cache save error: {e}")

        return response_data

    # 2. SQL Database Route (Filters Applied)
    query = select(Startup)

    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                col(Startup.name).ilike(search_pattern),
                col(Startup.description).ilike(search_pattern),
            )
        )

    if sector:
        query = query.where(col(Startup.sector).in_(sector))

    if min_employees is not None:
        query = query.where(col(Startup.employee_count) >= min_employees)
    if max_employees is not None:
        query = query.where(col(Startup.employee_count) <= max_employees)

    if seeking:
        for need in seeking:
            # Operational contains expression or cast fallback on JSON arrays
            query = query.where(col(Startup.seeking).contains(need))

    count_query = select(func.count()).select_from(query.subquery())
    count_res = await session.execute(count_query)
    total = count_res.scalar_one_or_none() or 0

    paginated_query = query.order_by(col(Startup.created_at).desc()).offset(offset).limit(limit)
    items_res = await session.execute(paginated_query)
    items = list(items_res.scalars().all())

    total_pages = (total + limit - 1) // limit if total > 0 else 1

    return StartupPaginatedResponse(
        items=[StartupRead.from_orm(item) for item in items],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )

# ---------------------------------------------------------------------------
# Router Integrations
# ---------------------------------------------------------------------------
try:
    from app.routers import startups as startups_router
    app.include_router(startups_router.router, prefix="/api/v1")
except ImportError:
    pass

try:
    from app.routers import dashboard as dashboard_router
    app.include_router(dashboard_router.router, prefix="/api/v1")
except ImportError:
    pass

try:
    from app.routers import investors as investors_router
    app.include_router(investors_router.router, prefix="/api/v1")
except ImportError:
    pass

try:
    from app.routers import auth as auth_router
    app.include_router(auth_router.router, prefix="/api/v1")
except ImportError:
    pass

try:
    from app.routers import admin as admin_router
    app.include_router(admin_router.router, prefix="/api/v1")
except ImportError:
    pass

try:
    from app.routers import investors_directory as investors_dir_router
    app.include_router(investors_dir_router.router, prefix="/api/v1")
except ImportError:
    pass

try:
    from app.routers import partners as partners_router
    app.include_router(partners_router.router, prefix="/api/v1")
except ImportError:
    pass

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
