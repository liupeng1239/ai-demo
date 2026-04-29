from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.mongodb_db_name]

    # Create indexes
    await db.users.create_index("username", unique=True)
    await db.users.create_index("email", unique=True)

    # Insert default users if not exist
    from app.services.auth_service import get_password_hash
    hr_user = await db.users.find_one({"username": "hr"})
    if not hr_user:
        await db.users.insert_one({
            "username": "hr",
            "full_name": "张敏",
            "email": "zhangmin@example.com",
            "hashed_password": get_password_hash("password123"),
            "role": "HR",
        })
    employee_user = await db.users.find_one({"username": "employee"})
    if not employee_user:
        await db.users.insert_one({
            "username": "employee",
            "full_name": "李华",
            "email": "lihua@example.com",
            "hashed_password": get_password_hash("password123"),
            "role": "employee",
        })

async def close_mongo_connection():
    global client
    if client:
        client.close()

def get_database():
    return db
