# 第五册首轮整册写作校订

校订日期：2026-09-10

状态：第一批已完成并通过仓库内验证，等待 Owner 复核

范围：“开始之前”、第 1—5、7、10 章、附录、资料来源，以及与这些内容直接关联的技术事实与
实机 runbook；不改变已确认的书名、章节顺序、slug、远程模型主线或外部操作闸门。

## 为什么先处理这一批

第五册 15 个完整 draft 已获 Owner 确认，但从 draft 到 RC 仍需持续处理两类变化：

1. 软件稳定版本和官方操作事实会变化；
2. 真实读者不一定保留前一册的临时 VPS、Tunnel 或 route，正文必须能解释缺失交接对象时怎样安全返回，
   又不能把说明文字变成自动创建资源的授权。

## 本轮写作结果

### 固定版本从 v0.11.0 更新到 v0.11.3

- 2026-09-10，Open WebUI 官方 GitHub latest release API 返回 `v0.11.3`，发布于 2026-08-31；
- 新部署用固定 `v0.11.3`，不使用 `main`、`latest`、`dev` 或浮动 minor 标签；
- Compose、恢复副本、部署卡、健康检查来源、资料链接和实机 runbook 已同步；
- `v0.11.3` release notes 说明它修复了从 0.11.0—0.11.2 升级时，migration 失败后应用仍可能
  半更新启动的问题；正文因此明确：补丁升级也不能省略停止写入备份、启动日志和隔离恢复；
- 没有声称镜像已在 Ubuntu VPS 实机通过；digest、大小、资源占用与 migration 仍留给 G2 / G7。

官方证据：

- <https://api.github.com/repos/open-webui/open-webui/releases/latest>；
- <https://github.com/open-webui/open-webui/releases/tag/v0.11.3>；
- <https://github.com/open-webui/open-webui/blob/v0.11.3/Dockerfile>；
- <https://github.com/open-webui/open-webui/blob/v0.11.3/backend/start.sh>；
- <https://docs.openwebui.com/getting-started/quick-start/>；
- <https://docs.openwebui.com/getting-started/updating/>。

### 补齐前册资源已清理的阅读分支

“开始之前”新增四种交接状态：旧 VPS / Tunnel 均在、只缺 Tunnel、只保留域名与 zone、对象归属不明。
每种状态都写明现在做什么、不能做什么、何时返回第一至第四册，以及新建 VPS / Tunnel 仍需外部操作
与费用授权。

第 7 章从“必定复用第四册生产 Tunnel”调整为两个明确分支：

- Tunnel 仍存在且归属清晰时复用单 connector；
- 第四册实验资源已清理时，先在第五册 G1 建立专用无 route Tunnel / connector，再进入发布章。

两种分支都不在第 7 章安装第二个 connector，不公开 3000，不把 token 放进 Compose。

### 强化四类地址与执行主体

第 1 章新增公开聊天 URL、VPS 回环地址、容器内部端口、模型 API base URL 的字段对照，并解释
`localhost` / `127.0.0.1` 指向“执行连接的那台机器自己”。这让手机浏览器、VPS Shell、容器与
Open WebUI 后端之间的地址边界可以在首次部署前被检查。

## 明确保留的边界

- 15 个内容单元继续 `draft: true`；
- 第五册继续是 `drafting / 0.0.0`；
- production、Pagefind、完成状态和正式打印继续排除第五册；
- 未选择 VPS 或模型提供方，未拉取镜像、未创建管理员、Tunnel 或 route，未调用模型；
- 未改写用户已确认的书名、章节顺序、12 章主线或第一版排除项；
- 未执行 add、commit、push、部署或发布。

## 验证结果

- [x] Astro typecheck：88 个文件，0 errors、0 warnings、0 hints；
- [x] ESLint：通过；
- [x] Vitest：13 个测试文件、170 项测试通过，其中第五册专用测试 20 项；
- [x] production / Pagefind 排除：production 仍为 71 页，Pagefind 仍索引前四册 60 个正文页；
  第五册 production HTML 与 Pagefind 引用均为 0；
- [x] 内容、发布准备与内部链接：全部通过，71 个 HTML 中 2075 条内部链接有效；
- [x] 响应式：本轮 10 篇正文在 375、768、1440 三种宽度共 30 组检查中无页面级横向溢出；
- [x] 深色、无 JavaScript 与打印边界：375 深色页面可读；关闭 JavaScript 后第 1 章完整正文仍可读；
  开发环境草稿打印页包含 15 个内容单元且无横向溢出，正式打印仍未启用；
- [x] 官方外链：本轮直接引用的 6 个 Open WebUI 官方链接均返回 HTTP 200；
- [x] 敏感模式与 diff：27 个第五册正文、规划、QA 和测试文件中，私钥、API key、JWT、UUID
  模式均为 0；`git diff --check` 通过；
- [x] 依赖审计已执行：2026-09-10 的 npm 漏洞库报告 8 项（2 moderate、5 high、1 critical），
  涉及当前开发工具链。此次写作校订没有擅自执行 `npm audit fix` 或改变依赖；应另开依赖维护任务评估升级、
  回归和发布风险。

本轮只证明草稿内容、版本合同、布局和 production 隔离通过仓库内校订，不代表 Open WebUI 镜像、
VPS、Tunnel、模型 API 或迁移已通过实机验证。
