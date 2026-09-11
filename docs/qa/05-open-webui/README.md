# 第五册 QA 目录

书籍：《搭建自己的 AI 对话入口：Open WebUI 从部署到维护》

书籍 ID：`05-open-webui`

当前阶段：第五册 15 个内容单元已进入 `release-candidate / 1.0.0-rc.1`；实机 G1—G8 已通过并完成永久清理；RC 综合验收与发布执行中

本目录维护第五册独立的内容进度、样章审阅和技术事实校订。第五册没有单文件 HTML 原型，
采用内容单元、frontmatter、官方文档、敏感值边界、production 构建和浏览器人工检查相结合的方式。

## 当前文件

- `content-progress.md`：15 个计划内容单元及当前写作状态；
- `sample-chapters.md`：三篇样章的选择、审阅重点与验证结果；
- `first-batch.md`：第 1—5 章第一批授权、事实、安全边界与验证结果；
- `second-batch.md`：第 7—10 章第二批、跨章连续性、外部操作边界与验证结果；
- `third-batch.md`：第 12 章、附录、资料来源、全书连续性与外部操作边界；
- `editorial-pass-1.md`：`v0.11.3` 基线、缺失交接对象分支与地址边界的首轮写作校订；
- `editorial-pass-2.md`：Direct Connections、Task Models、叠加权限、分享、排错与交接边界的第二轮校订；
- `fact-check.md`：Open WebUI 安装、认证、模型连接、HTTPS、更新和许可事实台账；
- `field-validation-runbook.md`：G1—G8 实机顺序、费用、停止条件、恢复和清理边界；
- `field-validation-results.md`：只填写脱敏现场证据的结果台账。
- `search-samples.md`：第五册中文搜索样本与已知限制；
- `release-candidate.md`：RC 综合验收与线上发布结果。

## 当前 RC 边界

- 书籍注册状态为 `release-candidate`，版本为 `1.0.0-rc.1`；
- 已有“开始之前”、第 1—12 章、附录和资料来源共 15 篇 MDX；
- 15 篇 frontmatter 均为 `draft: false`；
- `search.enabled` 与 `print.enabled` 均为 `true`；
- production、Pagefind、完成状态和正式打印均纳入第五册；
- production build、Pagefind、完成状态和正式打印已经纳入第五册；
- runbook 已执行闭环，G1—G8 均已授权并通过；
- 固定 `v0.11.3`、回环 3000、唯一管理员、`deepseek-flash` 单模型、公开 HTTPS、多网络、故障恢复与同版本备份恢复均有实机证据；
- G8 已删除第五册 route / DNS、模型连接 / key、应用数据、备份、connector / Tunnel、临时防火墙规则和 VPS；Cloudflare 根 zone 与 DNSSEC 保留；
- 模型最终 2 次请求、97 tokens、费用低于 0.01 元；VPS 已销毁，不再持续计费；
- 不记录真实域名、IP、账户、用户邮箱、API key、Cookie、Secret、Tunnel token 或账单身份信息。

