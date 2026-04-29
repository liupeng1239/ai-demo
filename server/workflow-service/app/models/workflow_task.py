from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class WorkflowTaskBase(BaseModel):
    workflowId: str
    assigneeId: str


class WorkflowTaskCreate(WorkflowTaskBase):
    pass


class WorkflowTaskOut(WorkflowTaskBase):
    id: str
    status: str
    result: Optional[str] = None
    comment: Optional[str] = None
    createdAt: datetime
    completedAt: Optional[datetime] = None

    class Config:
        from_attributes = True


class ApproveRequest(BaseModel):
    comment: Optional[str] = None


class RejectRequest(BaseModel):
    comment: Optional[str] = None