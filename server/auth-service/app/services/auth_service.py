from datetime import datetime, timedelta
from hashlib import sha256
from hmac import compare_digest
from typing import Optional

from jose import JWTError, jwt
from bson import ObjectId

from app.models.user import UserInDB, UserOut
from app.core.config import settings
from app.core.database import get_database


def get_password_hash(password: str) -> str:
    return sha256(password.encode('utf-8')).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return compare_digest(get_password_hash(plain_password), hashed_password)


async def get_user_by_username(username: str) -> Optional[dict]:
    db = get_database()
    if db is None:
        return None
    user = await db.users.find_one({"username": username})
    return user


async def authenticate_user(username: str, password: str) -> Optional[UserOut]:
    user = await get_user_by_username(username)
    if not user:
        return None
    if not verify_password(password, user.get("hashed_password", "")):
        return None
    return UserOut(
        id=str(user["_id"]),
        username=user["username"],
        full_name=user["full_name"],
        email=user["email"],
        role=user["role"],
    )


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None
