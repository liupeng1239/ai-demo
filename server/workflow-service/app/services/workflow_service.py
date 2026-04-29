from datetime import datetime
from typing import Optional, List
import uuid

from app.models.workflow_task import WorkflowTaskOut


mock_tasks: List[WorkflowTaskOut] = []


def generate_id() -> str:
    return f"wt-{uuid.uuid4().hex[:8]}"


def generate_workflow_id() -> str:
    return f"wf-{uuid.uuid4().hex[:8]}"


def get_task_by_id(task_id: str) -> Optional[WorkflowTaskOut]:
    return next((task for task in mock_tasks if task.id == task_id), None)


def get_pending_tasks() -> List[WorkflowTaskOut]:
    return [task for task in mock_tasks if task.status == 'pending']


def get_tasks_by_assignee(assignee_id: str) -> List[WorkflowTaskOut]:
    return [task for task in mock_tasks if task.assigneeId == assignee_id]


def create_task(workflow_id: str, assignee_id: str) -> WorkflowTaskOut:
    now = datetime.utcnow()
    task = WorkflowTaskOut(
        id=generate_id(),
        workflowId=workflow_id,
        assigneeId=assignee_id,
        status='pending',
        result=None,
        comment=None,
        createdAt=now,
        completedAt=None,
    )
    mock_tasks.append(task)
    return task


def approve_task(task_id: str, comment: Optional[str] = None) -> Optional[WorkflowTaskOut]:
    task = get_task_by_id(task_id)
    if not task or task.status != 'pending':
        return None

    task.status = 'completed'
    task.result = 'approved'
    task.comment = comment
    task.completedAt = datetime.utcnow()
    return task


def reject_task(task_id: str, comment: Optional[str] = None) -> Optional[WorkflowTaskOut]:
    task = get_task_by_id(task_id)
    if not task or task.status != 'pending':
        return None

    task.status = 'completed'
    task.result = 'rejected'
    task.comment = comment
    task.completedAt = datetime.utcnow()
    return task