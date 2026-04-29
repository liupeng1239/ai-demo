from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class LeaveRequestBase(BaseModel):
    startTime: datetime
    endTime: datetime
    reason: str


class LeaveRequestCreate(LeaveRequestBase):
    pass


class LeaveRequestUpdate(BaseModel):
    startTime: Optional[datetime] = None
    endTime: Optional[datetime] = None
    reason: Optional[str] = None


class LeaveRequestOut(LeaveRequestBase):
    id: str
    userId: str
    status: str
    workflowId: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class LeaveRequestInDB(LeaveRequestBase):
    id: str
    userId: str
    status: str
    workflowId: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    hashed_password: str