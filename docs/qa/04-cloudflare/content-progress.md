# 第四册内容进度台账

建立日期：2026-08-11

当前状态：15 个内容单元已进入 `1.0.0-rc.1`；RC 前事实二校、G1—G8、综合检查、正式打印、PDF、Git 标签、GitHub CI、Pages 部署和线上冒烟均已完成

## 内容单元

| Order | 类型 | slug | 标题 | 当前状态 | 正文修改说明 |
| ---: | --- | --- | --- | --- | --- |
| 0 | introduction | `start` | 开始之前：先确认域名与本机服务都在你控制中 | RC | 根据已确认规格首次写作，无旧正文可迁移 |
| 1 | chapter | `01-request-path` | 一个网址怎样找到你的服务？ | RC | 根据已确认规格首次写作；没有旧正文可改写 |
| 2 | chapter | `02-own-domain` | 选择并持有一个可长期使用的域名 | RC | 根据已确认规格首次写作；不固定注册商、价格或地区结果 |
| 3 | chapter | `03-add-to-cloudflare` | 把域名添加到 Cloudflare | RC | 根据已确认规格首次写作；控制台名称按 2026-08-12 官方资料校订 |
| 4 | chapter | `04-change-nameservers` | 更换权威名称服务器，等待站点激活 | RC | 根据已确认规格首次写作；DNSSEC 使用安全迁移完整顺序 |
| 5 | chapter | `05-read-dns-records` | 看懂 DNS 记录、TTL 与橙色云 | RC | 根据已确认规格首次写作；代理与 TTL 按 2026-08-12 官方资料校订 |
| 6 | chapter | `06-plan-public-hostname` | 规划公开主机名与暴露边界 | RC | 根据已确认规格首次写作；固定唯一 Web 入口与禁止暴露清单 |
| 7 | chapter | `07-create-tunnel` | 创建生产 Cloudflare Tunnel | RC；2026-08-23 实机校订 | 保留 APT、token 与出站边界；按现场控制台把 Ubuntu 选择项校订为 `Debian` / `64-bit`，补充中文“健康”状态 |
| 8 | chapter | `08-publish-application` | 把域名连接到本机 Compose 服务 | RC；2026-08-22 二校增补 | 保留主线路由；新增 DNS、route、connector 三对象边界与 1016 失败判断 |
| 9 | chapter | `09-verify-https` | 验证 HTTPS 与完整请求路径 | RC | 根据已确认规格首次写作；Universal SSL 与签发等待按 2026-08-12 官方资料校订 |
| 10 | chapter | `10-security-boundary` | 收紧入口：账户、域名、Tunnel 与源站 | RC | 根据已确认规格首次写作；Access、缓存、token 泄露与第二册共存边界 |
| 11 | chapter | `11-troubleshooting` | 页面打不开：按层排查 DNS、Tunnel 与容器 | RC；2026-08-22 二校增补 | 保留分层排错；新增 1016 的 Tunnel 场景、其他根因边界和正确恢复状态 |
| 12 | chapter | `12-maintenance-handoff` | 续费、变更、回退与下一册交接 | RC；2026-08-22 二校增补 | 保留维护主线；明确停止 Tunnel 不会自动删除 DNS，route 删除以当前确认框和实际记录为准 |
| 13 | appendix | `appendix` | 附录：DNS 命令、错误地图与 Caddy 对照路径 | RC；2026-08-23 实机校订 | Caddy 独立主机名、云与主机防火墙、公共证书、Proxied、`Full (strict)` 与完整收口均通过；现有正文边界正确，无需修改 |
| 14 | sources | `sources` | 资料来源与校订记录 | RC；2026-08-23 综合校订 | 新增 Routing 与 Error 1016 官方来源，并记录 Tunnel 与 DNS 的独立生命周期 |

## 当前 frontmatter 基线

- `book` 固定为 `04-cloudflare`；
- `order` 使用完整目录中的稳定顺序，不因为文件尚未创建而重新编号；
- `slug` 与策划规格一致；
- “开始之前”为 `introduction`，第 1—11 章为 `chapter`；
- `updatedAt` 为实际校订日期；
- 当前十五个内容单元均使用 `draft: false`；
- 只有正式 chapter 设置 `chapterNumber` 和 `completionId`；
- 命令内容在 MDX 中声明一次，再传给 `CodeBlock`。

## 第一批写作状态

- [x] 三篇样章内容获得项目 Owner 确认；
- [x] 开发环境可浏览第四册封面、目录、三篇样章和样章打印页；
- [x] production build 不出现任何第四册公开页面；
- [x] Pagefind 仍只索引前三册 45 个正文页，没有收录第四册草稿；
- [x] 第 8 章仿真在 375px 下没有页面级横向溢出；
- [x] 第 11 章在 JavaScript 关闭时 6 个故障项全部保持展开可读；
- [x] 打印样式保留警告、命令、流程图和故障项语义，并隐藏复制按钮与网页工具栏；
- [x] 自动检查未发现真实域名、IP、UUID、Tunnel token、API token 或账户信息；
- [x] 官方事实台账具有对应章节、结论、来源和复核日期。

## 第一批确认结果

- [x] Owner 审阅并允许按第 1—5 章既定口径继续第二批写作；
- [x] 第 1—5 章通过 production 草稿排除和 Pagefind 不收录检查；
- [x] 第 4 章 macOS / Windows 双平台命令在 JavaScript 关闭和打印时全部可读；
- [x] DNS 记录仿真在 375px 下无页面级横向溢出，A4 打印能完整缩放；
- [x] 第 1—5 章自动内容检查、内部链接与敏感信息检查通过；
- [x] 验证结果已回填，Owner 已允许进入第 6—7、9—10 章。