## 当前阶段检查

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run check:content
npm run check:links
npm run check:release
npm audit
git diff --check
```

第三批开发服务器人工检查覆盖：

- 第 12 章、附录、资料来源与包含 15 篇 draft 的草稿打印页；
- 375、768、1440 三种宽度无页面级横向溢出；
- 1440 深色模式可读；
- JavaScript 关闭后正文、双路径图、管理员仿真和排错详情完整可读；
- 打印媒体背景为白色，仿真界面、表格和双路径图不横向溢出；
- 控制台没有页面错误；
- production 不生成 `/books/05-open-webui/`。

## 2026-08-23 样章验证结果

- Astro typecheck：0 errors、0 warnings、0 hints；
- ESLint：通过；
- Vitest：13 个测试文件、158 项测试通过，其中第五册专用测试 8 项；
- production build：71 个 HTML 页面，没有第五册页面；
- Pagefind：60 个正文页，均属于第一至第四册；
- 内容检查：系列规范与第一至第五册专用检查全部通过；
- 内部链接：71 个 HTML、2075 个内部链接通过；
- release readiness：第一至第四册既有发布基线通过，第五册仍不可阅读；
- `npm audit`：0 vulnerabilities；
- 375、768、1440 三种宽度：第五册目录、三篇样章和样章打印页共 15 组检查均无页面级横向溢出，仿真图无异常溢出；
- 1440 深色模式：正文、标题、学习目标和仿真界面对比度可读；
- 手机端：375 宽度的封面、标题和双路径图保持正常文档顺序；
- JavaScript 边界：服务器返回的 HTML 包含三篇完整正文；第 11 章七个排错详情默认带 `open`，无 JavaScript 时仍可读；
- 样章打印页：包含三篇样章、`noindex,follow` 与 print media 样式；375/768/1440 无横向溢出；正式 A4 PDF 留到 RC；
- 浏览器控制台：第五册代表页面无 error 或 warning；
- `git diff --check` 与新增文件尾随空白检查：通过；
- 12 个第五册相关文件敏感模式扫描：私钥、API key、JWT 和 UUID 均为 0。

三篇样章与第 1—5 章第一批随后均已获 Owner 确认；这里保留当批验证结果，不把它改写为 production 或实机通过。

## 2026-08-23 第 1—5 章第一批验证结果

- Astro typecheck：0 errors、0 warnings、0 hints；
- ESLint：通过；
- Vitest：13 个测试文件、160 项测试通过，其中第五册专用测试 10 项；
- 内嵌 Compose YAML：语法解析通过，project、回环端口与 named volume 与正文合同一致；
- production build：71 个 HTML 页面，没有第五册页面；
- Pagefind：60 个正文页，均属于第一至第四册；
- 内容检查：系列规范与第一至第五册专用检查全部通过；
- 内部链接：71 个 HTML、2075 个内部链接通过；
- release readiness：第一至第四册既有发布基线通过，第五册仍不可阅读；
- `npm audit`：0 vulnerabilities；
- 375、768、1440 三种宽度：第 1—5 章共 15 组检查均无页面级横向溢出；
- 1440 深色模式：第 5 章正文、学习目标和管理员初始化仿真可读且无横向溢出；
- JavaScript 边界：五章服务器 HTML 共包含 67 个正文区块，关键路径、命令、状态与停止条件均在初始 HTML；
- 草稿打印页：包含本批五章并保持 `noindex,follow`，375/768/1440 均无横向溢出；正式 A4 PDF 留到 RC；
- 浏览器控制台：无 error 或 warning；
- production 目录与 Pagefind 索引内容搜索：没有第五册路径或本批标题；
- `git diff --check`：通过；
- 第五册内容、组件、规划与 QA 敏感模式扫描：私钥、真实 Secret、API key、JWT 和 UUID 均为 0；IP 只出现 `127.0.0.1` 与 `0.0.0.0` 教学地址。

第一批已经完成仓库内验证且随后获 Owner 确认；它没有执行 VPS、容器、管理员、Cloudflare 或模型外部操作。

## 2026-08-23 第 7—10 章第二批验证结果

- Astro typecheck：0 errors、0 warnings、0 hints；ESLint 通过；
- Vitest：13 个测试文件、164 项测试通过，其中第五册专用测试 14 项；
- production build：71 个 HTML 页面，没有第五册页面；Pagefind 仍为前四册 60 个正文页；
- 内容、release readiness 与 71 页 / 2075 条内部链接检查通过；
- 第二批 19 组 Shell 模板通过语法检查；`npm audit` 为 0 vulnerabilities；
- 第 6—11 章在 375、768、1440 共 18 组检查中无页面级横向溢出；
- 六章 1440 深色模式可读；浏览器控制台无 error 或 warning；
- JavaScript 关闭边界：服务器初始 HTML 含六章共 74 个正文区块和全部 checklist；
- 草稿打印页包含 12 个 draft 单元、保持 `noindex,follow`，三种宽度无页面级横向溢出；
- production 与 Pagefind 没有第五册路径或第二批标题；
- `git diff --check` 与敏感模式扫描通过。

第二批没有执行 VPS、Open WebUI、Cloudflare route、模型调用、付费备份或任何永久删除。现在等待 Owner 复核，不进入第 12 章、附录、资料来源或实机 runbook。

Owner 随后已确认第二批并授权第三批；这里保留当批原始闸门记录。

## 2026-08-23 第 12 章、附录与资料来源第三批验证结果

- Astro typecheck：0 errors、0 warnings、0 hints；ESLint 通过；
- Vitest：13 个测试文件、167 项测试通过，其中第五册专用测试 17 项；
- production build：71 个 HTML 页面，没有第五册页面；Pagefind 仍为前四册 60 个正文页；
- 内容、release readiness 与 71 页 / 2075 条内部链接检查通过；`npm audit` 为 0 vulnerabilities；
- 第三批 10 组 Shell 模板语法通过，Ollama `host-gateway` Compose 片段通过 YAML 与字段合同检查；
- 第 12 章、附录、资料来源和草稿打印页在 375、768、1440 共 12 组检查中无页面级横向溢出；
- 三篇第三批内容的 1440 深色模式可读；375 手机端附录保持正常文档顺序；浏览器控制台无 error 或 warning；
- JavaScript 关闭边界：三篇服务器初始 HTML 共含 27 个正文区块；维护、Ollama 与未知项无需客户端脚本即可阅读；
- 草稿打印页包含全部 15 个 draft 标题和 155 个正文区块，保持 `noindex,follow`，三种宽度无页面级横向溢出；
- 打印 CSS 含 print media、白色背景、分页与避免断页声明；正式 A4 PDF 留到 RC；
- 34 个资料来源官方外链全部返回成功；`git diff --check` 通过；
- 26 个第五册正文、QA、规划与专用组件文件敏感模式扫描：私钥、API key、JWT、UUID 与非教学 IPv4 均为 0；
- production 与 Pagefind 没有第五册路径或第三批标题。

第三批没有执行 VPS、Open WebUI、Cloudflare route、模型调用、Ollama 安装或模型下载、付费资源、凭证轮换、永久删除、add、commit、push 或发布。Owner 随后已确认 15 个完整 draft 并授权建立独立实机 runbook；这里保留第三批原始闸门记录，不把它改写为实机或 production 通过。

## 2026-08-23 独立实机 runbook 边界

- 第四册 G8 已删除旧教学 VPS、connector、Tunnel、route 和 DNS；第五册不会把旧结果冒充本册实测；
- 默认 G1 经精确费用确认后建立单台临时 Ubuntu VPS、Docker 与第五册专用无 route connector；
- G2—G8 各自保留独立 Owner 授权，G4 的充值 / 订阅 / 模型预算和 G8 的永久删除另有明确确认；
- 429、上游超时或跨版本 migration 没有安全可控路径时记录“环境不覆盖”，不靠高额调用或旧版安装制造结果；
- 当前没有创建 VPS、Open WebUI、管理员、模型 key、Tunnel、route 或备份，没有调用模型，也没有新增第五册费用；
- 当前停在 G1 授权前；production、Pagefind、完成状态、正式打印、RC 与发布继续排除第五册。

本次 runbook 建立验证结果：

- 官方事实复核：Open WebUI latest stable 仍为 `v0.11.0`；ConfigVar 持久化、固定镜像、Docker
  volume、Cloudflare published application、Tunnel 出站 TCP / UDP 7844 与当前故障边界均已对照官方资料；
- Astro typecheck：0 errors、0 warnings、0 hints；ESLint 通过；
- Vitest：13 个测试文件、169 项测试通过，其中第五册专用测试 19 项；
- production build：71 个 HTML 页面，Pagefind 60 个正文页；第五册 production 文件与搜索引用均为 0；
- 内容检查、71 页 / 2075 条内部链接与 release readiness 通过；
- `npm audit`：0 vulnerabilities；`git diff --check` 通过；
- 第五册规划、QA、正文、组件与专用测试的私钥、API key、JWT、UUID 模式扫描均为 0；
- `PROJECT_STATUS.yaml` 已按 Owner 确认与 runbook 里程碑最小更新，并通过 v1 校验。

## 2026-09-10 首轮整册写作校订验证结果

- 新部署固定版本从 `v0.11.0` 更新至当日官方 latest stable `v0.11.3`；Compose、恢复示例、
  健康检查来源、资料链接和实机 runbook 同步更新；
- “开始之前”补齐旧 VPS / Tunnel 已被清理或归属不明的返回路径；第 7 章不再假设第四册实验资源必然存在；
- 第 1 章补齐公开 URL、VPS 回环地址、容器内部端口和模型 API base URL 的执行主体边界；
- Astro typecheck、ESLint、13 个测试文件共 170 项测试、内容检查、release readiness、
  71 页 / 2075 条内部链接与 `git diff --check` 均通过；第五册专用测试为 20 项；
- production 仍为 71 页、Pagefind 仍为前四册 60 个正文页；第五册 production HTML 与搜索引用均为 0；
- 本轮 10 篇正文在 375、768、1440 共 30 组浏览器检查中无页面级横向溢出；深色模式、无 JavaScript
  正文和包含 15 个内容单元的开发态草稿打印页通过；浏览器控制台无 error；
- 6 个本轮直接引用的 Open WebUI 官方链接均返回 HTTP 200；27 个第五册文件的私钥、API key、
  JWT 与 UUID 模式扫描均为 0；
- `npm audit` 按 2026-09-10 漏洞库报告 8 项开发工具链风险（2 moderate、5 high、1 critical）；
  本轮未自动修改依赖，需在独立维护任务中评估升级和回归。

首轮校订没有创建 VPS、容器、管理员、Tunnel、route 或模型连接，没有调用付费 API，也没有执行
add、commit、push、部署或发布。`editorial-pass-1.md` 保存完整范围和验证边界。

## 2026-09-10 第二轮整册写作校订验证结果

- 第 6、8 章明确区分管理员后端 External connection 与实验性浏览器 Direct Connections，并固定
  第一版关闭浏览器直连；加入后台 Task Models 开关和电脑 / 手机分段用量观察；
- 第 9 章补齐 Default Permissions、群组与资源授权的叠加规则，把分享改为指定对象、Public、Open
  三种范围，并同时核对管理员聊天查看和导出能力；
- 第 11 章明确公开 HTTPS 加固后，HTTP SSH 页面不能作为等价登录对照；第 12 章补齐应用 API key、
  模型 key 轮换、Tunnel 来源和 Cloudflare 费用边界；
- Astro typecheck、ESLint、13 个测试文件共 171 项测试、内容检查、release readiness、
  71 页 / 2075 条内部链接与 `git diff --check` 均通过；第五册专用测试为 21 项；
- production 仍为 71 页、Pagefind 仍为前四册 60 个正文页；第五册 production HTML 与搜索引用均为 0；
- 五章在 375、768、1440 共 15 组浏览器检查中无页面级横向溢出；深色模式、五章无 JavaScript
  正文和包含 15 个内容单元的开发态草稿打印页通过；浏览器控制台无 error；
- 11 个本轮官方链接均返回 HTTP 200；28 个第五册文件的私钥、API key、JWT 与 UUID 模式扫描均为 0；
- `npm audit` 仍报告 8 项开发工具链风险（2 moderate、5 high、1 critical），保持独立依赖维护边界。

第二轮校订没有启用 Direct Connections、Task Models、用户、分享、API key 或导出，没有创建外部资源、
调用模型、产生新费用，也没有执行 add、commit、push、部署或发布。`editorial-pass-2.md` 保存完整证据。

## 2026-09-11 G4 模型连接实机结果

- DeepSeek 当前官方 base URL、价格页、账户 `/models` 与实际响应共同确认正式模型 ID 为
  `deepseek-flash`，模型版本为 DeepSeek-V4.1-Flash；
- 创建一把第五册专用、可独立撤销的 key；真实值只进入受控 keychain 与 Open WebUI 配置，未写入仓库、
  聊天、命令行参数或截图；
- DeepSeek 当前没有逐 key scope、逐 key 支出上限或告警，采用 `deepseek-flash` 单模型 allowlist、
  4 元停发线与 5 元人工硬上限补偿；没有充值或订阅；
- Open WebUI 内置 Evaluation Arena 会额外显示 `arena-model`；关闭 Arena models 后，模型列表恰好只剩
  `deepseek-flash`；
- 只发送一次固定合成提示；HTTP 200、SSE、单个 `[DONE]`、精确预期回答与响应 usage 均通过；刷新后
  提示、回答、模型和聊天标题仍存在；
- 禁用连接后模型列表为 0，恢复同一连接后只回到 `deepseek-flash`，key 未变化且没有再次调用模型；
- DeepSeek 用量面板注明汇总最多延迟 5 分钟；G4 当时未显示可见增量，可能低于显示精度或继续
  延迟。G5 复核后，专用 key 汇总为 2 次请求、97 tokens、费用低于 0.01 元；G8 继续最终核账；
- G4 收口时 `chat` DNS / route 尚不存在，Open WebUI 只通过 SSH local forwarding 访问；公网
  3000、80、443 没有因 G4 增加入口；
- 第 6 章、资料来源、事实台账、runbook 与结果台账已经按现场差异最小校订；第五册仍为
  `drafting / 0.0.0`，继续排除 production、Pagefind、完成状态与正式打印。
- Astro typecheck 0 errors / warnings / hints，ESLint 通过，13 个测试文件共 171 项测试通过；
- production build 仍为 71 页，Pagefind 仍只索引前四册 60 页，71 页 / 2075 条内部链接与
  release readiness 均通过；
- `PROJECT_STATUS.yaml` v1 校验与 `git diff --check` 通过；第五册正文、QA、规划、组件、测试、状态与
  README 的私钥、API key、JWT、UUID 和非教学公网 IPv4 模式扫描均为 0。

## 2026-09-11 G5 公开 route 与端到端实机结果

- 公开前复核唯一管理员、signup 关闭、默认 `pending`、第一版权限关闭、唯一模型和费用边界；
- 将 `WEBUI_URL`、`CORS_ALLOW_ORIGIN`、`WEBUI_SESSION_COOKIE_SECURE` 与
  `WEBUI_AUTH_COOKIE_SECURE` 收紧到唯一 `https://chat.<LAB_DOMAIN>`；保留原 Secret 与 named volume；
