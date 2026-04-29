import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / '.env')


class Settings:
    jwt_secret_key: str = os.getenv('JWT_SECRET_KEY', 'change-me-in-production')
    jwt_algorithm: str = os.getenv('JWT_ALGORITHM', 'HS256')
    access_token_expire_minutes: int = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '60'))
    mongodb_url: str = os.getenv('MONGODB_URL', 'mongodb://admin:admin123@localhost:27017/?authSource=admin')
    mongodb_db_name: str = os.getenv('MONGODB_DB_NAME', 'oa_system')


settings = Settings()
