from pydantic import BaseModel


class UserBase(BaseModel):
    id: str
    username: str
    full_name: str
    email: str
    role: str


class UserInDB(UserBase):
    hashed_password: str


class UserOut(UserBase):
    pass