- Compose 重建后四个容器环境值均正确，但数据库 ConfigVar 仍保存旧 WebUI URL；经管理员配置接口更新后，
  环境与保存值一致。第 7 章已加入“两层核对”的脱敏实机说明；
- 创建唯一 `chat.<LAB_DOMAIN> -> http://127.0.0.1:3000` published application route；Cloudflare 自动建立
  Proxied DNS 记录，未创建指向 VPS 公网地址的记录，也未启用 Access 或其他付费产品；
- 公共 A / AAAA、Universal SSL、证书主机名、TLS 验证、公开首页与版本接口均通过；Open WebUI 登录响应
  Cookie 同时含 Secure、HttpOnly 与 SameSite；精确同源 CORS 通过，错误 Origin 不返回允许头；
- WebSocket 握手成功；G5 只新增一次固定短答，HTTP 200、40 个 SSE 数据块、单个 `[DONE]`、精确预期回答
  和 78 tokens 均通过；保存并刷新 G5 合成聊天没有新增模型调用；
- 专用 key 汇总为 G4—G5 共 2 次请求、97 tokens、费用低于 0.01 元；没有充值或订阅，4 元停发线与
  5 元硬上限均未触发；
- 桌面 Chrome 与 Owner 手机蜂窝网络均完成登录、打开同一聊天和刷新；回环与公开版本身份一致；VPS 无
  80 / 443 监听，3000 仍只监听 `127.0.0.1`，源站公网 80 / 443 / 3000 直接 HTTP 探测均不可达；
