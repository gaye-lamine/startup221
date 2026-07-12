import hashlib
import os

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
