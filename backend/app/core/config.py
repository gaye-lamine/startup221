from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True
    )

    APP_NAME: str = "Startup221 API"
    APP_ENV: str = "development"
    
    # CORS Origins
    CORS_ORIGINS: Union[List[AnyHttpUrl], str] = ["http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v

    # PostgreSQL Database url (defaults to SQLite for local development out-of-the-box)
    DATABASE_URL: str = "sqlite+aiosqlite:///./startup221.db"

    # Redis Url
    REDIS_URL: str = "redis://localhost:6379/0"


settings = Settings()
