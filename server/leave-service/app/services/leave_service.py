from datetime import datetime
from typing import Optional, List
import uuid

from app.models.leave_request import LeaveRequestInDB, LeaveRequestOut


mock_leaves: List[LeaveRequestInDB] = []


def generate_id() -> str:
    return f"lr-{uuid.uuid4().hex[:8]}"


def get_leave_by_id(leave_id: str) -> Optional[LeaveRequestInDB]:
    return next((leave for leave in mock_leaves if leave.id == leave_id), None)


def get_leaves_by_user(user_id: str) -> List[LeaveRequestInDB]:
    return [leave for leave in mock_leaves if leave.userId == user_id]


def create_leave(user_id: str, start_time: datetime, end_time: datetime, reason: str) -> LeaveRequestOut:
    now = datetime.utcnow()
    leave = LeaveRequestInDB(
        id=generate_id(),
        userId=user_id,
        startTime=start_time,
        endTime=end_time,
        reason=reason,
        status='draft',
        workflowId=None,
        createdAt=now,
        updatedAt=now,
    )
    mock_leaves.append(leave)
    return LeaveRequestOut(**leave.model_dump())


def update_leave(leave_id: str, **updates) -> Optional[LeaveRequestOut]:
    leave = get_leave_by_id(leave_id)
    if not leave:
        return None

    for key, value in updates.items():
        if value is not None and hasattr(leave, key):
            setattr(leave, key, value)
    leave.updatedAt = datetime.utcnow()

    return LeaveRequestOut(**leave.model_dump())


def submit_leave(leave_id: str, workflow_id: str) -> Optional[LeaveRequestOut]:
    leave = get_leave_by_id(leave_id)
    if not leave:
        return None

    leave.status = 'submitted'
    leave.workflowId = workflow_id
    leave.updatedAt = datetime.utcnow()
    return LeaveRequestOut(**leave.model_dump())