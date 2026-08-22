# 第四册第 6—10 章第二批写作记录

完成日期：2026-08-12

当前结论：第 6—7、9—10 章与第 8、11 章跨章连续性已获 Owner 确认；本批仍是第四册草稿的一部分，不代表发布候选。

## 本批范围

| Order | slug | 重点交付 |
| ---: | --- | --- |
| 6 | `06-plan-public-hostname` | 固定 `app.example.com → http://127.0.0.1:8080`，列明 SSH、3X-UI、第二册入站、数据库与 Docker socket 禁止公开 |
| 7 | `07-create-tunnel` | 创建具名远程管理 Tunnel，安装官方 `cloudflared`，安全输入 token，验证 systemd 与 connector 状态 |
| 8 | `08-publish-application` | 保留已确认路由样章，补充第 6—7 章前置状态和第 9 章正式 HTTPS 验证入口 |
| 9 | `09-verify-https` | 验证 Universal SSL、外部 DNS、浏览器证书、公开响应、本机源站和 connector |
| 10 | `10-security-boundary` | 拆分账户、Tunnel token、源站端口、公开内容、Access、缓存、日志和第二册共存责任 |
| 11 | `11-troubleshooting` | 保留已确认分层排错，补充第 9/10 章基线、7844 出站和 Healthy 不等于源站健康 |

没有创建第 12 章、附录或资料来源，也没有启用第四册 production、Pagefind、完成状态或公开打印。

## 组件与维护方式

- 复用 `LearningGoals`、`ComparisonTable`、`FlowDiagram`、`InfoGrid`、`InstructionStep`、`Callout`、`CodeBlock`、`TerminalMock` 和 `ChapterChecklist`；
- 新增 `TunnelConnectorMock`，只表达具名 Tunnel、systemd connector、Healthy 与 route 未建立的状态关系；
- 新增 `BrowserHttpsMock`，只表达主机名、连接状态和页面内容验证，不模拟具体浏览器像素界面；
- 第 7 章官方安装、受控 token 输入、systemd 状态、日志与重启命令均在 MDX 中声明一次，再传给 `CodeBlock`；
- 第 8、11 章的状态命令改用 `systemctl show`，避免普通检查展开完整服务定义；
- 所有内容继续使用文档示例域名与本机回环地址，不保存 Tunnel UUID、token、账户 ID 或真实 IP。

## 官方事实边界

- 远程管理 Tunnel token 足以运行 connector，泄露后要旋转并强制断开旧连接；
- `cloudflared` 当前需要向 Cloudflare 出站连接 TCP/UDP 7844，不新增公网入站 7844；
- Healthy、Inactive、Down、Degraded 只描述 Tunnel 连接，Healthy 不证明 route 或本机源站健康；
- Ubuntu 24.04 amd64 使用 Cloudflare 官方 Noble 稳定 APT 仓库，不提供第三方脚本或二进制；
- Universal SSL 当前覆盖根域名与一级子域名，full setup 激活后常见签发窗口为 15 分钟至 24 小时；
- 当前默认不缓存 HTML 或 JSON，但 Cache Rules、响应头与 Cookie 会改变结果；
- Published application、HTTPS 与 Cloudflare Access 是不同能力，当前教学页没有应用登录或 Access。

详细来源与复核日期记录在 `fact-check.md`。

## 自动检查

- `npm run check`：通过；
- Astro typecheck：81 个文件，0 errors、0 warnings、0 hints；
- ESLint：通过；
- Vitest：12 个测试文件、143 项测试通过；
- 第四册专用 `book04-content.test.ts`：6 项通过；
- Bash 语法：官方 APT 安装命令与受控 token 输入命令通过 `bash -n`；
- 敏感信息扫描：没有真实 VPS IP、Tunnel UUID、私钥或形似真实 `eyJ...` Tunnel token；
- production build：54 个 HTML 页面，未生成第四册公开页面；
- Pagefind：仍只索引前三册 45 个正文页，未收录第四册 draft；
- 内容检查：系列级、第一册、第二册、第三册与第四册全部通过；
- 内部链接：54 个 HTML、1549 个内部链接通过；
- `npm audit --audit-level=moderate`：0 vulnerabilities；
- `git diff --check`：通过。

## 浏览器与打印检查

- Chromium 开发预览中，第 6—11 章在 375、768、1440px 均返回 200；
- 三种宽度下页面级横向溢出均为 0，每页只有一个 `h1` 和一个 `main`，控制台没有 error；
- 1440px 系统深色模式下第 9 章浏览器 HTTPS 仿真、目录、正文和状态标签可读；
- 375px 下第 7 章 Tunnel 状态表与 connector 仿真不造成页面级溢出，操作标签仍可见；
- 第 7 章 6 个复制按钮逐一测试，均短暂显示“已复制”并通过 `aria-live` 提供反馈；
- JavaScript 关闭时第 9 章正文、仿真、命令和完整 `ChapterChecklist` 保持可读，隐藏项仅为复制按钮和未完成状态增强标记；
- 开发打印页包含当前 12 个 draft 内容单元，第 6、7、9、10、11 章均存在；
- 打印媒体为白色背景，没有可见按钮，Tunnel 与浏览器仿真可读，没有页面级横向溢出。

## Owner 审阅重点

- 第 6 章是否足够明确“只公开一个无敏感内容的 Web 服务”；
- 第 7 章 token 输入是否兼顾零基础可执行性与 Shell 历史安全；
- APT 命令长度和失败判断是否适合第一次维护 Ubuntu 软件源的读者；
- 第 9 章是否清楚区分边缘证书、Tunnel 与同机 HTTP 源站；
- 第 10 章是否足够明确 HTTPS、Access、应用登录、缓存和备份的责任差异；
- 第 8、11 章连续性补充是否保持原有样章主线；
- 本批通过后是否进入第 12 章、附录和资料来源。
