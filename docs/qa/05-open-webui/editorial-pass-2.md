# 第五册第二轮整册写作校订

校订日期：2026-09-10

状态：已完成并通过仓库内验证，等待 Owner 复核

范围：第 6、8、9、11、12 章，以及与这些章节直接关联的资料来源、技术事实台账和内容合同；
不改变已确认的书名、章节顺序、slug、远程 OpenAI-compatible 主线或外部操作闸门。

## 为什么处理这五章

第一轮已经固定部署版本和基础设施交接路径；第二轮集中处理“服务已经能开以后”的高风险误解：

1. 管理员后端连接和浏览器 Direct Connections 可能显示相似模型，却使用不同凭证与网络路径；
2. 一次用户消息可能触发后台模型任务，不能用点击次数直接推断费用；
3. 用户权限、群组和资源授权会叠加，分享也不止“公开 / 不公开”两档；
4. 公开加固后的 SSH 本地浏览器不再是等价登录对照；
5. 凭证、Tunnel 费用、临时下线与永久退役需要更精确的交接描述。

## 本轮写作结果

### 第 6、8 章：固定唯一模型请求路径与可解释费用窗口

- 明确管理员 External connection 由 Open WebUI 后端请求提供方；实验性 Direct Connections 则由浏览器
  直接请求，个人 key 当前保存在浏览器 local storage，并需要提供方允许 CORS；第一版保持关闭；
- 第一次付费探针前，记录并关闭本次不需要的 Title、Tags、Follow Up、Autocomplete、Retrieval Query
  和 Web Search Query 后台任务；
- 电脑与手机测试分别记录时间窗，等待第一段用量稳定后再进入第二段；持续未知请求不能笼统解释为后台任务。

### 第 9 章：把角色、叠加权限和分享范围分开

- 增加 Default Permissions、全部群组、直接资源授权的叠加检查；限制性群组不能抵消另一群组的授予；
- 普通 user 第一版同时关闭文件、Web、Tools、Functions、MCP、Direct Connections 和 Open WebUI API key；
- 分享改为三类：指定用户/群组、Public（全部已登录用户）和 Open（任何持链接者，无需登录，只读）；
- 管理员不需要读取聊天时，同时核对 `ENABLE_ADMIN_CHAT_ACCESS` 与 `ENABLE_ADMIN_EXPORT`；关闭 UI 仍不等于
  主机、数据库或备份管理员无法访问数据。

### 第 11、12 章：修正诊断和交接假设

- 公开 HTTPS 已使用精确 CORS Origin 与 Secure Cookie 后，HTTP SSH 页面可能按设计无法等价登录；
  排错应比较 VPS `/health` / `/api/config` 与公开 HTTPS，不为诊断永久放宽安全配置；
- 只有单台浏览器出现额外模型时，先检查 Direct Connections 与该浏览器 local storage；
- Open WebUI API key 当前一名用户只有一把，新建会替换旧 key，继承用户权限且不会自动到期；第一版关闭；
- 模型提供方不支持两把 key 并存时，轮换必须安排中断窗口，不能套用“先建后删”；
- 交接卡不再假设第四册 Tunnel 必然保留，改为记录“安全复用 / 第五册专用”来源；
- 截至 2026-09-10，Cloudflare Tunnel 所有方案可用，发布应用不要求购买 Access；这不代表账户内
  zone、Workers、R2、Argo 或其他产品没有费用。

## 官方证据

- <https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible/>；
- <https://docs.openwebui.com/features/chat-conversations/direct-connections/>；
- <https://docs.openwebui.com/features/administration/task-models/>；
- <https://docs.openwebui.com/features/authentication-access/rbac/>；
- <https://docs.openwebui.com/features/authentication-access/rbac/permissions/>；
- <https://docs.openwebui.com/features/authentication-access/api-keys/>；
- <https://docs.openwebui.com/reference/env-configuration/>；
- <https://docs.openwebui.com/troubleshooting/connection-error/>；
- <https://developers.cloudflare.com/tunnel/>；
- <https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/>；
- <https://developers.cloudflare.com/billing/understand/usage-based-billing/>。

## 明确保留的边界

- 15 个内容单元继续 `draft: true`，第五册继续是 `drafting / 0.0.0`；
- production、Pagefind、完成状态和正式打印继续排除第五册；
- 未启用 Direct Connections、后台模型任务、第二用户、分享、管理员导出或 Open WebUI API key；
- 未创建 VPS、容器、管理员、Tunnel 或 route，未保存模型 key，未调用真实模型；
- 未执行 add、commit、push、部署或发布，没有新增费用。

## 验证结果

- [x] Astro typecheck：88 个文件，0 errors、0 warnings、0 hints；ESLint 通过；
- [x] Vitest：13 个测试文件、171 项测试通过，其中第五册专用测试 21 项；
- [x] production / Pagefind 排除：production 仍为 71 页，Pagefind 仍索引前四册 60 个正文页；
  第五册 production HTML 与 Pagefind 引用均为 0；
- [x] 内容、发布准备与内部链接：全部通过，71 个 HTML 中 2075 条内部链接有效；
- [x] 响应式：五章在 375、768、1440 三种宽度共 15 组检查中无页面级横向溢出；
- [x] 深色、无 JavaScript 与打印：1440 深色排错章可读；五章在 375 宽度关闭 JavaScript 后完整可读；
  开发环境草稿打印页包含 15 个内容单元且无横向溢出，正式打印仍未启用；
- [x] 浏览器控制台：五章没有 error；
- [x] 官方外链：本轮 11 个 Open WebUI 与 Cloudflare 官方链接均返回 HTTP 200；
- [x] 敏感模式与 diff：28 个第五册正文、规划、QA 和测试文件中，私钥、API key、JWT、UUID
  模式均为 0；`git diff --check` 通过；
- [x] 依赖审计已执行：仍为 8 项开发工具链风险（2 moderate、5 high、1 critical）；本轮没有执行
  `npm audit fix` 或改变依赖，保持独立维护任务边界；
- [x] `PROJECT_STATUS.yaml`：在本轮内容与验证证据回填后使用 v1 校验器复核。

本轮只证明草稿内容、技术事实、布局和 production 隔离通过仓库内校订，不代表管理员连接、
Direct Connections、Task Models、RBAC、分享、模型费用、Tunnel 或退役路径已通过实机验证。
