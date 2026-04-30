from fastapi import APIRouter, HTTPException, status, Depends, Header
from pydantic import BaseModel
from typing import Optional

from app.services.auth_service import authenticate_user, create_access_token, decode_access_token
from app.models.user import UserOut

router = APIRouter(prefix='/auth', tags=['auth'])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    user: UserOut


@router.post('/login', response_model=LoginResponse)
async def login(payload: LoginRequest):
    user = await authenticate_user(payload.username, payload.password)
    print(f"Authenticated user: {user}")
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='用户名或密码错误')

    token = create_access_token({'sub': user.username})
    return {'token': token, 'user': user}


@router.post('/logout')
async def logout():
    return {'message': '登出成功'}


@router.get('/me', response_model=UserOut)
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='未授权')

    token = authorization.replace('Bearer ', '')
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='无效的令牌')

    username = payload.get('sub')
    user = await authenticate_user(username, '')
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='用户不存在')

    return user
