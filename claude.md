# 带有登录系统的请假流程

## 角色定义

你是一个资深的编程专家，且精通OA流程业务，熟悉办公室OA流程的全部要素

## client文件夹，前端页面逻辑

### 技术栈

- 前端使用 React，UI 采用当前自定义设计风格，无需 Ant Design
- 需要使用 Redux 作为状态管理

### 技能要求
- 登录窗口的设计需要符合 auth2.0 规范
- 使用 Vite 作为构建工具

### 页面逻辑
- 登录页面，有账户，密码提示框
- 工作流首页，需要在左侧有每个流程的快捷链接，右侧为请假流程的工作流中心，点击请假流程的快捷链接，切换到请假流程的数据表中。
- 用户首页为登录页面，用户输入账号密码后，进入请假页面的首页
- 首页显示请假流程的任务列表，用户可以添加新的请假流程

### 请假表单页面
- 需要有工作流信息
- 需要有用户信息，需要用户填写的数据有，开始时间，结束时间，请假原因
- 用户点击提交后，启动工作流

### 工作流设计
- 提交工作流后，流程启动，同时新建一条审批任务给HR审批。

### 设计规范
- 需要考虑流程的可扩展性，后期有可能有更多的流程，所以需要每个流程单独设置文件夹
- user的信息需要做到全局，考虑redux
- 数据库需要用mogodb，前端可以先用假数据测试
- 使用eslint作为编码规范
- 需要使用单元测试

### 前端目录结构
```
client/
├── src/
│   ├── components/       # 可复用组件
│   ├── pages/            # 页面组件
│   │   ├── login/        # 登录页
│   │   ├── dashboard/    # 首页
│   │   └── leave/        # 请假相关页面
│   ├── redux/            # 状态管理
│   │   ├── store.js
│   │   └── slices/       # reducer slices
│   ├── services/         # API请求层
│   ├── router/           # 路由配置
│   └── utils/            # 工具函数
├── public/
├── package.json
└── webpack.config.js
```

### 前端API层设计
- 使用axios封装请求
- 统一拦截器处理token和错误
- 请求模块：authService, leaveService, workflowService

### 前端路由设计
| 路径 | 页面 | 权限 |
|------|------|------|
| /login | 登录页 | 公开 |
| /dashboard | 工作流首页 | 需登录 |
| /leave | 请假列表 | 需登录 |
| /leave/new | 新建请假 | 需登录 |
| /leave/:id | 请假详情 | 需登录 |
| /admin/tasks | 审批任务 | HR角色 |


## server文件夹，服务端逻辑

### 技术栈

- 使用python+fastaapi构建后台服务
- 需要auth
- 需要使用redis做微服务

### 后端目录结构
```
server/
├── app/
│   ├── api/              # API路由
│   │   ├── auth.py       # 认证相关
│   │   ├── leave.py      # 请假相关
│   │   └── workflow.py   # 工作流相关
│   ├── models/           # MongoDB模型
│   │   ├── user.py
│   │   ├── leave_request.py
│   │   └── workflow_task.py
│   ├── services/         # 业务逻辑
│   │   ├── auth_service.py
│   │   └── workflow_service.py
│   └── core/             # 核心配置
│       ├── config.py
│       └── database.py
├── requirements.txt
└── main.py
```

### 数据库模型

**User（用户表）**
- `_id`: ObjectId
- `username`: string
- `password_hash`: string
- `email`: string
- `role`: string（employee/HR/admin）
- `created_at`: datetime

**LeaveRequest（请假表）**
- `_id`: ObjectId
- `user_id`: ObjectId
- `start_time`: datetime
- `end_time`: datetime
- `reason`: string
- `status`: string（draft/submitted/approved/rejected）
- `workflow_id`: ObjectId
- `created_at`: datetime
- `updated_at`: datetime

**WorkflowTask（审批任务表）**
- `_id`: ObjectId
- `workflow_id`: ObjectId
- `assignee_id`: ObjectId（审批人）
- `status`: string（pending/completed）
- `result`: string（approved/rejected）
- `comment`: string
- `created_at`: datetime
- `completed_at`: datetime

### API 路由设计

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 用户登出 |
| GET | /api/auth/me | 获取当前用户信息 |
| GET | /api/leave | 获取请假列表 |
| POST | /api/leave | 创建请假单 |
| GET | /api/leave/:id | 获取请假详情 |
| PUT | /api/leave/:id | 更新请假单 |
| POST | /api/leave/:id/submit | 提交请假单 |
| GET | /api/workflow/tasks | 获取待审批任务 |
| POST | /api/workflow/tasks/:id/approve | 审批通过 |
| POST | /api/workflow/tasks/:id/reject | 审批拒绝 |

### Redis 用途
- **Session 存储**：用户登录状态
- **接口限流**：防止恶意请求
- **Token 缓存**：JWT 黑名单/刷新

### 工作流状态机
```
[draft] → [submitted] → [HR_approving] → [approved] → [completed]
                        ↓
                   [rejected] → [employee_edit] → [submitted]
```

### 通用规范
- 使用 .env 管理环境变量（数据库连接、JWT密钥等）
- 统一错误响应格式：`{code, message, data}`
- 所有接口需要 JWT 鉴权（登录接口除外）
- 日志使用 Python logging 模块
- 使用 Swagger/OpenAPI 生成接口文档
