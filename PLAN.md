# Implementation Plan: OA 请假系统

## Overview

构建一个前后端分离的 OA 请假系统，微服务架构（auth/leave/workflow），通过 REST API 和 Redis 消息队列通信，支持 Docker 部署。

---

## Architecture Decisions

1. **微服务拆分**：auth-service / leave-service / workflow-service 独立服务
2. **消息队列**：Redis Pub/Sub（服务间异步通信）
3. **数据库**：MongoDB（各服务独立数据库）
4. **服务发现**：手动配置（.env 中定义服务地址）
5. **前端分离**：React SPA，不 Docker 化

---

## Task List

### Phase 1: Foundation（基础设施）

#### Task 1: 目录结构搭建
**Description:** 创建所有服务的目录骨架，包含 Dockerfile、requirements.txt、main.py 基础文件。

**Acceptance criteria:**
- [ ] services/auth-service/ 目录完整
- [ ] services/leave-service/ 目录完整
- [ ] services/workflow-service/ 目录完整
- [ ] client/ 目录完整
- [ ] nginx/nginx.conf 存在
- [ ] docker-compose.yml 存在

**Verification:**
- [ ] `ls services/` 看到三个服务目录
- [ ] `ls client/` 看到 src 目录

**Dependencies:** None

**Files likely touched:**
- services/auth-service/...
- services/leave-service/...
- services/workflow-service/...
- client/src/...
- nginx/nginx.conf
- docker-compose.yml

**Estimated scope:** Medium

---

#### Task 2: Docker Compose 编排
**Description:** 定义 MongoDB + Redis + Nginx + 三个服务的完整编排。

**Acceptance criteria:**
- [ ] docker-compose.yml 包含所有 5 个服务
- [ ] MongoDB 数据持久化配置
- [ ] Redis 配置
- [ ] Nginx 反向代理配置
- [ ] 各服务 depends_on 关系正确

**Verification:**
- [ ] `docker-compose config` 无语法错误
- [ ] 各服务端口映射正确（8001/8002/8003/27017/6379/80）

**Dependencies:** Task 1

**Files likely touched:**
- docker-compose.yml
- nginx/nginx.conf

**Estimated scope:** Small

---

#### Task 3: 公共配置模块
**Description:** 各服务的 core/config.py 和 .env 环境变量配置。

**Acceptance criteria:**
- [ ] .env 文件定义 MONGODB_URL、REDIS_URL、JWT_SECRET 等
- [ ] 各服务 core/config.py 读取 .env
- [ ] 各服务 core/database.py MongoDB 连接
- [ ] 各服务 requirements.txt 包含所需依赖

**Verification:**
- [ ] `docker-compose up` 所有服务启动无连接错误

**Dependencies:** Task 1, Task 2

**Files likely touched:**
- .env
- services/*/app/core/config.py
- services/*/app/core/database.py

**Estimated scope:** Small

---

**Checkpoint: After Phase 1**
- [ ] Docker 环境 `docker-compose up -d` 可正常启动
- [ ] 所有服务 health check 通过
- [ ] MongoDB / Redis 连接正常

---

### Phase 2: Auth Service（认证服务）

#### Task 4: 用户数据模型 + CRUD
**Description:** User MongoDB model 和 Pydantic schemas，基础 CRUD 操作。

**Acceptance criteria:**
- [ ] User model 可创建/查询用户
- [ ] password_hash 使用 bcrypt
- [ ] 单元测试通过

**Verification:**
- [ ] `pytest services/auth-service/tests/ -v` 通过

**Dependencies:** Phase 1

**Files likely touched:**
- services/auth-service/app/models/user.py
- services/auth-service/app/services/user.py
- services/auth-service/tests/

**Estimated scope:** Small

---

#### Task 5: 登录 API
**Description:** POST /api/auth/login，返回 JWT token。

**Acceptance criteria:**
- [ ] POST /api/auth/login 接受 username/password
- [ ] 密码正确返回 JWT token
- [ ] 密码错误返回 401
- [ ] curl 测试通过

**Verification:**
- [ ] `curl -X POST http://localhost:8001/api/auth/login -d '{"username":"test","password":"test"}'` 返回 token

**Dependencies:** Task 4

**Files likely touched:**
- services/auth-service/app/api/auth.py
- services/auth-service/app/services/auth.py

**Estimated scope:** Small

---

#### Task 6: JWT 中间件
**Description:** FastAPI 依赖注入，验证 JWT token，提取用户信息。

**Acceptance criteria:**
- [ ] get_current_user() 依赖可用
- [ ] 受保护接口返回 401 无效 token
- [ ] GET /api/auth/me 返回当前用户信息

**Verification:**
- [ ] `curl http://localhost:8001/api/auth/me -H "Authorization: Bearer <token>"` 返回用户信息

**Dependencies:** Task 5

**Files likely touched:**
- services/auth-service/app/core/security.py
- services/auth-service/app/api/auth.py

**Estimated scope:** Small

---

