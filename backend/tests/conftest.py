import asyncio
import hashlib
import os
import tempfile
from datetime import datetime, timedelta
from pathlib import Path
import secrets

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

# Isolate the test database before importing the app so settings pick up the test DB.
_test_db_fd, _test_db_path = tempfile.mkstemp(prefix="startupsn-test-", suffix=".sqlite")
os.close(_test_db_fd)
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{_test_db_path}"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "10080"
os.environ["CLOUDINARY_CLOUD_NAME"] = "test-cloud"
os.environ["CLOUDINARY_API_KEY"] = "test-key"
os.environ["CLOUDINARY_API_SECRET"] = "test-secret"
os.environ["APP_ENV"] = "test"

ADMIN_PASSWORD = "admin-pass"
STARTUP_PASSWORD = "startup-pass"

def _hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    password_bytes = password.encode("utf-8")
    salt_bytes = bytes.fromhex(salt)
    digest = hashlib.pbkdf2_hmac("sha256", password_bytes, salt_bytes, 100000)
    return f"{salt}:{digest.hex()}"


os.environ["ADMIN_PASSWORD_HASH"] = _hash_password(ADMIN_PASSWORD)

from app.entities.lead import Lead
from app.entities.startup import Startup
from app.main import app, engine
from app.routers.investors import InvestorLead


async def _reset_database() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)

    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        senpay = Startup(
            name="SenPay",
            slug="senpay",
            email="fondateur@senpay.sn",
            hashed_password=_hash_password(STARTUP_PASSWORD),
            logo_url="https://example.com/senpay.png",
            sector="Fintech",
            employee_count=18,
            description="Paiements mobiles",
            seeking=["Investisseurs", "Partenaires"],
            primary_color="#3545E6",
            funding_stage="Amorçage / Seed",
            city="Dakar, Sénégal",
            website_url="https://www.senpay.sn",
            linkedin_url="https://linkedin.com/company/senpay",
            twitter_url="https://twitter.com/senpay",
            problem_statement="Problem",
            solution_statement="Solution",
        )
        sunufield = Startup(
            name="SunuField",
            slug="sunufield",
            email="fondateur@sunufield.sn",
            hashed_password=_hash_password(STARTUP_PASSWORD),
            logo_url="https://example.com/sunufield.png",
            sector="AgriTech",
            employee_count=8,
            description="Optimisation agricole",
            seeking=["Partenaires"],
            primary_color="#6366F1",
            funding_stage="Amorçage / Seed",
            city="Saint-Louis, Sénégal",
            website_url="https://www.sunufield.sn",
            linkedin_url="https://linkedin.com/company/sunufield",
            twitter_url="https://twitter.com/sunufield",
            problem_statement="Problem",
            solution_statement="Solution",
        )
        session.add_all([senpay, sunufield])
        await session.flush()

        session.add(
            Lead(
                startup_id=senpay.id,
                sender_name="Teranga Solutions",
                sender_entity="VC Fund - Seed",
                sender_email="contact@teranga.vc",
                message_type="Investisseur",
                created_at=datetime.utcnow() - timedelta(hours=2),
            )
        )
        session.add(
            InvestorLead(
                email="investor@demo.test",
                status="pending_review",
            )
        )
        await session.commit()


@pytest.fixture()
def client():
    asyncio.run(_reset_database())
    with TestClient(app) as test_client:
        yield test_client

    asyncio.run(engine.dispose())

    import gc
    gc.collect()
    import time
    time.sleep(0.3)

    try:
        Path(_test_db_path).unlink(missing_ok=True)
    except (PermissionError, OSError):
        # Windows may keep file handles briefly; not a test failure
        pass
