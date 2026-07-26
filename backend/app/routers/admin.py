import uuid
from datetime import datetime
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlmodel import select, col, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.core.database import get_session
from app.core.config import settings
from app.entities.startup import Startup
from app.routers.investors import InvestorLead
from app.core.security import create_access_token, decode_access_token, verify_password

router = APIRouter(prefix="/admin", tags=["Admin"])


class AdminLoginRequest(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    token_type: str = "bearer"


def get_current_admin(authorization: Annotated[Optional[str], Header()] = None) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Jeton d'administration manquant ou invalide.",
        )

    token = authorization.split(" ", 1)[1].strip()
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Jeton d'administration invalide ou expiré.",
        )

    return payload


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


@router.post("/login", response_model=AdminLoginResponse)
async def login_admin(payload: AdminLoginRequest):
    if not verify_password(payload.password, settings.ADMIN_PASSWORD_HASH):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants administrateur incorrects.",
        )

    token = create_access_token(data={"sub": "admin", "role": "admin"})
    return AdminLoginResponse(token=token)


@router.get("/investors", response_model=List[InvestorLeadOut], dependencies=[Depends(get_current_admin)])
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


@router.get("/startups", response_model=List[AdminStartupSummary], dependencies=[Depends(get_current_admin)])
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