## 第二批确认结果

- [x] Owner 审阅并确认第 6—10 章公开边界、安装命令、HTTPS 验证和安全责任划分；
- [x] 第 7 章命令通过语法、官方事实、敏感信息和单一来源检查；
- [x] 第 6—10 章通过 production 草稿排除和 Pagefind 不收录检查；
- [x] 新增 Tunnel、浏览器仿真在 375px、深色和打印媒体中可读；
- [x] 第 8、11 章连续性调整未改变已确认的路由和排错主线；
- [x] 全套自动检查、内部链接、npm audit 与 git diff 检查通过；
- [x] 本批确认后进入第 12 章、附录和资料来源。

## 进入全书审阅前的通过条件

- [x] 第 12 章覆盖域名续费、巡检、更新影响、临时下线、永久退役和下一册交接；
- [x] 附录覆盖 macOS / Windows DNS 命令、错误地图、术语表与隔离的 Caddy 对照；
- [x] 资料来源按域名、DNS、Tunnel、HTTPS、安全、维护和 Caddy 分类；
- [x] 第 1—12 章完成率规则与稳定 `completionId` 连续；
- [x] 15 个内容单元的 `order`、`slug`、`chapterType`、`updatedAt` 与 `draft` 通过自动检查；
- [x] 完成最终批全套自动、浏览器、无 JavaScript 与草稿打印检查；
- [x] Owner 确认完整 draft 并允许进入 RC 实机校订准备；
- [x] 建立隔离域名、临时 VPS、Tunnel、Caddy、故障注入和费用闭环的执行方案；
- [x] G1 已确认第三方注册商中的既有空闲 `.cn` 域名；Owner 确认无业务并可管理 NS / DNSSEC，仓库不记录真实域名；
- [x] G2 已确认并创建单台临时 VPS；阶段 1 的 SSH、Docker、Compose 回环服务、公网 8080 不可达和备份恢复比对均通过；
- [x] G3 已确认并执行；Quick Scan、nameserver 迁移、zone Active、新 DS 与两个公共解析器的 DNSSEC 验证均通过，未创建 Web 公共主机名；
- [x] G4 已确认并执行；唯一教学 Tunnel、官方 APT、隐藏 token、systemd、单个 Healthy connector、TCP/UDP 7844 与无 route / 无新增公网入站均通过；
- [x] G5 已确认并创建唯一 `app` route；自动 Proxied CNAME、Universal SSL、macOS Chrome / curl、第二网络、手机 5G HTTPS 与源站一致性通过；
- [x] G6 已确认并执行；源站、错误端口、connector、单 route 下线与 VPS 重启均已验证并恢复，脱敏交接卡和更新预览通过；
- [x] G7 已确认并执行；独立 Caddy 主机名、官方稳定包、公共证书、HTTP 308、Proxied、`Full (strict)` 和 DNS / 80 / 443 完整收口均通过，`app` 主线不受影响；
- [x] G8 已确认并执行；`app` route、教学 DNS、connector、Tunnel、临时 VPS 与本机实验凭证已永久清理，计费附加资源均为空，根 zone 与 DNSSEC 保留；
- [x] Owner 已确认并启用 production、搜索、完成状态、正式打印与 RC 综合验收。

## 2026-08-23 RC 综合验收

- [x] 书籍注册状态更新为 `release-candidate`，版本为 `1.0.0-rc.1`；
- [x] production build 生成 71 个 HTML，Pagefind 索引 60 个正文页，第四册占 15 页；
- [x] 20 个第四册搜索样本中 19 个命中预期章节，`Quick Scan` 分词边界已记录；
- [x] 2,075 个内部链接通过；
- [x] Playwright 共 126 项，62 项执行通过，64 项按浏览器职责预期跳过；
- [x] 375、390、768、1280、1440 五种宽度以及深色、无 JavaScript、打印和 axe 检查通过；
- [x] Lighthouse 四类得分均为 100，深色模式主色按钮对比度问题已修正；
- [x] A4 PDF 共 125 页，完成全量缩略图和代表页高分辨率复核；
- [x] `book04-v1.0.0-rc.1` 标签、GitHub CI、Pages 部署和线上冒烟通过。

## 2026-08-22 RC 前事实二校

- [x] 复核 Cloudflare 当前 Routing 文档：Dashboard 添加 published application route 会自动创建相关 DNS 记录；
- [x] 复核 DNS 记录与 Tunnel 可以分别存在，停止 Tunnel 不会自动删除 DNS；
- [x] 在第 8 章补齐 DNS、route、connector 三对象关系、成功含义与 1016 失败判断；
- [x] 在第 11 章新增 1016 排错项，明确不能把全部 1016 都归因于容器或 Tunnel；
- [x] 在第 12 章补齐临时下线后的 Routes 与 DNS Records 双重核验；
- [x] 资料来源增加 Routing 与 Error 1016 官方页面；
- [x] 除第 8、11、12 章和资料来源的上述事实补充外，本轮未修改其他第四册 MDX 正文；
- [x] G6 已记录 connector 停止未强制出现 1016 / 1033、route 删除确认框与关联 DNS 实际结果；当前正文继续不把错误码或控制台联动写成固定行为。
