from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlmodel import select, col
from sqlmodel.ext.asyncio.session import AsyncSession
import uuid

from app.core.database import get_session
from app.entities.startup import Startup
from app.core.security import verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    slug: str
    name: str

@router.post("/login", response_model=LoginResponse)
async def login(
    payload: LoginRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Real authentication endpoint for startup founders.
    Checks the email and verifies the hashed password in the startups table.
    """
    result = await session.execute(
        select(Startup).where(col(Startup.email) == payload.email)
    )
    startup = result.scalar_one_or_none()
    
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects (email non trouvé).",
        )
        
    if not verify_password(payload.password, startup.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects (mot de passe invalide).",
        )
        
    # Generate a real JWT token
    from app.core.security import create_access_token
    token = create_access_token(data={"slug": startup.slug, "email": startup.email})
    
    return LoginResponse(
        token=token,
        slug=startup.slug,
        name=startup.name,
    )
