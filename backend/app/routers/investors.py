import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlmodel import SQLModel, Field, select, col
from sqlmodel.ext.asyncio.session import AsyncSession
from app.core.database import get_session

router = APIRouter(prefix="/investors", tags=["Investors"])


# ─── Entity ──────────────────────────────────────────────────────────────────

class InvestorLead(SQLModel, table=True):
    __tablename__ = "investor_leads"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    email: str = Field(unique=True, index=True, nullable=False)
    status: str = Field(default="pending_review")
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ─── Schemas ─────────────────────────────────────────────────────────────────

class InvestorSubscribeRequest(BaseModel):
    email: EmailStr


class InvestorSubscribeResponse(BaseModel):
    message: str
    email: str


# ─── Endpoint ────────────────────────────────────────────────────────────────

@router.post(
    "/subscribe",
    response_model=InvestorSubscribeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def subscribe_investor(
    payload: InvestorSubscribeRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Captures an investor's email for early access to the platform.
    Validates with Pydantic EmailStr, deduplicates via UNIQUE constraint,
    and inserts into the investor_leads table.
    """
    # Check for duplicate email
    existing = await session.execute(
        select(InvestorLead).where(col(InvestorLead.email) == str(payload.email))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cet email est déjà enregistré. Vous êtes sur la liste !",
        )

    # Insert new investor lead
    lead = InvestorLead(email=str(payload.email))
    session.add(lead)
    await session.commit()

    return InvestorSubscribeResponse(
        message="Votre demande d'accès a bien été enregistrée. Nous vous contacterons sous 48h.",
        email=str(payload.email),
    )
