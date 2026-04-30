
from fastapi import FastAPI
app = FastAPI(title='ai', version='0.1.0')


@app.get('/')
def root():
    return {'message': 'AI service is running.'}
