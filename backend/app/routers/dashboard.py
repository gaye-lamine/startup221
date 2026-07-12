import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import select, func, col
from sqlmodel.ext.asyncio.session import AsyncSession
from app.core.database import get_session
from app.core.redis import redis_client
from app.entities.startup import Startup
from app.entities.lead import Lead
from app.repositories.cache_repository import CacheRepository

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class DashboardStats(BaseModel):
    profile_views: int
    contact_requests: int
    is_live: bool


class LeadOut(BaseModel):
    id: uuid.UUID
    startup_id: uuid.UUID
    sender_name: str
    sender_entity: str
    sender_email: str
    message_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    primary_color: Optional[str] = None
    funding_stage: Optional[str] = None
    city: Optional[str] = None
    website_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    problem_statement: Optional[str] = None
    solution_statement: Optional[str] = None


class StartupOut(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
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


# ---------------------------------------------------------------------------
# Helper: get startup by slug or raise 404
# ---------------------------------------------------------------------------
async def _get_startup_or_404(slug: str, session: AsyncSession) -> Startup:
    result = await session.execute(
        select(Startup).where(col(Startup.slug) == slug)
    )
    startup = result.scalar_one_or_none()
    if not startup:
        raise HTTPException(status_code=404, detail=f"Startup '{slug}' not found")
    return startup


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/stats/{slug}", response_model=DashboardStats)
async def get_dashboard_stats(
    slug: str,
    session: AsyncSession = Depends(get_session),
):
    """
    Returns key dashboard indicators for a given startup:
    - Simulated profile views (random counter based on slug hash)
    - Real contact requests count from leads table
    - Live status (always True if the startup exists)
    """
    startup = await _get_startup_or_404(slug, session)

    # Count real leads for this startup
    count_result = await session.execute(
        select(func.count()).select_from(Lead).where(
            col(Lead.startup_id) == startup.id
        )
    )
    contact_count = count_result.scalar_one_or_none() or 0

    # Simulate profile views (deterministic from slug so it doesn't change on refresh)
    # In production, this would come from an analytics table or Redis counter
    simulated_views = (abs(hash(slug)) % 500) + 100

    return DashboardStats(
        profile_views=simulated_views,
        contact_requests=contact_count,
        is_live=True,
    )


@router.get("/leads/{slug}", response_model=List[LeadOut])
async def get_dashboard_leads(
    slug: str,
    session: AsyncSession = Depends(get_session),
):
    """
    Returns all investor contact leads for this startup,
    sorted by creation date descending (most recent first).
    """
    startup = await _get_startup_or_404(slug, session)

    result = await session.execute(
        select(Lead)
        .where(col(Lead.startup_id) == startup.id)
        .order_by(col(Lead.created_at).desc())
    )
    leads = result.scalars().all()
    return leads


@router.put("/profile/{slug}", response_model=StartupOut)
async def update_startup_profile(
    slug: str,
    payload: ProfileUpdate,
    session: AsyncSession = Depends(get_session),
):
    """
    Updates editable startup profile fields.
    CRUCIAL: Invalidates the Redis cache key `startup:profile:{slug}` after
    a successful DB update so public visitors see changes immediately.
    """
    startup = await _get_startup_or_404(slug, session)

    # Apply partial updates (only fields explicitly provided)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(startup, field, value)

    session.add(startup)
    await session.commit()
    await session.refresh(startup)

    # ✅ Cache Invalidation — delete the public profile cache key
    cache_key = f"startup:profile:{slug}"
    try:
        if redis_client.client:
            await redis_client.client.delete(cache_key)
    except Exception:
        pass  # Cache miss is acceptable; DB is source of truth

    return startup
