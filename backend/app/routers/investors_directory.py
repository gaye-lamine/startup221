import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlmodel import select, col
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.entities.investor import Investor

router = APIRouter(prefix="/investors", tags=["Investors Directory"])

class InvestorRead(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    email: str
    entity_type: str
    logo_url: str
    bio: str
    investment_stages: List[str]
    sectors: List[str]
    ticket_size: str
    city: str
    website_url: str
    linkedin_url: str

    class Config:
        from_attributes = True

# Seed initial real ecosystem investor data if empty
SEED_INVESTORS = [
  {
    "name": "Teranga Capital",
    "slug": "teranga-capital",
    "email": "contact@terangacapital.com",
    "entity_type": "VC / Fonds",
    "logo_url": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80",
    "bio": "Premier fonds d'impact dédié au financement et à l'accompagnement des PME et startups à fort potentiel au Sénégal.",
    "investment_stages": ["Seed", "Série A"],
    "sectors": ["Fintech", "Agrotech", "Santé", "Logistique"],
    "ticket_size": "50M - 300M FCFA",
    "city": "Dakar",
    "website_url": "https://www.terangacapital.com",
    "linkedin_url": "https://www.linkedin.com/company/terangacapital",
  },
  {
    "name": "WIC Capital",
    "slug": "wic-capital",
    "email": "dealflow@wic-capital.com",
    "entity_type": "VC / Fonds",
    "logo_url": "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=120&auto=format&fit=crop&q=80",
    "bio": "Fonds d'investissement ciblant prioritairement les entreprises fondées ou dirigées par des femmes en Afrique de l'Ouest.",
    "investment_stages": ["Amorçage", "Seed"],
    "sectors": ["Commerce", "Agribusiness", "Services", "Fintech"],
    "ticket_size": "25M - 100M FCFA",
    "city": "Dakar",
    "website_url": "https://wic-capital.com",
    "linkedin_url": "https://www.linkedin.com/company/wic-capital",
  },
  {
    "name": "Dakar Network Angels (DNA)",
    "slug": "dakar-network-angels",
    "email": "secretariat@dakarangels.sn",
    "entity_type": "Business Angel",
    "logo_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=80",
    "bio": "Réseau de Business Angels apportant du capital intelligent, des conseils et du réseau aux jeunes pousses de la Tech au Sénégal.",
    "investment_stages": ["Idéation", "Amorçage"],
    "sectors": ["Tous secteurs Tech"],
    "ticket_size": "10M - 40M FCFA",
    "city": "Dakar",
    "website_url": "https://dakarangels.sn",
    "linkedin_url": "https://www.linkedin.com/company/dakar-network-angels",
  },
]

@router.get("/directory", response_model=List[InvestorRead])
async def list_investors(
    entity_type: Optional[str] = Query(default=None),
    session: AsyncSession = Depends(get_session),
):
    """
    Returns the directory of investors & VC funds.
    Seeds default ecosystem data if empty.
    """
    query = select(Investor)
    if entity_type:
        query = query.where(col(Investor.entity_type) == entity_type)
    
    result = await session.execute(query)
    investors = list(result.scalars().all())

    if not investors:
        for seed_data in SEED_INVESTORS:
            inv = Investor(**seed_data)
            session.add(inv)
        await session.commit()
        
        result = await session.execute(select(Investor))
        investors = list(result.scalars().all())

    return investors

@router.get("/directory/{slug}", response_model=InvestorRead)
async def get_investor_by_slug(
    slug: str,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(Investor).where(col(Investor.slug) == slug))
    investor = result.scalar_one_or_none()
    if not investor:
        raise HTTPException(status_code=404, detail="Investisseur introuvable")
    return investor
