from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.services.auth_service import authenticate_user, create_access_token
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
    user = authenticate_user(payload.username, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='用户名或密码错误')

    token = create_access_token({'sub': user.username})
    return {'token': token, 'user': user}
