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

### Redux 异步操作错误处理规范

**核心原则：通过 dispatch 返回值判断成功/失败，而不是 try-catch**

Redux async thunk 在 API 返回错误时不会自动抛出异常，Promise 不会 reject。因此必须通过 thunk 的返回值来判断：

```typescript
// ✅ 正确做法：通过 rejectWithValue 传递错误，dispatch 返回值包含 rejected/fulfilled 状态
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials.username, credentials.password);
      return response;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : '登录失败');
    }
  }
);

// 调用时检查 dispatch 返回值
const result = await dispatch(login({ username, password }));
if (login.rejected.match(result)) {
  // 登录失败，通过 result.payload 获取错误信息
  throw new Error(result.payload as string);
}
// 登录成功，继续执行
return result.payload;
```

**错误示例（禁止使用）：**
```typescript
// ❌ 错误：try-catch 无法捕获 Redux thunk 的 reject
try {
  await dispatch(login({ username, password }));
  // 这里总是会执行，因为 thunk 不会抛出异常
} catch (error) {
  // 永远不会进入这里
}
```

### API Service 错误处理规范

**axios 响应拦截器必须处理 HTTP 错误状态码：**

```typescript
// services/api.ts
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 服务器返回了错误状态码（401, 403, 500 等）
      const detail = error.response.data?.detail;
      if (detail) {
        throw new Error(detail);  // 抛出具体错误信息
      }
      throw new Error(error.response.data?.message || '请求失败');
    }
    if (error.request) {
      // 请求已发出但没有收到响应
      throw new Error('网络连接失败，请检查网络');
    }
    throw new Error('网络错误，请检查连接');
  }
);
```

**服务端 FastAPI 错误响应格式：**
```python
# 正确返回错误
raise HTTPException(status_code=401, detail="用户名或密码错误")
# 或
return {"detail": "用户名或密码错误"}
```

前端拦截器会捕获 `error.response.data.detail`，并将其转换为 Error 对象抛出。

### 前端页面调用模式

```typescript
// ✅ 正确：在组件中使用 dispatch 返回值判断
async function handleSubmit() {
  setIsSubmitting(true);
  const result = await dispatch(loginAction({ username, password }));

  if (loginAction.rejected.match(result)) {
    setError(result.payload as string);
    return;
  }

  // 登录成功
  navigate('/dashboard');
}

// ❌ 错误：依赖 try-catch 判断
async function handleSubmit() {
  try {
    await dispatch(loginAction({ username, password }));
    // thunk 不会抛出异常，这里总是执行
  } catch (error) {
    // 永远不会进入
  }
}
```
