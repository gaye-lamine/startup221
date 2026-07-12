from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.redis import redis_client
from app.core.database import engine
from app.routers import startups
from app.routers import dashboard
from app.routers import investors
from sqlmodel import SQLModel
# Import models for SQLModel metadata registration
from app.entities.startup import Startup
from app.entities.lead import Lead
from app.routers.investors import InvestorLead  # register table


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to Redis
    await redis_client.connect()
    
    # Auto-create database tables (For development simplicity)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        
    yield
    
    # Clean up Redis connection
    await redis_client.disconnect()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(startups.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(investors.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
    }
