# 《让服务拥有域名：从 DNS 到 Cloudflare HTTPS》Release Candidate 说明

版本：`book04-v1.0.0-rc.1`

校订日期：2026-08-23

状态：本地发布候选综合验收通过；等待 Git 标签、GitHub Pages 部署与线上冒烟确认

## 本次候选版本包含

- “开始之前”、第 1—12 章、附录和资料来源，共 15 个内容单元；
- 系列级封面、完整目录、12 章完成状态、章节导航和整册打印页；
- 域名持有、权威 DNS、nameserver 迁移、DNSSEC、Cloudflare Tunnel、Universal SSL、
  HTTPS、安全边界、分层排错、维护交接和 Caddy 对照路径；
- HTML/CSS 教学仿真界面，不使用真实软件截图；
- Pagefind 中文静态搜索、三态主题、阅读进度、复制反馈和本地完成状态；
- 不依赖 JavaScript 的正文、目录和打印内容；
- G1—G8 实机校订、受控故障、永久清理和费用闭环的脱敏台账。

稳定 URL：

```text
/books/04-cloudflare/
/books/04-cloudflare/start/
/books/04-cloudflare/01-request-path/
...
/books/04-cloudflare/12-maintenance-handoff/
/books/04-cloudflare/appendix/
/books/04-cloudflare/sources/
/books/04-cloudflare/print/
```

## 内容与实机校订

- 15 个内容单元均使用显式 `order`、稳定 `slug` 和 `draft: false`；
- 完成率只计算第 1—12 章，“开始之前”、附录和资料来源不计入；
- G1—G8 与阶段 1—9 已在隔离域名、Cloudflare Free zone 和临时 Ubuntu 24.04 amd64
  VPS 上连续通过；
- 验证覆盖 nameserver、DNSSEC、具名 Tunnel、官方 cloudflared、systemd、出站 7844、
  published application route、自动 DNS、Universal SSL、桌面、第二网络和手机 5G；
- 受控验证覆盖源站停止、错误端口、connector 停止、route 下线重建、VPS 重启、
  502、1016、1033 与 signed NODATA 的实际边界；
- Caddy 对照覆盖官方稳定包、临时 80/443、公共证书、Proxied 和 `Full (strict)`；
- G8 已永久删除教学 route、DNS、connector、Tunnel、临时 VPS 和本机实验凭证，
  并确认没有持续计费的实例或附加资源；
- 根 zone、权威 nameserver 与 DNSSEC 保留，域名续费责任仍由 Owner 管理；
- 真实域名、IP、NS、DS、ID、token、SSH 密钥、账户和验证信息均未进入仓库。

详细脱敏证据见 `field-validation-results.md`。

## Production、搜索与 URL

- Production build 生成 71 个 HTML：4 个封面、60 个内容页和 4 个打印页等系列页面；
- Pagefind 1.5.2 索引 60 个正文页，第四册占 15 页；封面和打印页不入索引；
- 20 个第四册中文/技术词样本中，19 个在前五条结果内命中预期章节；
- `Quick Scan` 的首批结果不能稳定命中第 3 章，是已记录的 Pagefind zh-CN 静态分词边界；
  “快速扫描”或“添加到 Cloudflare”可以到达同一内容；
- 所有样本均未出现 `/print/`，结果使用正式章节 URL；
- 根路径和 `/ai-infrastructure-books/` 子路径构建均通过；
- 根路径构建已检查 2,075 个内部链接；打印页保持 `noindex,follow`。

搜索详情见 `search-samples.md`。

## 跨浏览器、响应式与无障碍

- 全套 Playwright 共 126 项：62 项执行通过，64 项按显式浏览器职责预期跳过；
- Chromium、Firefox、WebKit 均实际打开第四册封面、正文、整册打印页和无 JavaScript 路径；
- Chromium 检查 375 × 667、390 × 844、768 × 1024、1280 × 800、1440 × 900；
- 五种视口均无页面级横向溢出，手机目录、代码、表格、流程图和仿真界面可读；
- 系统深色模式、`prefers-reduced-motion` 和打印浅色样式通过；
- axe 代表页未发现 WCAG A/AA 自动化违规；
- Lighthouse 发现的深色模式主色按钮对比度问题已修正，复测 Accessibility 为 100；
- 前三册关键路径、搜索、打印、无 JavaScript 和共享交互保持通过。

## 打印与 PDF

- Chromium 按 A4 纵向生成 `book04-v1.0.0-rc.1.pdf`；
- 最终 125 页、4,726,705 字节、PDF 1.4、无加密、无内嵌 JavaScript 或 OpenAction；
- 封面、目录、“开始之前”、第 1—12 章、附录和资料来源完整；
- 125 页均完成低分辨率总览，章节起始、仿真界面、长代码、稀疏页和末页另做高分辨率抽查；
- 未发现空白页、文字越界、横向溢出、深色背景误入或网页工具栏误入；
- 清单末尾打印孤行已通过通用打印样式修正，最后两项与勾选行尽量保持同页；
- 代码块、表格、提示框、流程图与教学仿真界面保持浅色可读。

PDF 是本地忽略产物，位于 `output/pdf/`，不随源代码自动提交。

## 性能与资源

测试页面：`/books/04-cloudflare/08-publish-application/`<br>
浏览器与环境：本机 headless Chromium，production preview

- Lighthouse：Performance 100、Accessibility 100、Best Practices 100、SEO 100；
- FCP 1.1 s、LCP 1.1 s、TBT 0 ms、CLS 0.003、Speed Index 1.1 s；
- 首次页面传输约 26 KiB；
- 无外部字体、图片、分析脚本或第三方运行时请求。

Lighthouse JSON 是本地忽略产物，位于 `output/lighthouse/`。

## 安全、隐私与费用

- `npm audit`、最终敏感值扫描和 `git diff --check` 纳入发布前总检查；
- 发布准备检查只允许文档中的示例地址和公共 DNS 解析器地址；
- 仓库不包含真实实验域名、公网 IP、Cloudflare NS / DS、账户 / zone / Tunnel / 实例 ID、
  token、SSH 密钥、验证码、Cookie 或账户信息；
- localStorage 只用于主题与学习完成状态，不收集搜索词，不含分析脚本；
- 外部新窗口链接统一使用 `noopener noreferrer`；
- 临时 Vultr VPS 已销毁，Compute 与计费附加资源均为空，不再持续产生该实例的小时费用；
- Cloudflare 继续使用 Free zone，没有开通付费产品。

## 当前已知边界

- Pagefind 1.5.2 的 `Quick Scan` 查询存在已记录的非阻塞分词边界；
- Cloudflare 控制台名称、状态延迟、错误码和自动 DNS 联动仍可能变化，正文以技术关系和实际核对为准；
- DNSSEC 技术验收以公共 DS、DNSKEY 和验证成功标志为准，不把单次控制台延迟写成固定时长；
- 注册商价格、支付、实名、退款、续费和 Cloudflare 产品入口属于时效性信息；
- Lighthouse 是单机实验室结果，不代表所有地区和网络；
- PDF 分页可能随浏览器和系统字体变化，但正文不得丢失或重叠；
- 目标读者试读尚未开始，零基础理解障碍仍需真实反馈验证。

这些边界不阻塞 `rc.1`，但不得把发布候选表述为正式版。

## 发布建议

项目 Owner 已授权完成第四册发布。当前本地综合验收通过；实际提交、标签、GitHub Pages
部署和线上冒烟结果以 Git 记录、工作流和公开站点为准。

完成第四册发布报告后，按仓库里程碑规则等待 Owner 确认，再进入第五册策划与样章试写。
