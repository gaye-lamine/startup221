import uuid
from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Column, JSON

class Investor(SQLModel, table=True):
    __tablename__ = "investors"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    entity_type: str = Field(default="Business Angel")  # Business Angel, VC / Fonds, Family Office
    logo_url: str = Field(default="")
    bio: str = Field(default="")
    investment_stages: List[str] = Field(default_factory=list, sa_column=Column(JSON))  # Amorçage, Seed, Série A
    sectors: List[str] = Field(default_factory=list, sa_column=Column(JSON))  # Fintech, Agrotech, Healthtech
    ticket_size: str = Field(default="10M - 50M FCFA")
    city: str = Field(default="Dakar")
    website_url: str = Field(default="")
    linkedin_url: str = Field(default="")
    created_at: datetime = Field(default_factory=datetime.utcnow)
