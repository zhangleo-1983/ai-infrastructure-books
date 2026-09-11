# 第五册技术事实校订台账

初始校订日期：2026-08-23

最近复核日期：2026-09-11

状态：第五册 RC 官方事实基线已建立；RC 实机 G1—G8 已通过并完成永久清理

## 使用原则

- 版本、界面、环境变量、模型连接、费用和许可都属于时效性事实；
- 只用 Open WebUI 官方文档、官方 GitHub 仓库和选定模型提供方官方资料；
- 社区教程只能作为问题线索，不能单独决定正文步骤；
- 样章当前只验证信息结构，不声称外部操作已经通过；
- 正式写作、实机校订和每个 RC 前重新检查本台账。

## 已核对事实

| 主题 | 当前结论 | 官方来源 | 样章使用位置 | 后续复核 |
| --- | --- | --- | --- | --- |
| 推荐安装路径 | 官方 Quick Start 把 Docker 列为普通用户推荐路径 | <https://docs.openwebui.com/getting-started/quick-start/> | 开始篇、后续第 4 章接口 | 固定 RC 版本时重查 |
| 镜像标签 | `:main` 与 `:latest` 是滚动标签；官方提供固定 `vX.Y.Z` 标签 | 同上 | 策划、开始篇 | 样章部署章与 RC 重查 |
| 当前稳定版本 | GitHub Releases API 于 2026-09-10 返回最新非预发布版本 `v0.11.3`，发布于 2026-08-31；初始 draft 的 `v0.11.0` 不再是最新稳定版 | <https://api.github.com/repos/open-webui/open-webui/releases/latest>、<https://github.com/open-webui/open-webui/releases/tag/v0.11.3> | 第 3—4、10 章 | 每个 RC 前重查版本、release notes 与已知问题 |
| 持久数据 | Docker 示例把 `/app/backend/data` 挂载到 volume | 同上 | 开始篇数据边界 | 实机恢复验证 |
| 镜像健康检查 | v0.11.3 官方 Dockerfile 通过容器 `/health` endpoint 执行 HEALTHCHECK | <https://github.com/open-webui/open-webui/blob/v0.11.3/Dockerfile> | 第 4 章 | Ubuntu 24.04 amd64 实机验证状态与输出 |
| WebSocket | Quick Start 与连接排错说明当前版本需要 WebSocket | <https://docs.openwebui.com/troubleshooting/connection-error/> | 第 11 章 | Cloudflare route 实机验证 |
| 首位管理员 | Hardening 说明首次注册用户成为管理员，首次注册后 signup 自动关闭 | <https://docs.openwebui.com/getting-started/advanced-topics/hardening/> | 开始篇接口、第 5/11 章引用 | 第 5 章实机验证 |
| 默认新用户角色 | `DEFAULT_USER_ROLE` 当前默认为 `pending` | <https://docs.openwebui.com/reference/env-configuration/> | 策划与后续用户章 | 完整正文前重查 |
| Admin / User 设置 | Admin Settings 管全局连接与安全，User Settings 只管个人偏好 | <https://docs.openwebui.com/getting-started/quick-start/settings/> | 第 6 章 | UI 二校 |
| 兼容模型接口 | Open WebUI 支持 OpenAI-compatible Chat Completions | <https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible/> | 开始篇、第 6/11 章 | 选定提供方后重查 |
| 模型发现 | 保存连接时会用 Bearer token 请求 `/models`；不支持时可按官方模型 ID 建 allowlist | 同上 | 第 6/11 章 | 提供方实机验证 |
| 必需 endpoint | `/v1/chat/completions` 必需；`/v1/models` 推荐用于发现 | 同上 | 第 6 章 | 选定接口后重查 |
| key 权限 | 官方环境变量文档建议兼容后端使用最小权限 key，不使用管理主密钥 | <https://docs.openwebui.com/reference/env-configuration/> | 开始篇、第 6/11 章 | 提供方权限实机验证 |
| DeepSeek 当前模型 | 2026-09-11 官方页面与实机 `/models` 均给出正式 ID `deepseek-flash`，模型版本为 DeepSeek-V4.1-Flash；旧 `deepseek-v4-flash` 等名称会路由到新模型，不应作为新连接主线 | <https://api-docs.deepseek.com/zh-cn/>、<https://api-docs.deepseek.com/zh-cn/quick_start/pricing/>、<https://api-docs.deepseek.com/zh-cn/api/list-models/> | 第 6 章、资料来源 | 每个 RC 前重查模型 ID、别名与版本 |
| DeepSeek 当前价格 | 每 100 万 token：输入缓存命中空闲 / 高峰 0.02 / 0.04 元，缓存未命中 1 / 2 元，输出 4 / 8 元；高峰为北京时间周一至周五 9:00—12:00、14:00—18:00 | <https://api-docs.deepseek.com/zh-cn/quick_start/pricing/> | 第 6 章 | 每次调用前重查，不把价格写成永久值 |
| DeepSeek key 与费用保护 | 当前控制台可创建和单独撤销 key，但实机未见逐 key 权限范围、逐 key 支出上限或告警；本次用专用 key、`deepseek-flash` allowlist、4 元停发线与 5 元人工硬上限补偿 | DeepSeek 控制台实机；<https://cdn.deepseek.com/policies/en-US/deepseek-open-platform-terms-of-service.html> | 第 6 章、实机 runbook | 提供方新增 key scope / hard cap 时重查 |
| DeepSeek 数据政策 | 2026-02-10 版隐私政策适用于 API，说明输入输出处理、可能的训练与优化用途和退出选择；开放平台条款要求下游开发者披露个人信息处理规则并安全保管 key | <https://cdn.deepseek.com/policies/zh-CN/deepseek-privacy-policy.html>、<https://cdn.deepseek.com/policies/en-US/deepseek-open-platform-terms-of-service.html> | 第 6、9 章 | 公开前核对账户退出设置、适用地区与用户告知 |
| 额外调用 | 标题、标签、后续问题建议、自动补全和查询改写等 Task Models 可能在用户消息外发起调用；未另选任务模型时默认使用当前聊天模型 | <https://docs.openwebui.com/faq/>、<https://docs.openwebui.com/features/administration/task-models/> | 开始篇、第 6、8、11 章 | 固定测试前核对任务开关与提供方实际用量 |
| Direct Connections | 实验性 Direct Connections 让浏览器绕过 Open WebUI 后端直接请求提供方，个人 key 当前保存在浏览器 local storage，并要求提供方允许 CORS；第一版保持关闭 | <https://docs.openwebui.com/features/chat-conversations/direct-connections/> | 第 6、8、9、11 章 | v0.11.3 管理员开关、普通用户入口、浏览器存储与网络来源实机验证 |
| Evaluation Arena | `v0.11.3` 即使设置提供方模型 allowlist，内置评测竞技场仍可能额外显示 `arena-model`；关闭 Arena models 后，实机模型列表只剩 `deepseek-flash` | v0.11.3 管理员设置与 `/api/models` 实机 | 第 6 章 | Open WebUI 版本或 Evaluations 默认值变化 |
| Cloudflare Tunnel | 官方 HTTPS 参考列出 Tunnel，要求公开 URL、CORS、WebSocket 与流式链路正确 | <https://docs.openwebui.com/reference/https/cloudflare-tunnel/> | 第 11 章 | 2026-09-11 G5 已验证唯一 `chat` route、HTTPS、精确 CORS、WebSocket 与 SSE |
| Published application | Cloudflare 当前把 published application 定义为公开 hostname 到本地 service 的映射；从 Tunnel 控制台添加 route 可自动建立 DNS 记录 | <https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/> | 第 7、11 章 | 2026-09-11 G5 已验证自动 DNS、Proxied 与回环 service 映射 |
| Tunnel 与 Access 费用 | Tunnel 当前在所有方案可用，发布公开应用不要求购买 Access；这不代表 zone、Workers、R2、Argo 或账户中其他产品没有费用 | <https://developers.cloudflare.com/tunnel/>、<https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/>、<https://developers.cloudflare.com/billing/understand/usage-based-billing/> | 第 12 章 | 每个 RC 核对账户方案、启用产品与账单 |
| 单一 connector service | Cloudflare 当前说明同一机器通常只安装一个 `cloudflared` system service，应在既有 Tunnel 上增加 route 而非重复安装 connector | <https://developers.cloudflare.com/cloudflare-one/troubleshooting/tunnel/> | 第 7 章 | 第四册交接对象与第五册 route 共存实机验证 |
| Tunnel 错误边界 | 官方文档用 1033 指向无健康 connector、502 指向 connector 无法到达源站；本轮实机实际观察到应用停止 502、错误 route 500、connector 停止 530，说明错误码是条件结果 | 同上；第五册 G6 实机 | 第 7、11 章 | 每个 RC 重跑并按失败层判断 |
| 公开 URL 与 CORS | `WEBUI_URL` 当前是 ConfigVar；`CORS_ALLOW_ORIGIN` 应精确包含实际 Origin，否则可能出现 WebSocket、空对象或流式解析异常 | <https://docs.openwebui.com/reference/env-configuration/>、<https://docs.openwebui.com/troubleshooting/connection-error/> | 第 7、8、11 章 | G5 已验证容器环境值、管理员保存值、精确同源 CORS、错误 Origin 不暴露和电脑/手机访问 |
| HTTPS Cookie | HTTPS 反向代理部署当前使用 `WEBUI_SESSION_COOKIE_SECURE=True` 与 `WEBUI_AUTH_COOKIE_SECURE=True`；SameSite 默认 `lax`，OAuth/SSO 需保留回调兼容 | 同上 | 第 7、11 章 | G5 已验证登录响应 Cookie 同时含 Secure、HttpOnly 与 SameSite，桌面和手机刷新正常 |
| 公网加固 | Open WebUI 当前 Hardening 把应用定位为私有可信网络服务，建议公网入口在应用登录外再使用 VPN、Zero Trust / Access、IP allowlist、限速或等价保护 | <https://docs.openwebui.com/getting-started/advanced-topics/hardening/> | 第 7 章 | G5 保持应用登录与第一版权限收紧，没有启用 Access 或付费产品；G8 已删除临时公开入口 |
| 容器 localhost | 后端管理连接从容器发起，容器内 localhost 不等于宿主机 | <https://docs.openwebui.com/troubleshooting/connection-error/> | 第 11 章 | Ollama 附录再校订 |
| Secret | `WEBUI_SECRET_KEY` 用于登录 token 等；改变会使现有会话失效。Quick Start 要求容器重建时持续提供 Secret；Hardening 又称单实例可自动保存，两处持久化表述存在差异 | <https://docs.openwebui.com/getting-started/quick-start/>、<https://docs.openwebui.com/getting-started/advanced-topics/hardening/>、<https://github.com/open-webui/open-webui/blob/v0.11.3/backend/start.sh> | 第 3—5、11 章 | 使用显式 Secret 完成容器重建、会话与备份实机验证 |
| ConfigVar | `ENABLE_SIGNUP` 默认 `True`，`DEFAULT_USER_ROLE` 默认 `pending`；ConfigVar 首次读取环境值，之后管理界面保存值可优先于环境 | <https://docs.openwebui.com/reference/env-configuration/> | 第 5 章 | v0.11.3 管理界面与重启持久化实机验证 |
| 密码校验 | 密码复杂度默认不强制；bcrypt 输入限制为 72 字节；可选启用 `ENABLE_PASSWORD_VALIDATION` | <https://docs.openwebui.com/getting-started/advanced-topics/hardening/> | 第 5 章 | 管理员初始化实机验证 |
| 更新回退 | 数据库迁移可能单向，降级镜像不能代替恢复更新前备份；v0.11.3 还修复了 0.11.0—0.11.2 migration 失败后仍可能半更新启动的问题 | <https://docs.openwebui.com/getting-started/updating/>、<https://github.com/open-webui/open-webui/releases/tag/v0.11.3> | 策划、第 10—11 章 | 第 10 章实机恢复 |
| 用户默认权限 | 当前 `USER_PERMISSIONS_CHAT_FILE_UPLOAD` 默认开启；RBAC 权限由 Default Permissions、群组与资源授权叠加，限制性群组不会抵消另一群组的授予 | <https://docs.openwebui.com/reference/env-configuration/>、<https://docs.openwebui.com/features/authentication-access/rbac/>、<https://docs.openwebui.com/features/authentication-access/rbac/permissions/> | 第 9 章 | v0.11.3 普通 user、全部群组与直接授权实机验证 |
| 聊天分享 | 指定用户/群组分享、Public sharing（实例中所有已登录用户）与 Open sharing（任何持链接者，无需登录）是不同范围；第一版全部关闭 | <https://docs.openwebui.com/features/authentication-access/rbac/permissions/> | 第 9 章 | 普通 user、未指定 user 与退出登录浏览器分别验证 |
| 用户信息转发 | `ENABLE_FORWARD_USER_INFO_HEADERS` 当前默认 `False`；开启会把姓名、ID、邮箱、角色等 header 转发给多个上游 | 同上 | 第 9 章 | 网络请求与上游接收字段实机验证 |
| 管理员聊天访问 | `ENABLE_ADMIN_CHAT_ACCESS` 默认开启；`ENABLE_ADMIN_EXPORT` 仍可能导出包含聊天的数据。关闭两项 UI 能力也不构成阻止主机、数据库或备份管理员访问的安全边界 | 同上 | 第 9 章 | 管理员聊天、导出 UI 与底层权限分层验证 |
| 备份内容 | 官方更新指南说明 volume 保存聊天、用户、设置与上传内容，并要求在更新前备份；显式持久 Secret 可避免重建后会话与加密数据失效 | <https://docs.openwebui.com/getting-started/updating/>、<https://docs.openwebui.com/reference/env-configuration/> | 第 10 章 | 停写备份、hash、同版本测试 volume 与独立存储实机验证 |
| Open WebUI API key | 当前一名用户只有一把应用 API key；新建会立即替换旧 key，key 继承用户权限且不会自动到期。它与模型提供方 key 不是同一凭证 | <https://docs.openwebui.com/features/authentication-access/api-keys/> | 第 12 章、资料来源 | 固定 RC 版本的创建、撤销、权限与审计 UI 实机验证 |
| 凭证轮换 | `WEBUI_SECRET_KEY` 参与 JWT 签名和部分加密数据，不应与管理员密码、模型 key、Tunnel token 同时例行轮换 | <https://docs.openwebui.com/getting-started/advanced-topics/hardening/>、<https://docs.openwebui.com/reference/env-configuration/> | 第 12 章 | 独立维护窗口验证会话失效、连接配置与回退 |
| 临时下线 | `docker compose stop` 保留容器和 volume；公开 route、模型连接、应用与共用 connector 是四个不同影响层 | <https://docs.docker.com/reference/cli/docker/compose/stop/>、<https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/> | 第 12 章、附录 | 受控实机验证用户现象、恢复与共用 Tunnel 影响 |
| Compose 服务发现 | 同一 Compose 网络的服务按服务名发现；Linux 容器访问宿主机可显式使用 `host.docker.internal:host-gateway` | <https://docs.docker.com/compose/how-tos/networking/> | Ollama 附录 | 独立 Ollama 规格与 Linux 实机网络验证 |
| Ollama 连接 | Open WebUI 当前对宿主机 Ollama 建议 `http://host.docker.internal:11434`；Ollama 当前默认绑定 `127.0.0.1:11434` | <https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-ollama/>、<https://docs.ollama.com/faq> | Ollama 附录 | 版本、监听、模型 volume、硬件、费用与公网不可达实机验证 |
| Ollama 持久数据 | Ollama 官方 Docker 路径将模型保存到 `/root/.ollama` volume；Open WebUI 标准数据仍在 `/app/backend/data`，二者不能当成一个 volume | <https://docs.ollama.com/docker>、<https://docs.openwebui.com/getting-started/quick-start/> | Ollama 附录 | 固定镜像、模型下载大小、双 volume 备份与恢复验证 |
| 当前许可 | v0.6.6 起采用 Open WebUI License，包含品牌限制且不是 OSI 批准许可证 | <https://docs.openwebui.com/license/>、<https://github.com/open-webui/open-webui/blob/main/LICENSE> | 开始篇 | 每个 RC 重查 |

## 未覆盖与已知边界

- Cloudflare Access、IP allowlist、限速或其他前置访问控制的选型、免费额度与账户恢复边界；
- 429、上游超时与部分提供方 5xx 的实际 UI / 日志边界；当前没有安全 sandbox，不靠高频请求或破坏网络制造；
- 跨版本数据库迁移和降级边界；校订时 `v0.11.3` 仍是最新稳定版，同版本备份与隔离恢复已通过；
- admin / user / pending、叠加权限、文件上传、三类分享、Direct Connections、用户信息 header、管理员聊天访问与导出的当前 UI 行为；
- Access 等未启用 Cloudflare 产品的免费额度与账户恢复边界；根 zone 与域名续费责任继续存在；
- Open WebUI API key、管理员密码与 Secret 的实际轮换边界；模型专用 key 撤销已验证；
- Ollama 的安装、固定版本、11434 监听、host gateway、模型 volume、硬件、性能、费用与恢复行为。

这些项目必须保留为未知或未覆盖，不能因为本轮 G1—G8 已通过就外推到不同版本、账户或架构。
