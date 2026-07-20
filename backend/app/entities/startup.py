import uuid
from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Column, JSON
from sqlalchemy.sql import func


class Startup(SQLModel, table=True):
    __tablename__ = "startups"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    name: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    logo_url: str
    sector: str = Field(index=True)
    employee_count: int = Field(index=True, default=0)
    profile_views: int = Field(index=True, default=0)
    description: str
    primary_color: str = Field(default="#3545E6")
    funding_stage: str = Field(default="Amorçage / Seed")
    city: str = Field(default="Dakar, Sénégal")
    website_url: str = Field(default="#")
    linkedin_url: str = Field(default="#")
    twitter_url: str = Field(default="#")
    problem_statement: str = Field(default="")
    solution_statement: str = Field(default="")
    funding_amount: Optional[str] = Field(default=None, nullable=True)
    pitch_deck_url: Optional[str] = Field(default=None, nullable=True)
    # Storing list of string tags like ["Investisseurs", "Partenaires"]
    seeking: List[str] = Field(
        sa_column=Column(JSON, nullable=False, default=list)
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": func.now()}
    )
