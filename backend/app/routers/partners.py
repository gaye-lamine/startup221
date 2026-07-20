import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlmodel import select, col
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.entities.partner import Partner
from app.entities.program import OpportunityProgram
from app.entities.resource import Resource

router = APIRouter(tags=["Partners & Ecosystem"])

# Pydantic Schemas
class PartnerRead(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    email: str
    partner_type: str
    logo_url: str
    description: str
    city: str
    website_url: str
    linkedin_url: str

    class Config:
        from_attributes = True

class ProgramRead(BaseModel):
    id: uuid.UUID
    partner_id: Optional[uuid.UUID]
    partner_name: str
    title: str
    category: str
    description: str
    deadline: str
    apply_url: str
    target_sectors: List[str]

    class Config:
        from_attributes = True

class ResourceRead(BaseModel):
    id: uuid.UUID
    title: str
    category: str
    description: str
    file_type: str
    file_url: str

    class Config:
        from_attributes = True

# Seed Data
SEED_PARTNERS = [
    {
        "name": "DER/FJ (Délégation à l'Entrepreneuriat Rapide)",
        "slug": "der-fj",
        "email": "contact@der.sn",
        "partner_type": "Institution",
        "logo_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=120&auto=format&fit=crop&q=80",
        "description": "Structure étatique dédiée au financement, à l'accompagnement et au soutien technique des startups et TPME au Sénégal.",
        "city": "Dakar",
        "website_url": "https://der.sn",
        "linkedin_url": "https://www.linkedin.com/company/derfj",
    },
    {
        "name": "CTIC Dakar",
        "slug": "ctic-dakar",
        "email": "contact@cticdakar.sn",
        "partner_type": "Incubateur",
        "logo_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=80",
        "description": "Premier incubateur spécialisé dans les technologies de l'information et de la communication en Afrique de l'Ouest.",
        "city": "Dakar",
        "website_url": "https://www.cticdakar.com",
        "linkedin_url": "https://www.linkedin.com/company/cticdakar",
    },
    {
        "name": "Jokkolabs Dakar",
        "slug": "jokkolabs",
        "email": "dakar@jokkolabs.net",
        "partner_type": "Hub Tech",
        "logo_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&auto=format&fit=crop&q=80",
        "description": "Réseau d'espaces d'innovation ouverte, de coworking et d'incubation pour les entrepreneurs de la tech et créatifs.",
        "city": "Dakar",
        "website_url": "https://jokkolabs.net",
        "linkedin_url": "https://www.linkedin.com/company/jokkolabs",
    },
    {
        "name": "Impact Dakar",
        "slug": "impact-dakar",
        "email": "hello@impactdakar.com",
        "partner_type": "Accélérateur",
        "logo_url": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=120&auto=format&fit=crop&q=80",
        "description": "Centre d'innovation et accélérateur d'entreprises à fort impact social et environnemental au Sénégal.",
        "city": "Dakar",
        "website_url": "https://impactdakar.com",
        "linkedin_url": "https://www.linkedin.com/company/impact-dakar",
    },
]

SEED_PROGRAMS = [
    {
        "partner_name": "DER/FJ & Ministère de la Communication",
        "title": "Fonds d'Appui à l'Innovation Numérique (FAIN 2026)",
        "category": "Subvention & Incubation",
        "description": "Programme de financement et de coaching intensif pour les startups sénégalaises ayant un prototype fonctionnel.",
        "deadline": "15 Août 2026",
        "apply_url": "https://der.sn/fain-2026",
        "target_sectors": ["Fintech", "Agrotech", "EdTech", "Santé"],
    },
    {
        "partner_name": "CTIC Dakar",
        "title": "Programme d'Incubation Tech Acceleration 2026",
        "category": "Incubation",
        "description": "6 mois d'accompagnement sur-mesure, mentorat par des experts internationaux et accès aux réseaux d'investisseurs.",
        "deadline": "30 Septembre 2026",
        "apply_url": "https://www.cticdakar.com/candidature",
        "target_sectors": ["SaaS", "E-commerce", "Mobilité"],
    },
    {
        "partner_name": "Orange Fab Sénégal",
        "title": "Challenge Startups Innovation Afrique",
        "category": "Concours",
        "description": "Concours sous régional récompensant les meilleures solutions digitales avec un prix de 20.000.000 FCFA.",
        "deadline": "10 Octobre 2026",
        "apply_url": "https://orangefab.sn",
        "target_sectors": ["IA", "IoT", "Fintech"],
    },
]

SEED_RESOURCES = [
    {
        "title": "Guide du Startup Act Sénégal & Processus de Labellisation",
        "category": "Guide Juridique",
        "description": "Document officiel expliquant les exonérations fiscales, douanières et la procédure pour obtenir le label Startup au Sénégal.",
        "file_type": "PDF",
        "file_url": "https://der.sn/docs/startup-act-guide.pdf",
    },
    {
        "title": "Modèle Standard de Pitch Deck Investisseur (Format Sénégal)",
        "category": "Modèle Document",
        "description": "Présentation PowerPoint pré-structurée recommandée par les fonds de VC opérant en Afrique de l'Ouest.",
        "file_type": "PPTX",
        "file_url": "https://startups.sn/downloads/template-pitch-deck.pptx",
    },
    {
        "title": "Pacte d'Actionnaires & Term Sheet Type (Seed / Amorçage)",
        "category": "Modèle Document",
        "description": "Modèle de contrat d'investissement et de gouvernance conforme au droit OHADA.",
        "file_type": "DOCX",
        "file_url": "https://startups.sn/downloads/pacte-actionnaires-ohada.docx",
    },
]

@router.get("/partners", response_model=List[PartnerRead])
async def list_partners(
    partner_type: Optional[str] = Query(default=None),
    session: AsyncSession = Depends(get_session),
):
    query = select(Partner)
    if partner_type:
        query = query.where(col(Partner.partner_type) == partner_type)
    
    result = await session.execute(query)
    partners = list(result.scalars().all())

    if not partners:
        for p_data in SEED_PARTNERS:
            session.add(Partner(**p_data))
        await session.commit()
        result = await session.execute(select(Partner))
        partners = list(result.scalars().all())

    return partners

@router.get("/programs", response_model=List[ProgramRead])
async def list_programs(
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(OpportunityProgram))
    programs = list(result.scalars().all())

    if not programs:
        for prg_data in SEED_PROGRAMS:
            session.add(OpportunityProgram(**prg_data))
        await session.commit()
        result = await session.execute(select(OpportunityProgram))
        programs = list(result.scalars().all())

    return programs

@router.get("/resources", response_model=List[ResourceRead])
async def list_resources(
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(Resource))
    resources = list(result.scalars().all())

    if not resources:
        for res_data in SEED_RESOURCES:
            session.add(Resource(**res_data))
        await session.commit()
        result = await session.execute(select(Resource))
        resources = list(result.scalars().all())

    return resources

# CRUD API Extensions for Dynamic Management

@router.post("/partners", response_model=PartnerRead)
async def create_partner(
    partner_data: PartnerCreate,
    session: AsyncSession = Depends(get_session),
):
    new_partner = Partner(**partner_data.model_dump())
    session.add(new_partner)
    await session.commit()
    await session.refresh(new_partner)
    return new_partner

@router.delete("/partners/{partner_id}")
async def delete_partner(
    partner_id: str,
    session: AsyncSession = Depends(get_session),
):
    partner = await session.get(Partner, partner_id)
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    await session.delete(partner)
    await session.commit()
    return {"message": "Partner deleted successfully"}

@router.post("/programs", response_model=ProgramRead)
async def create_program(
    program_data: ProgramCreate,
    session: AsyncSession = Depends(get_session),
):
    new_program = OpportunityProgram(**program_data.model_dump())
    session.add(new_program)
    await session.commit()
    await session.refresh(new_program)
    return new_program

@router.delete("/programs/{program_id}")
async def delete_program(
    program_id: str,
    session: AsyncSession = Depends(get_session),
):
    program = await session.get(OpportunityProgram, program_id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    await session.delete(program)
    await session.commit()
    return {"message": "Program deleted successfully"}

@router.post("/resources", response_model=ResourceRead)
async def create_resource(
    resource_data: ResourceCreate,
    session: AsyncSession = Depends(get_session),
):
    new_resource = Resource(**resource_data.model_dump())
    session.add(new_resource)
    await session.commit()
    await session.refresh(new_resource)
    return new_resource

@router.delete("/resources/{resource_id}")
async def delete_resource(
    resource_id: str,
    session: AsyncSession = Depends(get_session),
):
    resource = await session.get(Resource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    await session.delete(resource)
    await session.commit()
    return {"message": "Resource deleted successfully"}

