# 第四册最终批写作记录

完成日期：2026-08-12

当前结论：第 12 章、附录和资料来源以及第四册 15 个完整 draft 内容单元已获 Owner 确认。全部文件仍为 `draft: true`，没有启用 production、Pagefind、完成状态或正式打印；后续实机边界转入 `field-validation-runbook.md`，当前尚未执行真实域名、Cloudflare 或 VPS 变更。

## 本批范围

| Order | slug | 重点交付 |
| ---: | --- | --- |
| 12 | `12-maintenance-handoff` | 最终基线、域名续费、巡检、cloudflared 更新影响、单 route 临时下线、永久退役、无秘密交接和第五册边界 |
| 13 | `appendix` | macOS / Windows DNS 命令、公共解析器、错误地图、请求路径、Caddy 最小传统反代对照、术语表 |
| 14 | `sources` | 按事实类别组织的官方来源、当前校订结论、重查触发条件和 RC 实机校订清单 |

## 组件与维护方式

- 新增 `Book04HandoffMock`，只表达交接字段、对象关系和敏感信息边界；
- 继续复用 `LearningGoals`、`ComparisonTable`、`FlowDiagram`、`InfoGrid`、`InstructionStep`、`Callout`、`CodeBlock`、`PlatformTabs`、`Glossary`、`MockWindow` 与 `ChapterChecklist`；
- 没有建立大型配置 JSON；全部命令与模板仍在 MDX 中声明一次并传给 `CodeBlock`；
- Caddy 命令只在附录对照路径出现，并以停止条件明确禁止与当前 Tunnel 主机名并行；
- 交接模板允许记录真实资产的受控名称和负责人，但禁止粘贴密码、私钥、token、恢复码和第二册凭证。

## 官方事实边界

- Cloudflare Registrar 当前默认自动续费，但续费仍可能失败，不能只依赖自动开关；其他注册商政策单独核对；
- 使用官方包管理器安装的 `cloudflared` 应继续由同一包管理器更新，更新后重启服务会影响当前流量；
- 临时下线只针对单一 published application route，执行前必须保存 hostname、service URL、Tunnel 和关联 DNS；
- Tunnel 有活动连接时不应强制删除；永久退役从单 route 开始，并保留回退窗口；
- Caddy 公共自动 HTTPS 需要 DNS 正确、80/443 可达、Caddy 可绑定端口和持久可写存储；
- Cloudflare 传统源站路径优先使用 `Full (strict)`；Origin CA 证书通常不被浏览器直连信任，不能把 Flexible 当作证书修复；
- 当前事实校订日期为 2026-08-12，控制台、套餐、价格、支付和地区结果仍需 RC 阶段实机复核。

## 全书连续性结论

- 顺序保持为 introduction、第 1—12 章、附录、资料来源；
- 第 6 章设计卡进入第 7—8 章 Tunnel 与 route，第 9 章验证结果进入第 10 章安全边界和第 11 章排错基线；
- 第 12 章接收第 9—11 章的正常状态、安全卡和排错方法，没有另建第二套发布主线；
- 完成率只计算第 1—12 章，introduction、appendix 和 sources 排除；
- 下一册只接收可控域名、Active zone、健康 Tunnel、公开教学 route 与本机 Compose 源站，不把当前无鉴权页面直接替换为敏感 AI 应用。

## 验证记录

### 自动检查

- `npm run check`：通过；
- Astro typecheck：82 个文件，0 errors、0 warnings、0 hints；
- ESLint：通过；
- Vitest：12 个测试文件、145 项测试通过；
- 第四册专用内容检查：8 项通过，覆盖 15 个文件、顺序、类型、完成标识、安全边界、维护交接、Caddy 与来源；
- production build：54 个 HTML 页面，没有生成第四册公开页面；
- Pagefind：仍只索引前三册 45 个正文页，没有收录第四册 draft 或草稿打印页；
- 系列、第一册、第二册、第三册和第四册内容检查全部通过；
- 内部链接：54 个 HTML、1549 个内部链接通过；
- `npm audit --audit-level=moderate`：0 vulnerabilities；
- `git diff --check`：通过；
- 敏感信息扫描未发现真实 VPS IP、Tunnel UUID、私钥或形似真实 token；
- 第一至第三册 MDX 与第二册 HTML 原型没有发生修改。

### 浏览器与响应式

- 第 12 章在 375、768、1440px 均只有一个 `h1` 和一个 `main`，页面级横向溢出为 0；
- 375px 附录标题、表格滚动容器、DNS 命令和 Caddy 内容没有造成页面级横向溢出；
- 768px 深色模式资料来源页前景、背景、标签和链接可读，页面级横向溢出为 0；
- 1440px 草稿打印路由包含 15 个内容单元，开始之前、第 1 章、第 12 章、附录与资料来源均存在；
- 附录两个平台标签组均可切到 Windows，macOS 与 Windows 正文没有互相丢失；
- 附录当前可见的 6 个复制按钮逐一测试，全部短暂显示“已复制”，状态和可访问名称同步更新；
- 第 12 章到附录、附录到资料来源的上一篇/下一篇草稿导航正确，目录当前项具有 `aria-current="page"`。

### 无 JavaScript 与草稿打印

- 直接读取服务器返回的附录 HTML：8 个复制按钮默认隐藏，4 个 macOS / Windows panel 全部存在且没有 `hidden`，2 个标签栏默认隐藏；
- JavaScript 关闭时命令、macOS 与 Windows 双平台内容、Caddy 对照和正文仍能直接阅读；
- 草稿打印路由的服务端 HTML 包含 15 个内容单元、两套平台内容、附录与资料来源，不依赖 JavaScript 组合；
- 正常屏幕预览中的打印按钮与复制按钮会保留；现有共享 `@media print` 规则负责在真实打印媒体隐藏这些网页控件，第四册新增交接仿真具有独立白底与防拆分打印样式；
- 本阶段未生成正式 PDF；真实 A4 分页、页数与 PDF 体积留到第四册 RC 验收。

通过这些检查只表示草稿结构和工程边界成立，不替代真实域名端到端校订。

## Owner 审阅重点

- 第 12 章能否让零基础读者区分巡检、更新、临时下线、迁移和永久退役；
- 单 route 临时下线是否足够保守，并明确关联 DNS 的当前界面确认；
- 交接卡是否同时做到可恢复与不含敏感凭证；
- Caddy 对照是否解释了反向代理，又不会诱导读者在同一主机名上叠加两套路径；
- `Full (strict)`、Origin CA 与 Flexible 的责任边界是否清楚；
- RC 实机清单是否适合后续使用隔离域名和教学服务执行。
