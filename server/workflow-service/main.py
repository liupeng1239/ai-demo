from fastapi import FastAPI

from app.api.workflow import router as workflow_router

app = FastAPI(title='Workflow Service', version='0.1.0')

app.include_router(workflow_router)


@app.get('/')
def root():
    return {'message': 'Workflow service is running.'}