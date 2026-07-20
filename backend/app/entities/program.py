import uuid
from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Column, JSON

class OpportunityProgram(SQLModel, table=True):
    __tablename__ = "opportunity_programs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    partner_id: Optional[uuid.UUID] = Field(default=None, foreign_key="partners.id")
    partner_name: str = Field(default="Écosystème Tech")
    title: str = Field(index=True)
    category: str = Field(default="Appel à projets")  # Appel à projets, Concours, Incubation, Subvention
    description: str = Field(default="")
    deadline: str = Field(default="31 Décembre 2026")
    apply_url: str = Field(default="")
    target_sectors: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
