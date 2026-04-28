# OA 请假系统规范

## Objective

构建一个前后端分离的 OA 请假系统，包含用户登录、请假申请、HR审批功能。系统采用微服务架构，工作流独立为服务，通过 REST API 和消息队列通信，支持后期扩展。

**用户故事：**
- 员工可以登录系统、提交请假申请、查看申请状态
- HR 可以登录系统、审批请假申请、查看待审批任务
- 请假提交后，消息队列通知工作流服务创建审批任务

## Tech Stack

### 前端
- React 18 + TypeScript
- Tailwind CSS（基于UI设计系统）
- Redux Toolkit（状态管理）
- Webpack 5（构建）
- Axios（HTTP 客户端）

### 后端（微服务）
- Python FastAPI
- MongoDB（主数据库）
- Redis（缓存 + 消息队列）
- Docker + Docker Compose（容器化）

### 服务拆分
| 服务 | 端口 | 职责 |
|------|------|------|
| auth-service | 8001 | 用户认证、Session 管理 |
| leave-service | 8002 | 请假 CRUD、提交审批 |
| workflow-service | 8003 | 审批任务、审批流程（独立微服务） |

## Architecture

```
[Client]
    │
    ▼ HTTP
[Nginx Gateway]
    │
    ├─────────────────┬────────────────┐
    ▼                 ▼                ▼
[auth-service]   [leave-service]  [workflow-service]
    │                 │                │
    └────────┬────────┴────────────────┘
             │
       ┌─────┴─────┐
       │           │
   [MongoDB]    [Redis]
                 │
            ┌────┴────┐
            │  消息队列 │
            └─────────┘
```

## Commands

### 本地开发
```bash
# 启动所有服务（Docker Compose）
docker-compose up -d

# 单独启动某服务
docker-compose up -d auth-service

# 查看日志
docker-compose logs -f auth-service

# 停止所有服务
docker-compose down
```

### 前端开发
```bash
cd client
npm install
npm run dev
```

### 后端开发（各服务独立运行）
```bash
# Auth Service
cd services/auth-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001

# Leave Service
cd services/leave-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8002

# Workflow Service
cd services/workflow-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8003
```

### 测试
```bash
# 后端单元测试（各服务内）
pytest tests/ -v --cov

# 前端测试
npm test
```

## Project Structure

```
project/
├── client/                    # 前端（不需要 Docker）
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   └── leave/
│   │   ├── redux/
│   │   ├── services/
│   │   └── router/
│   ├── package.json
│   └── webpack.config.js
│
├── services/                  # 后端微服务
│   ├── auth-service/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── core/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── main.py
│   │
│   ├── leave-service/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── core/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── main.py
│   │
│   └── workflow-service/
│       ├── app/
│       │   ├── api/
│       │   ├── models/
│       │   ├── services/
│       │   └── core/
│       ├── Dockerfile
│       ├── requirements.txt
│       └── main.py
│
├── nginx/
│   └── nginx.conf             # 反向代理配置
│
├── docker-compose.yml         # 编排所有服务
├── .env                       # 环境变量
└── README.md
```

## Code Style

### Python (FastAPI)
```python
# 目录结构：按功能分模块，不按类型分
app/
├── api/
│   └── leave.py      # leave 相关路由
├── models/
│   └── leave.py      # Pydantic models
├── services/
│   └── leave.py      # 业务逻辑
└── core/
    ├── config.py     # 配置
    └── database.py   # 数据库连接

# 命名规范
- API路由：snake_case（leave_request）
- Pydantic Model：PascalCase（LeaveRequest）
- 函数：snake_case
```

### React (TypeScript)
```typescript
// 目录结构：按功能/页面分
pages/
├── leave/
│   ├── LeaveList.tsx
│   ├── LeaveForm.tsx
│   └── LeaveDetail.tsx
├── dashboard/
│   └── Dashboard.tsx
├── hr/
│   └── ApprovalPage.tsx
├── login/
│   └── LoginPage.tsx

// 命名规范
- 组件文件：PascalCase（LeaveForm.tsx）
- 普通文件：camelCase（leaveService.ts）
- 样式文件：kebab-case（leave-form.css）

// Ant Design 主题定制（匹配 Admin Zen 设计规范）
// primary: '#00685f'
```

### 前端 API 层
- 使用 axios 封装请求，统一拦截器处理 token
- 服务模块：authService、leaveService、workflowService
- API 基础路径通过 Nginx 反向代理

## Testing Strategy

### 后端
- 框架：pytest
- 位置：`services/*/tests/`
- 覆盖要求：核心业务逻辑 80%+
- 级别：单元测试（不依赖外部服务）

### 前端
- 框架：Jest + React Testing Library
- 位置：`client/src/__tests__/`
- 覆盖要求：组件逻辑、表单验证

### 集成测试
- 使用 Docker Compose 创建完整环境
- 测试服务间通信

## UI Design System（Admin Zen 设计规范）

