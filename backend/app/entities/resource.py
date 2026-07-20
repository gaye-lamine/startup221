import uuid
from datetime import datetime
from sqlmodel import SQLModel, Field

class Resource(SQLModel, table=True):
    __tablename__ = "resources"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(index=True)
    category: str = Field(default="Modèle Document")  # Modèle Document, Guide Juridique, Startup Act, Formation
    description: str = Field(default="")
    file_type: str = Field(default="PDF")
    file_url: str = Field(default="")
    created_at: datetime = Field(default_factory=datetime.utcnow)
