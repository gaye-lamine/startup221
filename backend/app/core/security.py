import hashlib
import os
import jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Header, HTTPException, status

SECRET_KEY = "startupsn_secret_key_change_me_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

def hash_password(password: str) -> str:
    """
    Hashes a password using PBKDF2 HMAC SHA256 with a random salt.
    Format returned: salt_hex:hash_hex
    """
    salt = os.urandom(16).hex()
    pwd_bytes = password.encode("utf-8")
    salt_bytes = bytes.fromhex(salt)
    db_hash = hashlib.pbkdf2_hmac("sha256", pwd_bytes, salt_bytes, 100000)
    return f"{salt}:{db_hash.hex()}"

def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against the stored salt:hash combination.
    """
    try:
        salt, stored_hash = hashed_password.split(":")
        pwd_bytes = password.encode("utf-8")
        salt_bytes = bytes.fromhex(salt)
        db_hash = hashlib.pbkdf2_hmac("sha256", pwd_bytes, salt_bytes, 100000)
        return db_hash.hex() == stored_hash
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        return None

async def get_current_startup(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Jeton d'authentification manquant ou invalide.",
        )
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Jeton invalide ou expiré.",
        )
    return payload


async def get_current_investor(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Jeton d'authentification investisseur manquant ou invalide.",
        )
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "investor":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Jeton investisseur invalide ou rôle non autorisé.",
        )
    return payload

