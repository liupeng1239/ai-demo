from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.services.workflow_service import (
    get_pending_tasks,
    get_task_by_id,
    approve_task,
    reject_task,
)

router = APIRouter(prefix='/api/workflow/tasks', tags=['workflow'])


@router.get('')
async def get_tasks(assignee_id: Optional[str] = None):
    if assignee_id:
        from app.services.workflow_service import get_tasks_by_assignee
        tasks = get_tasks_by_assignee(assignee_id)
    else:
        tasks = get_pending_tasks()
    return {'code': 0, 'message': 'success', 'data': tasks}


@router.post('/{task_id}/approve')
async def approve_workflow_task(task_id: str, comment: Optional[str] = None):
    task = approve_task(task_id, comment)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='任务不存在或已完成')
    return {'code': 0, 'message': 'success', 'data': task}


@router.post('/{task_id}/reject')
async def reject_workflow_task(task_id: str, comment: Optional[str] = None):
    task = reject_task(task_id, comment)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='任务不存在或已完成')
    return {'code': 0, 'message': 'success', 'data': task}