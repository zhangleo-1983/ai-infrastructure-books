# 第四册第 1—5 章第一批写作记录

完成日期：2026-08-12

当前结论：第 1—5 章 draft 已获 Owner 确认并允许继续第二批写作；确认不代表第四册完整正文或发布候选。

## 本批范围

| Order | slug | 重点交付 |
| ---: | --- | --- |
| 1 | `01-request-path` | 浏览器、递归解析器、权威 DNS、Cloudflare、Tunnel、connector 与本机服务的完整请求和响应路径 |
| 2 | `02-own-domain` | 通用注册商选择、首期与续费成本、联系邮箱、2FA、支付与现有业务清点 |
| 3 | `03-add-to-cloudflare` | 添加 apex zone、DNS quick scan 人工复核、代理状态和两台待切换 nameserver |
| 4 | `04-change-nameservers` | 旧 DS 移除与缓存验证、nameserver 切换、Active 验证、新 DS 发布和安全回退边界 |
| 5 | `05-read-dns-records` | A、AAAA、CNAME、MX、TXT、NS、Proxy status、TTL 与记录冲突 |

本记录只描述第一批当时范围；第 6、7、9、10 章已在后续第二批创建，第 12 章、附录和资料来源仍未创建。

## 组件与维护方式

- 复用 `LearningGoals`、`ComparisonTable`、`FlowDiagram`、`InfoGrid`、`InstructionStep`、`Callout`、`CodeBlock`、`ChapterChecklist` 和 `PlatformTabs`；
- 新增 `RegistrarDomainMock`，只表达注册结算的核对关系，不显示固定价格或真实注册商界面；
- 新增 `DnsRecordsMock`，只表达 DNS 表字段和代理状态，不把记录抽象为大型 JSON；
- 第 4、5 章命令在 MDX 中声明一次，再传给 `CodeBlock`；
- 所有新增内容保持 `draft: true`，production、Pagefind、完成状态和公开打印仍保持关闭。

## 官方事实边界

- Cloudflare quick scan 是启发式扫描，不能作为旧 DNS 的完整备份；
- 已启用 DNSSEC 时，必须先移除旧 DS 并等待公共解析器不再返回旧 DS，再切换 nameserver；
- zone Active 后才在 Cloudflare 生成并向注册商发布新 DS；
- A、AAAA、CNAME 可以使用代理状态，MX、TXT 保持 DNS only；
- Proxied TTL 的当前实现值属于时效性信息，不承诺固定传播时间；
- 注册商价格、支付、实名和地区规则保持通用判断，未伪造成所有中国用户都能复现的固定流程。

详细来源与复核日期记录在 `fact-check.md`。

## 2026-08-12 自动检查

- `npm run check`：通过；
- Astro typecheck：79 个文件，0 errors、0 warnings、0 hints；
- ESLint：通过；
- Vitest：12 个测试文件、142 项测试通过；
- 第四册专用 `book04-content.test.ts`：5 项通过；
- production build：54 个 HTML 页面，未生成第四册公开页面；
- Pagefind：仍索引前三册 45 个正文页，未收录第四册 draft；
- 内容检查：系列级、第一册、第二册、第三册与第四册全部通过；
- 内部链接：54 个 HTML、1549 个内部链接通过；
- `npm audit --audit-level=moderate`：0 vulnerabilities；
- `git diff --check`：通过。

## 浏览器与打印检查

- Chromium 开发预览中，第 1—5 章在 375、768、1440px 均返回 200；
- 三种宽度下页面级横向溢出均为 0，每页只有一个 `h1`，控制台没有 error；
- 第 4 章 Windows/macOS 标签可以切换，复制按钮显示“已复制”并通过 `aria-live` 提供反馈；
- JavaScript 关闭时，第 4 章两套平台内容同时显示，没有隐藏 panel；
- 深色模式下第 5 章标题、目录、正文和状态标签可读；
- 开发打印页包含当前八个 draft 内容单元，打印媒体中双平台内容全部显示，按钮与网页导航不显示；
- 第 4 章和开发打印页没有页面级横向溢出；第 5 章 DNS 表在窄屏中局部滚动、打印时取消最小宽度并允许单元格换行。

## Owner 审阅重点

- 第 1 章是否足以让零基础读者把 DNS 成功、HTTPS 成功和应用成功分开；
- 第 2 章通用注册商路径是否避免了不必要的厂商依赖，同时仍然可执行；
- 第 3 章是否足够强调 quick scan 不是备份；
- 第 4 章 DNSSEC 顺序是否清晰，是否需要在后续实机校订中增加具体注册商差异；
- 第 5 章记录类型、代理状态与 TTL 的术语密度是否合适；
- 本批通过后是否按计划进入第 6—7、9—10 章。
