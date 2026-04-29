import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / '.env')


class Settings:
    mongodb_url: str = os.getenv('MONGODB_URL', 'mongodb://localhost:27017')
    mongodb_db_name: str = os.getenv('MONGODB_DB_NAME', 'workflow_db')
    redis_url: str = os.getenv('REDIS_URL', 'redis://localhost:6379')


settings = Settings()