**Checkpoint: After Phase 2**
- [ ] 用户可以注册/登录/登出
- [ ] JWT 鉴权流程正常

---

### Phase 3: Leave Service（请假服务）

#### Task 7: 请假数据模型 + CRUD
**Description:** LeaveRequest MongoDB model 和 Pydantic schemas，基础 CRUD。

**Acceptance criteria:**
- [ ] LeaveRequest model 可创建/查询请假单
- [ ] status 状态机：draft → submitted → approved/rejected
- [ ] 单元测试通过

**Verification:**
- [ ] `pytest services/leave-service/tests/ -v` 通过

**Dependencies:** Phase 1

**Files likely touched:**
- services/leave-service/app/models/leave.py
- services/leave-service/app/services/leave.py
- services/leave-service/tests/

**Estimated scope:** Small

---

#### Task 8: 请假列表/详情 API
**Description:** GET /api/leave 和 GET /api/leave/:id 接口。

**Acceptance criteria:**
- [ ] GET /api/leave 返回当前用户的请假列表
- [ ] GET /api/leave/:id 返回请假详情
- [ ] 需要 JWT 鉴权

**Verification:**
- [ ] curl 测试返回请假数据

**Dependencies:** Task 7, Task 6

**Files likely touched:**
- services/leave-service/app/api/leave.py

**Estimated scope:** Small

---

#### Task 9: 创建/更新请假 API
**Description:** POST /api/leave 和 PUT /api/leave/:id 接口。

**Acceptance criteria:**
- [ ] POST /api/leave 创建请假草稿
- [ ] PUT /api/leave/:id 更新请假（仅 draft 状态）
- [ ] 表单验证：开始时间/结束时间/原因必填
- [ ] 结束时间 > 开始时间

**Verification:**
- [ ] curl 测试创建和更新请假

**Dependencies:** Task 7

**Files likely touched:**
- services/leave-service/app/api/leave.py

**Estimated scope:** Small

---

#### Task 10: 提交请假 API + 消息队列
**Description:** POST /api/leave/:id/submit，状态变为 submitted，发送消息到 Redis。

**Acceptance criteria:**
- [ ] POST /api/leave/:id/submit 状态变为 submitted
- [ ] 只能由创建者提交
- [ ] 发送 Redis 消息到 `leave:submitted` channel
- [ ] 消息包含 leave_request_id 和 user_id

**Verification:**
- [ ] 提交后 Redis PUBSUB 能收到消息
- [ ] 请假状态正确更新

**Dependencies:** Task 7, Task 8, Task 9

**Files likely touched:**
- services/leave-service/app/api/leave.py
- services/leave-service/app/services/queue.py

**Estimated scope:** Small

---

**Checkpoint: After Phase 3**
- [ ] 员工可以创建请假、提交请假
- [ ] Redis 消息发送正常

---

### Phase 4: Workflow Service（工作流微服务）

#### Task 11: 审批任务数据模型
**Description:** WorkflowTask MongoDB model 和 Pydantic schemas。

**Acceptance criteria:**
- [ ] WorkflowTask model 可创建/查询审批任务
- [ ] 单元测试通过

**Verification:**
- [ ] `pytest services/workflow-service/tests/ -v` 通过

**Dependencies:** Phase 1

**Files likely touched:**
- services/workflow-service/app/models/task.py
- services/workflow-service/app/services/task.py
- services/workflow-service/tests/

**Estimated scope:** Small

---

#### Task 12: 消息队列监听
**Description:** 监听 Redis `leave:submitted` channel，收到消息后创建审批任务。

**Acceptance criteria:**
- [ ] 监听 `leave:submitted` channel
- [ ] 收到消息后自动创建 WorkflowTask
- [ ] assignee 设为 HR 角色用户
- [ ] 日志记录消息消费

**Verification:**
- [ ] leave-service 提交请假后，workflow-service 日志显示消息被消费
- [ ] 数据库中 WorkflowTask 已创建

**Dependencies:** Task 10, Task 11

**Files likely touched:**
- services/workflow-service/app/services/queue_listener.py

**Estimated scope:** Small

---

#### Task 13: 待审批列表 API
**Description:** GET /api/workflow/tasks，HR 查看自己的待审批任务。

**Acceptance criteria:**
- [ ] GET /api/workflow/tasks 返回 assigneed_id 为当前 HR 的待审批任务
- [ ] 只返回 pending 状态
- [ ] 需要 HR 角色

**Verification:**
- [ ] HR 账号登录后 curl 测试返回任务列表

**Dependencies:** Task 11, Task 6

**Files likely touched:**
- services/workflow-service/app/api/workflow.py

**Estimated scope:** Small

---

#### Task 14: 审批通过/拒绝 API
**Description:** POST /api/workflow/tasks/:id/approve 和 reject。

**Acceptance criteria:**
- [ ] approve 后状态变为 completed，result = approved
- [ ] reject 后状态变为 completed，result = rejected
- [ ] 发送 Redis 消息通知 leave-service 更新请假状态
- [ ] 只能 assignee 操作

