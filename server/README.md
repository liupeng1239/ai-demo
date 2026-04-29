# Server Microservices

## Services

- `auth-service` - Authentication service (port 8001)
- `leave-service` - Leave request management (port 8002)
- `workflow-service` - Workflow task management (port 8003)

## Running Services

```bash
# Auth Service
cd auth-service && uvicorn main:app --reload --port 8001

# Leave Service
cd leave-service && uvicorn main:app --reload --port 8002

# Workflow Service
cd workflow-service && uvicorn main:app --reload --port 8003
```
