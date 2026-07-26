import logging
import uuid
from contextlib import asynccontextmanager
from datetime import datetime
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

logger = logging.getLogger(__name__)

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

API_V1_PREFIX = "/api/v1"

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
# Router Integrations
# ---------------------------------------------------------------------------
try:
    from app.routers import startups as startups_router
    app.include_router(startups_router.router, prefix=API_V1_PREFIX)
except Exception as exc:
    logger.error("Failed to import router 'startups'", exc_info=exc)
    raise

try:
    from app.routers import dashboard as dashboard_router
    app.include_router(dashboard_router.router, prefix=API_V1_PREFIX)
except Exception as exc:
    logger.error("Failed to import router 'dashboard'", exc_info=exc)
    raise

try:
    from app.routers import investors as investors_router
    app.include_router(investors_router.router, prefix=API_V1_PREFIX)
except Exception as exc:
    logger.error("Failed to import router 'investors'", exc_info=exc)
    raise

try:
    from app.routers import auth as auth_router
    app.include_router(auth_router.router, prefix=API_V1_PREFIX)
except Exception as exc:
    logger.error("Failed to import router 'auth'", exc_info=exc)
    raise

try:
    from app.routers import admin as admin_router
    app.include_router(admin_router.router, prefix=API_V1_PREFIX)
except Exception as exc:
    logger.error("Failed to import router 'admin'", exc_info=exc)
    raise

try:
    from app.routers import investors_directory as investors_dir_router
    app.include_router(investors_dir_router.router, prefix=API_V1_PREFIX)
except Exception as exc:
    logger.error("Failed to import router 'investors_directory'", exc_info=exc)
    raise

try:
    from app.routers import partners as partners_router
    app.include_router(partners_router.router, prefix=API_V1_PREFIX)
except Exception as exc:
    logger.error("Failed to import router 'partners'", exc_info=exc)
    raise

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
