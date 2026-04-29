from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime

from app.services.leave_service import (
    get_leaves_by_user,
    get_leave_by_id,
    create_leave,
    update_leave,
    submit_leave,
)

router = APIRouter(prefix='/api/leave', tags=['leave'])


class LeaveCreateRequest(BaseModel):
    startTime: str
    endTime: str
    reason: str


class LeaveUpdateRequest(BaseModel):
    startTime: str | None = None
    endTime: str | None = None
    reason: str | None = None


def parse_datetime(dt_str: str) -> datetime:
    try:
        return datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
    except ValueError:
        try:
            return datetime.strptime(dt_str, '%Y-%m-%dT%H:%M:%S')
        except ValueError:
            return datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')


@router.get('')
async def get_leave_list(user_id: str = 'u-2001'):
    leaves = get_leaves_by_user(user_id)
    return {'code': 0, 'message': 'success', 'data': leaves}


@router.post('')
async def create_leave_request(payload: LeaveCreateRequest, user_id: str = 'u-2001'):
    start = parse_datetime(payload.startTime)
    end = parse_datetime(payload.endTime)
    leave = create_leave(user_id, start, end, payload.reason)
    return {'code': 0, 'message': 'success', 'data': leave}


@router.get('/{leave_id}')
async def get_leave_detail(leave_id: str):
    leave = get_leave_by_id(leave_id)
    if not leave:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='请假申请不存在')
    return {'code': 0, 'message': 'success', 'data': leave}


@router.put('/{leave_id}')
async def update_leave_request(leave_id: str, payload: LeaveUpdateRequest):
    updates = {}
    if payload.startTime:
        updates['startTime'] = parse_datetime(payload.startTime)
    if payload.endTime:
        updates['endTime'] = parse_datetime(payload.endTime)
    if payload.reason:
        updates['reason'] = payload.reason

    leave = update_leave(leave_id, **updates)
    if not leave:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='请假申请不存在')
    return {'code': 0, 'message': 'success', 'data': leave}


@router.post('/{leave_id}/submit')
async def submit_leave_request(leave_id: str, workflow_id: str | None = None):
    import uuid
    if workflow_id is None:
        workflow_id = f"wf-{uuid.uuid4().hex[:8]}"
    leave = submit_leave(leave_id, workflow_id)
    if not leave:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='请假申请不存在')
    return {'code': 0, 'message': 'success', 'data': leave}