### 色彩系统
- **Primary**: Teal (#00685f) - 主按钮/活跃状态
- **Secondary**: Slate (#505f76) - 次要信息
- **Surface**: 白色 (#ffffff) - 卡片/容器背景
- **Border**: Soft grey (#E2E8F0) - 边框
- **Status**:
  - 已通过：Green (#dcfce7 bg, #16a34a text)
  - 待审批：Amber (#fef3c7 bg, #d97706 text)
  - 已驳回：Red (#fee2e2 bg, #dc2626 text)
  - 已撤回：Grey (#f1f5f9 bg, #64748b text)

### 字体
- **Font Family**: Inter + Microsoft YaHei + sans-serif
- **Display**: 30px/600 - 页面大标题
- **Headline**: 24px/600 - 区块标题
- **Title**: 18px/500 - 卡片标题
- **Body**: 16px/400 - 正文
- **Label**: 12px/600 - 标签/表头（小写加粗）

### 布局
- **Sidebar**: 固定左侧，宽度 256px
- **Top Bar**: 固定顶部，高度 64px
- **Content**: 左侧 256px + 顶部 64px 偏移
- **Container Padding**: 32px
- **Gutter**: 24px
- **Element Gap**: 16px

### 组件样式
- **Border Radius**: 0.5rem (lg) / 0.75rem (xl)
- **Card Shadow**: 0px 4px 12px rgba(0,0,0,0.03) (hover)
- **Modal Shadow**: 0px 10px 30px rgba(0,0,0,0.08)
- **Button Primary**: bg-primary + white text, rounded-lg
- **Button Secondary**: white bg + border + primary text
- **Input**: 1px border, focus 时 border 变为 primary

### 状态徽章 (Pill-shaped)
```html
<span class="px-3 py-1 rounded-full text-xs font-medium bg-{color}-50 text-{color}-700">
  状态文字
</span>
```

---

## Data Models

### User（auth-service）
```python
{
    "_id": ObjectId,
    "username": str,
    "password_hash": str,
    "email": str,
    "role": str,  # "employee" | "hr" | "admin"
    "created_at": datetime
}
```

### LeaveRequest（leave-service）
```python
{
    "_id": ObjectId,
    "user_id": str,
    "start_time": datetime,
    "end_time": datetime,
    "reason": str,
    "status": str,  # "draft" | "submitted" | "approved" | "rejected"
    "workflow_task_id": str | None,
    "created_at": datetime,
    "updated_at": datetime
}
```

### WorkflowTask（workflow-service）
```python
{
    "_id": ObjectId,
    "leave_request_id": str,
    "assignee_id": str,  # HR user_id
    "status": str,  # "pending" | "completed"
    "result": str | None,  # "approved" | "rejected"
    "comment": str | None,
    "created_at": datetime,
    "completed_at": datetime | None
}
```

## API Contracts

### Auth Service (port 8001)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | 登录，返回 JWT |
| POST | /api/auth/logout | 登出 |
| GET | /api/auth/me | 获取当前用户信息 |

### Leave Service (port 8002)
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/leave | 获取请假列表 |
| POST | /api/leave | 创建请假单 |
| GET | /api/leave/:id | 获取请假详情 |
| PUT | /api/leave/:id | 更新请假单 |
| POST | /api/leave/:id/submit | 提交请假（触发工作流） |

### Workflow Service (port 8003)
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/workflow/tasks | 获取待审批任务（HR） |
| POST | /api/workflow/tasks/:id/approve | 审批通过 |
| POST | /api/workflow/tasks/:id/reject | 审批拒绝 |

### 服务间通信（消息队列）
- leave-service 提交请假后，发送消息到 Redis 队列
- workflow-service 监听队列，创建审批任务
- 审批完成后，workflow-service 发送消息通知 leave-service 更新状态

## Boundaries

### Always
- 所有服务独立 Dockerfile
- 服务间通过 REST API 通信，不直接访问对方数据库
- 配置通过 .env 环境变量，不硬编码
- 提交前运行单元测试

### Ask First
- 修改数据库 schema
- 添加新的微服务
- 修改 API 契约
- 引入新的中间件或消息队列

### Never
- 在代码中硬编码密码/密钥
- 直接连接其他服务的数据库
- 移除现有的测试

## Success Criteria

1. ✅ 用户可以登录系统（employee / hr 角色）
2. ✅ 员工可以创建请假单、提交请假
3. ✅ HR 可以看到待审批任务列表
4. ✅ HR 可以审批通过/拒绝请假
5. ✅ 员工可以看到请假审批结果
6. ✅ 所有服务可通过 Docker Compose 一键启动
7. ✅ 后端服务间通过消息队列异步通信
8. ✅ 工作流服务独立，可扩展
9. ✅ 单元测试覆盖率 80%+

## Open Questions

1. 消息队列具体用 Redis 的什么机制？（Pub/Sub 还是 Stream？）
2. HR 角色的用户是如何创建的？（手动初始化还是支持注册？）
3. 审批拒绝后，员工是否可以重新编辑提交？
4. 是否有审批超时机制？（超时后自动通过/拒绝）