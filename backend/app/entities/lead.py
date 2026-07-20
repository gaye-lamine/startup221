import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, ForeignKey
from sqlalchemy.sql import func


class Lead(SQLModel, table=True):
    __tablename__ = "leads"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    startup_id: uuid.UUID = Field(
        sa_column=Column(
            ForeignKey("startups.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        )
    )
    sender_name: str
    sender_entity: str
    sender_email: str
    message_type: str  # Investissement, Partenariat, etc.
    replied: bool = Field(default=False)
    reply_message: Optional[str] = Field(default=None, nullable=True)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": func.now()},
    )
