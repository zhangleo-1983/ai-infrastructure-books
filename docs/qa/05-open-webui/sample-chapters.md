# 第五册三篇样章说明

建立日期：2026-08-23

Owner 确认日期：2026-08-23

## 选择结果

| 样章 | 选择原因 | 重点验证 |
| --- | --- | --- |
| 开始之前（`00-introduction`） | 验证零基础读者能否分清界面、模型、API、费用和数据边界 | 双请求路径、只读检查、费用闸门、停止条件 |
| 第 6 章（`06-connect-model-provider`） | 模型连接是全书最核心、也最容易随版本变化的 UI 操作 | Admin Connections、base URL、key、model ID、allowlist、401—429 |
| 第 11 章（`11-troubleshooting`） | 同时覆盖 Cloudflare 路径和模型路径的复杂排错 | 证据优先、CORS、WebSocket、容器 localhost、恢复验证 |

## 样章实现边界

- 三篇文件均为 `draft: true`；
- 第五册状态为 `drafting / 0.0.0`；
- 开始篇只执行只读资源、端口与 connector 检查；
- 第 6 章假定第 4—5 章已经完成，只做 SSH 转发下的连接探针，不提前公开 `chat` route；
- 第 11 章与第 7—10 章的公开链路、权限、更新和恢复连续性已在第二批复核；
- Open WebUI 管理页面全部使用 HTML/CSS 教学仿真，不使用真实软件截图；
- `.invalid`、`example.com` 与 `<MODEL_ID>` 只作占位，不对应真实资源；
- 不在样章阶段部署容器、创建 route、购买模型额度或发送真实模型请求；
- 不把 Open WebUI 描述为模型本身、免费模型服务或绝对隐私方案；
- 不把当前许可描述为 MIT 或 OSI 批准的开源许可证。

## 作者审阅重点

### 开始之前

- 两条请求路径是否一眼可分；
- “自托管界面不等于本地模型、不等于数据不外发”是否足够清楚；
- VPS、域名、Cloudflare 与模型费用是否拆开；
- 端口、资源和 connector 检查是否保持只读；
- 暂停条件是否具体，不使用“自行判断”。

### 第 6 章

- Admin Settings 与 User Settings 是否明确区分；
- base URL、API key、model ID 是否不会混淆；
- `/models` 自动发现失败的边界是否准确；
- allowlist 是否能避免暴露无关或昂贵模型；
- 真实 key 是否完全不进入命令、截图、日志或仓库；
- 费用异常时是否先禁用连接和撤销专用 key。

### 第 11 章

- 能否先判断路径 A 或路径 B；
- 401/403 是否能区分 Open WebUI 登录与上游模型鉴权；
- NXDOMAIN、1033、502、404、429、CORS 和 WebSocket 是否有明确首查层；
- 是否先保存证据，再允许重启或改配置；
- 是否避免开放公网 3000、删除 volume 或关闭登录；
- 手机、流式回答和提供方用量是否进入恢复验收。

## 自动与浏览器检查

2026-08-23 已完成：

- [x] Astro typecheck：0 errors、0 warnings、0 hints；
- [x] ESLint：通过；
- [x] Vitest：13 个测试文件、158 项测试通过，第五册专用测试 8 项；
- [x] production build：71 个 HTML，无第五册页面；
- [x] Pagefind：60 个正文页，无第五册内容；
- [x] 内容与内部链接：全部通过，2075 个内部链接；
- [x] release readiness：既有四册通过，第五册保持排除；
- [x] `npm audit`：0 vulnerabilities；
- [x] 375、768、1440：目录、三篇样章、样章打印页共 15 组均无页面级横向溢出；
- [x] 1440 深色模式：正文和仿真界面可读；
- [x] JavaScript 边界：服务端 HTML 含全部正文；样章阶段第 11 章七个排错详情默认展开，第二批已扩展为八类；
- [x] 样章打印：打印页含三篇样章、`noindex,follow` 与 print media 样式；正式 A4 PDF 留到 RC；
- [x] 浏览器控制台：无 error 或 warning；
- [x] `git diff --check` 与新增文件尾随空白检查：通过；
- [x] 12 个相关文件敏感模式扫描：私钥、API key、JWT、UUID 均为 0。

三篇样章已于 2026-08-23 获 Owner 确认；后续修改仍须保留样章已确认的双路径、秘密、费用、排错和生产排除边界。
