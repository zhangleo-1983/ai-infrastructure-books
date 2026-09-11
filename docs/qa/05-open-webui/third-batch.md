# 第五册第 12 章、附录与资料来源第三批 draft 记录

授权日期：2026-08-23

状态：三篇 draft 与整册连续性复核已建立并通过验证，等待 Owner 对 15 个完整 draft 的整册复核

## Owner 授权与批次边界

Owner 已确认第 7—10 章第二批与第 6、11 章连续性复核，并授权继续。本批只完成：

- 第 12 章：已知正常基线、巡检、四类费用、凭证轮换、临时下线、永久退役与无秘密交接；
- 附录：环境变量、只读命令、双路径错误地图、数据费用对象和 Ollama 三种可选架构；
- 资料来源：Open WebUI、Cloudflare、Docker 与 Ollama 官方资料，以及 RC 重查和未验证清单；
- 15 个内容单元的版本、端口、volume、route、模型、费用、删除和下一册交接连续性复核。

本批只形成 15 个完整 draft，完成后停在 Owner 整册复核闸门。它不进入实机 runbook、
production、Pagefind、完成状态、正式打印、RC 或发布。

## 外部操作边界

本批只修改仓库 draft，没有执行以下操作：

- 没有通过 SSH 登录 VPS，也没有拉取 Open WebUI、Ollama 或辅助镜像；
- 没有创建、停止、重建、更新或删除容器、network、volume、备份、用户或管理员；
- 没有创建、修改或删除 Cloudflare route、DNS、Tunnel、connector 或入站规则；
- 没有创建、粘贴、轮换或撤销模型 key、应用 API key、Secret、Tunnel token、SSH key 或账户恢复因素；
- 没有发送真实模型请求、下载 Ollama 模型、充值、购买订阅、扩容 VPS 或创建付费存储；
- 没有执行永久退役、销毁 VPS、删除唯一备份或取消域名续费；
- 没有 add、commit、push、部署或发布。

## 官方事实三校

2026-08-23 已从 Open WebUI、Cloudflare、Docker 与 Ollama 官方资料核对：

- Open WebUI 当前把应用 API key 定义为继承用户权限的程序访问凭证；一名用户只有一把，新建会立即替换旧 key且不会自动到期；
- 模型提供方 key、Open WebUI 应用 API key、`WEBUI_SECRET_KEY`、Tunnel token 与管理员密码是五类不同对象；
- `WEBUI_SECRET_KEY` 参与登录 token 与部分加密数据，不应当作普通例行密码随意轮换；
- `docker compose stop` 保留容器与 volume；`down -v` 和 volume 删除必须保留为独立永久操作闸门；
- published route、模型连接、Open WebUI 应用和共用 connector 可以分别停止，影响范围不同；
- Compose 同一网络使用服务名发现，不应保存动态容器 IP；
- Linux 容器访问宿主机可用 `host.docker.internal:host-gateway` 显式映射，但必须验证监听与公网边界；
- Open WebUI 当前对宿主机 Ollama 建议 `http://host.docker.internal:11434`；容器中的 localhost 仍不是宿主机；
- Ollama 当前默认绑定 `127.0.0.1:11434`，官方 Docker 路径把模型存入 `/root/.ollama` volume；
- Open WebUI 标准数据 `/app/backend/data` 与 Ollama 模型 volume 是两个独立持久对象；
- Open WebUI 当前提供 Ollama 捆绑镜像，但它会改变镜像、模型存储、硬件与更新边界，不能悄悄替换本书标准镜像主线；
- 本地模型仍会产生 CPU/GPU、内存、磁盘、模型下载和维护成本，也不能自动证明所有功能完全离线。

Ollama 只保留路径图，不提供完整安装、模型下载、GPU 或第二套 Compose。固定版本、硬件容量、
11434 监听、模型 volume 和费用必须在另一个 Owner 确认的实验规格中实机验证。

## 内容成功合同

第三批验收必须证明：

- 第五册恰好 15 个内容单元，全部为 `draft: true`；
- 第五册继续为 `drafting / 0.0.0`，搜索和正式打印关闭；
- production build、Pagefind 与正式完成状态不包含第五册；
- 第 12 章明确区分只停模型、只撤 route、只停应用和停止共用 connector；
- 永久退役不提供一键生产删除脚本，route、key、容器、volume、VPS 与备份分别确认；
- 交接卡不包含密码、key、Cookie、token、真实用户资料或资源 ID；
- 附录命令以只读和低风险检查为主，删除命令不进入速查；
- Ollama 只解释宿主机、同 Compose 网络与捆绑镜像三种路径，不宣称已经安装或零成本；
- 资料来源只使用官方资料决定时效性事实，并保留所有实机未知项；
- 15 个单元在端口、volume、版本、模型、公开 route、更新恢复、费用与交接上连续；
- 敏感扫描不出现真实域名、IP、用户、Secret、key、Cookie、token、UUID 或账户 ID。

## 验证结果

- `npm run check`：通过；Astro 0 errors / warnings / hints，ESLint 通过；
- Vitest：13 个测试文件、167 项测试通过，其中第五册专用测试 17 项；
- production build：71 个 HTML 页面，没有第五册页面；Pagefind 仍只索引前四册 60 个正文页；
- 内容、release readiness 与 71 页 / 2075 条内部链接检查通过；
- `npm audit`：0 vulnerabilities；`git diff --check` 通过；
- 第三批 10 组 Shell 模板通过 `bash -n`，Ollama `host-gateway` Compose 片段通过 YAML 与字段合同检查；
- 第 12 章、附录、资料来源和草稿打印页在 375、768、1440 共 12 组检查中无页面级横向溢出；
- 三篇第三批内容在 1440 深色模式下正文、表格和提示框可读且无横向溢出；手机端 375 深色附录标题、标签和正文保持正常阅读顺序；
- JavaScript 边界：三篇服务器初始 HTML 共含 27 个正文区块，关键维护、Ollama 与未知项都已渲染；
- 草稿打印页包含 15 个 draft 标题标记和 155 个正文区块，保持 `noindex,follow`，三种宽度无页面级横向溢出；
- 浏览器控制台没有 error 或 warning；页面 CSS 含 print media、白色背景、分页 / 避免断页声明；
- 资料来源 34 个官方外链全部返回成功；校订期间修正了 Cloudflare Tunnel permissions 的当前官方路径；
- production 与 Pagefind 没有第五册路径或第三批标题；
- 第五册 26 个正文、QA、规划与专用组件文件敏感模式扫描：私钥、API key、JWT、UUID 和非教学 IPv4 均为 0。

验证完成后仍须停下等待 Owner 对 15 个完整 draft 的整册复核；不自动进入实机 runbook、
production、Pagefind、完成状态、正式打印、RC 或发布。
