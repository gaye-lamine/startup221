import uuid
from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Column, JSON

class Partner(SQLModel, table=True):
    __tablename__ = "partners"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    partner_type: str = Field(default="Incubateur")  # Incubateur, Accélérateur, Institution, Hub Tech
    logo_url: str = Field(default="")
    description: str = Field(default="")
    city: str = Field(default="Dakar")
    website_url: str = Field(default="")
    linkedin_url: str = Field(default="")
    created_at: datetime = Field(default_factory=datetime.utcnow)
