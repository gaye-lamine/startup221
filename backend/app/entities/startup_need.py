import uuid
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, ForeignKey


class StartupNeed(SQLModel, table=True):
    __tablename__ = "startup_needs"

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
    category: str
    need_type: str
    title: str
    description: str
