import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlmodel import select, col, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.core.database import get_session
from app.entities.startup import Startup
from app.routers.investors import InvestorLead

router = APIRouter(prefix="/admin", tags=["Admin"])


class InvestorLeadOut(BaseModel):
    id: uuid.UUID
    email: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AdminStartupSummary(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    email: str
    sector: str
    city: str
    funding_stage: str
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/investors", response_model=List[InvestorLeadOut])
async def list_registered_investors(
    session: AsyncSession = Depends(get_session),
):
    """
    Returns the list of all registered investor/newsletter email leads.
    """
    result = await session.execute(
        select(InvestorLead).order_by(col(InvestorLead.created_at).desc())
    )
    leads = result.scalars().all()
    return leads


@router.get("/startups", response_model=List[AdminStartupSummary])
async def list_all_startups(
    session: AsyncSession = Depends(get_session),
):
    """
    Returns the full list of startups registered in the system.
    """
    result = await session.execute(
        select(Startup).order_by(col(Startup.created_at).desc())
    )
    startups = result.scalars().all()
    return startups
