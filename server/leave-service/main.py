from fastapi import FastAPI

from app.api.leave import router as leave_router

app = FastAPI(title='Leave Service', version='0.1.0')

app.include_router(leave_router)


@app.get('/')
def root():
    return {'message': 'Leave service is running.'}