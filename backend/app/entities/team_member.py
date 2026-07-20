import uuid
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, ForeignKey


class TeamMember(SQLModel, table=True):
    __tablename__ = "team_members"

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
    name: str
    role: str
    avatar_url: str = Field(default="")
    linkedin_url: str = Field(default="")