- G6 已完成错误 route 与错误模型 ID 两项故障并恢复；等待恢复 VPS 管理会话后继续应用与 connector
  故障，随后顺序进入 G7—G8。不得跳过失败基线、充值、扩容或启用付费产品；VPS 仍按
  0.014 美元/小时计费，直到 G8 永久销毁。

## 2026-09-11 G6—G8 实机闭环

- G6：应用停止实际为公开 502，错误 route 为 500，connector 停止为 530，错误 CORS 的 WebSocket
  路径为 500；各项都按单变量注入并恢复，本机和公开端最终回到 200。错误模型 ID 已通过；429 与
  上游 timeout 没有安全 sandbox，保持环境不覆盖；
- G7：停止写入后归档生产 volume、Compose 与 `.env`，生成 SHA-256 manifest，复制到 VPS 外并核对
  hash；同版本恢复到精确测试 volume 与回环 3100，数据库 hash、1 admin、4 条合成聊天、345 项配置和
  单模型连接占位一致，没有调用模型。`v0.11.3` 仍是最新稳定版，跨版本 migration 环境不覆盖；
- G8：删除唯一 route 与自动 DNS、模型连接与专用 key、容器 / network、生产和测试 volume、Secret、
  VPS 内外备份、connector / Tunnel、临时防火墙规则和 VPS。公共 DNS 零答案，旧 key 返回 401，
  Block Storage、Snapshot、Reserved IP 与 Load Balancer 清单为空；
- 根 zone、nameserver 与 DNSSEC 保留，Cloudflare Free 不变；模型最终 2 次请求、97 tokens、费用低于
  0.01 元，没有充值或订阅；VPS 销毁后不再产生持续计算费用，最终已发生小时费账单行可能延迟出现；
- 本轮外部实机对象已经清空。接下来只进行仓库 RC、PDF、跨浏览器、性能、子路径和线上发布验收。
