from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.core.database import connect_to_mongo, close_mongo_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title='Auth Service', version='0.1.0', lifespan=lifespan)

app.include_router(auth_router)


@app.get('/')
def root():
    return {'message': 'Auth service is running.'}
