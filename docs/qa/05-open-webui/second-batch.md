# 第五册第 7—10 章第二批 draft 记录

授权日期：2026-08-23

状态：四篇 draft 与第 6、11 章跨章连续性复核已建立并通过验证，等待 Owner 复核

## Owner 授权与批次边界

Owner 已确认第 1—5 章第一批 draft，并授权推进后续文章。本批只完成：

- 第 7 章：公开 URL、CORS、Secure Cookie、现有 Tunnel 与独立 `chat` route；
- 第 8 章：电脑、手机、流式回答、持久化与模型用量的端到端验证；
- 第 9 章：admin / user / pending、最小权限、附件、分享、删除与数据边界；
- 第 10 章：停止写入备份、hash 校验、测试 volume 隔离恢复、固定版本更新与迁移回退；
- 第 6 章：把模型测试明确为 SSH 转发下的连接探针，不冒充公开链路验收；
- 第 11 章：增加更新、volume、Secret、数据库迁移与第 8 章固定复测连续性。

本批不创建第 12 章、附录或资料来源，不进入 production、Pagefind、正式完成状态或正式打印。

## 外部操作边界

本批只写仓库 draft，没有执行以下操作：

- 没有拉取 Open WebUI 或 Alpine 镜像；
- 没有创建、重建或更新 Open WebUI 容器、named volume、管理员或用户；
- 没有创建 Cloudflare route、DNS 记录、Tunnel、connector 或公网入站规则；
- 没有粘贴 API key、Tunnel token、Cookie、Secret 或真实用户资料；
- 没有发送真实模型请求、充值、购买订阅、提高限额或产生模型费用；
- 没有创建快照、对象存储、额外 VPS 或其他付费备份资源；
- 没有执行 live 数据恢复、清理 volume、撤销 key 或永久删除。

## 官方事实二校

2026-08-23 已从 Open WebUI、Cloudflare 与 Docker 官方资料核对：

- `WEBUI_URL` 是持久化 ConfigVar，首次启动后应在管理界面核对实际保存值；
- `CORS_ALLOW_ORIGIN` 应精确包含公开 Origin，否则可能出现 WebSocket 与流式响应错误；
- HTTPS 公开部署使用 `WEBUI_SESSION_COOKIE_SECURE=True` 与 `WEBUI_AUTH_COOKIE_SECURE=True`；
- session / auth Cookie 的 SameSite 当前默认是 `lax`，OAuth/SSO 下不能未经验证改为破坏回调的值；
- Cloudflare published application 把公开 hostname 映射到本地 service，从 Tunnel 控制台保存时可自动建立 DNS 记录；
- 同一机器通常只安装一个 `cloudflared` system service，新应用应复用既有 Tunnel 增加 route；
- Tunnel route 的 502 表示 connector 无法到达源站；1033 表示没有健康 connector；
- Open WebUI 当前 Hardening 建议公网入口在应用登录之外增加 VPN、Zero Trust / Access、IP allowlist、限速或等价保护；
- 新用户默认角色为 `pending`，但主线仍保持 signup 关闭；
- 文件上传默认可用、公开/开放分享默认关闭，正文第一版进一步收紧普通 user 权限；
- `ENABLE_FORWARD_USER_INFO_HEADERS` 默认关闭；开启会把用户身份字段发送给多个上游；
- `ENABLE_ADMIN_CHAT_ACCESS` 的界面控制不能阻止具备主机、数据库或备份权限的管理员访问底层数据；
- `/app/backend/data` volume 保存账户、聊天、配置与上传内容；更新前应备份；
- 数据库迁移可能不可逆，旧镜像不能替代更新前数据库备份；
- 显式、持久的 `WEBUI_SECRET_KEY` 能避免容器重建造成会话失效和加密数据不可读；
- 官方更新主线是拉取目标镜像并重建容器，production 应固定版本、阅读 release notes 并人工验证，不把无人值守更新作为本书主线。

Cloudflare 控制台路径、Open WebUI 管理界面、Access 方案、模型提供方与目标更新版本都保留为 RC 重查项。

## 内容成功合同

第二批验收必须证明：

- 第五册共 12 篇内容单元均为 `draft: true`；
- 第五册继续为 `drafting / 0.0.0`，搜索和正式打印关闭；
- production build 与 Pagefind 不包含第五册；
- 第 7 章不会创建第二个 Tunnel、暴露 token 或开放公网 3000；
- route 创建前明确应用认证、signup、用户、模型费用与前置访问控制闸门；
- 第 8 章固定电脑与手机的低敏感测试问题，并核对后台额外调用；
- 第 9 章不把自托管、HTTPS、删除聊天或关闭管理员 UI 写成绝对隐私保证；
- 第 10 章只读挂载 production volume，恢复到精确的新测试 volume，不提供清空 live volume 的快捷命令；
- 第 6、11 章与第 7—10 章在连接探针、公开链路、费用、更新与恢复上连续；
- production、Pagefind、完成状态和正式打印继续排除第五册；
- 敏感模式扫描不出现真实域名、IP、用户、Secret、key、Cookie、token、UUID 或账户 ID。

## 验证结果

- `npm run check`：通过；Astro 0 errors / warnings / hints，ESLint 通过；
- Vitest：13 个测试文件、164 项测试通过，其中第五册专用测试 14 项；
- production build：71 个 HTML 页面，没有第五册页面；
- Pagefind：60 个正文页，均属于第一至第四册；
- 内容检查：系列规范与第一至第五册专用检查全部通过；
- 内部链接：71 个 HTML、2075 个内部链接通过；
- release readiness：第一至第四册既有发布基线通过，第五册仍不可阅读；
- `npm audit`：0 vulnerabilities；
- 第二批 19 组 Shell 模板通过 `bash -n` 语法检查；
- 375、768、1440 三种宽度：第 6—11 章 18 组检查均无页面级横向溢出；
- 1440 深色模式：六章正文、表格、代码块与仿真使用深色配色且无横向溢出；
- JavaScript 边界：六章服务器初始 HTML 共含 74 个正文区块和全部章节 checklist；
- 草稿打印页：包含 12 个 draft 单元并保持 `noindex,follow`，375/768/1440 均无页面级横向溢出；正式 A4 PDF 留到 RC；
- 浏览器控制台：无 error 或 warning；
- production 目录与 Pagefind 索引内容搜索：没有第五册路径或第二批标题；
- `git diff --check`：通过；
- 第五册内容、QA、规划、测试与专用组件敏感模式扫描：私钥、API key、JWT 和 UUID 均为 0。

验证完成后仍须停下等待 Owner 复核，不连续进入第 12 章、附录、资料来源或实机 runbook。
