from datetime import datetime, timedelta
from hashlib import sha256
from hmac import compare_digest
from typing import Optional

from jose import JWTError, jwt

from app.models.user import UserInDB
from app.core.config import settings


def get_password_hash(password: str) -> str:
    return sha256(password.encode('utf-8')).hexdigest()


mock_users = [
    UserInDB(
        id='u-1001',
        username='hr',
        full_name='张敏',
        email='zhangmin@example.com',
        hashed_password=get_password_hash('password123'),
        role='hr',
    ),
    UserInDB(
        id='u-2001',
        username='employee',
        full_name='李华',
        email='lihua@example.com',
        hashed_password=get_password_hash('password123'),
        role='employee',
    ),
]


def get_user_by_username(username: str) -> Optional[UserInDB]:
    return next((user for user in mock_users if user.username == username), None)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return compare_digest(get_password_hash(plain_password), hashed_password)


def authenticate_user(username: str, password: str) -> Optional[UserInDB]:
    user = get_user_by_username(username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


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