**Verification:**
- [ ] 完整审批流程测试：提交请假 → HR 审批 → 状态同步

**Dependencies:** Task 12, Task 13

**Files likely touched:**
- services/workflow-service/app/api/workflow.py
- services/workflow-service/app/services/queue_publisher.py

**Estimated scope:** Small

---

**Checkpoint: After Phase 4**
- [ ] HR 可以审批请假
- [ ] 请假状态正确同步

---

### Phase 5: Frontend（前端）

#### Task 15: 项目基础配置
**Description:** React + Redux + Router + Ant Design 初始化配置。

**Acceptance criteria:**
- [ ] npm install 成功
- [ ] npm run dev 启动成功
- [ ] Webpack 配置完成
- [ ] Redux store 配置完成

**Verification:**
- [ ] `http://localhost:3000` 可访问

**Dependencies:** None

**Files likely touched:**
- client/package.json
- client/webpack.config.js
- client/src/redux/store.js

**Estimated scope:** Medium

---

#### Task 16: 登录页面
**Description:** 登录页面，账户密码输入，JWT 存储到 localStorage。

**Acceptance criteria:**
- [ ] 登录表单：username + password
- [ ] 登录成功后跳转 /dashboard
- [ ] 登录失败显示错误提示
- [ ] 记住登录状态（刷新页面不重新登录）

**Verification:**
- [ ] 登录流程测试成功

**Dependencies:** Task 6, Task 15

**Files likely touched:**
- client/src/pages/login/LoginPage.tsx
- client/src/services/authService.js

**Estimated scope:** Small

---

#### Task 17: 首页（Dashboard）
**Description:** 左侧快捷链接 + 右侧工作流中心。

**Acceptance criteria:**
- [ ] 左侧显示"请假流程"快捷链接
- [ ] 右侧显示欢迎信息 + 待处理任务统计
- [ ] 根据角色显示不同内容（员工 vs HR）

**Verification:**
- [ ] 页面渲染正常

**Dependencies:** Task 16

**Files likely touched:**
- client/src/pages/dashboard/Dashboard.tsx
- client/src/components/layout/Sidebar.tsx

**Estimated scope:** Small

---

#### Task 18: 请假列表页
**Description:** 显示请假数据，支持新建请假按钮。

**Acceptance criteria:**
- [ ] 列表展示请假（状态/时间/原因）
- [ ] 新建请假按钮 → 跳转 /leave/new
- [ ] 点击请假行 → 跳转 /leave/:id

**Verification:**
- [ ] 列表数据展示正确

**Dependencies:** Task 8, Task 15

**Files likely touched:**
- client/src/pages/leave/LeaveListPage.tsx

**Estimated scope:** Small

---

#### Task 19: 请假表单页
**Description:** 新建/编辑请假表单，日期选择器 + 原因文本框。

**Acceptance criteria:**
- [ ] 开始时间、结束时间 datepicker
- [ ] 请假原因 textarea
- [ ] 表单验证：结束时间 > 开始时间
- [ ] 提交后跳转列表页

**Verification:**
- [ ] 表单提交测试

**Dependencies:** Task 9, Task 18

**Files likely touched:**
- client/src/pages/leave/LeaveFormPage.tsx

**Estimated scope:** Small

---

#### Task 20: HR 审批页
**Description:** 待审批任务列表 + 审批操作（通过/拒绝）。

**Acceptance criteria:**
- [ ] 显示待审批任务列表
- [ ] 通过/拒绝按钮
- [ ] 拒绝需要填写原因
- [ ] 操作后列表更新

**Verification:**
- [ ] HR 审批流程测试

**Dependencies:** Task 13, Task 14, Task 17

**Files likely touched:**
- client/src/pages/hr/ApprovalPage.tsx

**Estimated scope:** Small

---

**Checkpoint: After Phase 5**
- [ ] 前后端联调通过
- [ ] 完整用户流程：登录 → 创建请假 → HR 审批 → 状态更新

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Redis Pub/Sub 消息丢失 | High | 考虑使用 Redis Stream 替代 |
| 服务间 HTTP 调用失败 | Medium | 添加重试机制 + 熔断 |
| 前端状态管理复杂度 | Low | Redux Toolkit 简化 |
| Docker 网络配置 | Medium | 预先测试 all-in-one 启动 |

## Open Questions

1. ~~消息队列用 Redis Pub/Sub 还是 Stream？~~ → **确认用 Pub/Sub**
2. HR 用户如何创建？→ **手动初始化数据库**
3. 审批拒绝后是否可以重新编辑？→ **暂不支持**
4. 审批超时机制？→ **暂不支持**

## Verification

Before starting implementation, confirm:
- [x] Every task has acceptance criteria
- [x] Every task has a verification step
- [x] Task dependencies are identified and ordered correctly
- [x] No task touches more than ~5 files
- [x] Checkpoints exist between major phases
- [ ] Human has reviewed and approved the plan