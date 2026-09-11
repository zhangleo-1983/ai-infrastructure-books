# 第五册内容规格与章节大纲

状态：核心主线、三篇样章与 15 个完整 draft 已获 Owner 确认；独立实机 runbook 与空白结果台账已建立，等待 G1 明确授权

策划日期：2026-08-23

书籍 ID：`05-open-webui`

最终书名：《搭建自己的 AI 对话入口：Open WebUI 从部署到维护》

本文定义第五册的目标读者、交付结果、内容边界、章节结构、技术主线、事实来源、
实机校订闸门和样章选择。它是正文写作与审阅的规格基线，不是正式发布内容。

当前第三批边界：

- 保留已确认的三篇样章、第一批与第二批，只创建已授权的第 12 章、附录与资料来源 draft；
- 完成 15 个内容单元的维护、删除、费用、Ollama 和官方事实连续性复核；
- 不连续进入实机 runbook、RC 或发布；
- 不把第五册纳入 production、Pagefind、完成状态或正式打印；
- 不购买模型额度、升级 VPS、创建公开 route 或部署 Open WebUI；
- 不把未验证的界面位置、版本和外部操作写成已经完成。

## 策划结论

第五册接收前三册建立的服务器与容器能力，以及第四册建立的域名与 HTTPS 能力：

```text
可以管理 Ubuntu VPS
+ Docker Engine 与 Compose plugin 可用
+ 知道怎样保存 volume、日志、版本和备份
+ 拥有可控制的域名与 Active 的 Cloudflare zone
+ 理解 Tunnel、独立子域名、HTTPS 和应用鉴权不是同一件事
+ 尚未部署 Open WebUI
+ 尚未接入模型服务
```

本册的目标不是只让浏览器出现一个聊天框，而是让零基础读者建立两条可以解释的路径。

第一条是浏览器访问路径：

```text
手机或电脑浏览器
→ https://chat.example.com
→ Cloudflare 边缘网络
→ 已有 Cloudflare Tunnel
→ 服务器上的 cloudflared
→ http://127.0.0.1:3000
→ Open WebUI 容器的 8080 端口
```

第二条是模型请求路径：

```text
Open WebUI 后端
→ HTTPS 访问 OpenAI-compatible API
→ 模型提供方验证 API key
→ 指定模型生成回复
→ 流式响应返回 Open WebUI
→ 浏览器逐步显示回答
```

这里的 OpenAI-compatible API 是“采用 OpenAI 常见请求格式的兼容接口”，不等于接口一定
由 OpenAI 公司提供。第一版主线建议使用远程模型接口，让普通 CPU VPS 负责界面、账户、
配置和数据，不要求它在本机运行大语言模型。

## 1. 已确认的核心方案

项目 Owner 已于 2026-08-23 确认本节主线，并授权三篇样章试写。

### 1.1 正文主线

1. 使用官方容器镜像和 Docker Compose 部署 Open WebUI；
2. 正文发布时固定一个经过实机验证的稳定版本标签，不使用会持续变化的 `:main`、
   `:latest` 或 `:dev` 作为长期运行基线；
3. 使用标准镜像，不在主线使用 CUDA、内置 Ollama 或 Kubernetes；
4. 把主机端口绑定为 `127.0.0.1:3000:8080`，不向公网开放 3000；
5. 使用独立 named volume 保存 `/app/backend/data`；
6. 通过 SSH 本地端口转发完成第一次访问与管理员注册；
7. 保持 `WEBUI_AUTH=True`，确认首位用户成为管理员，并在公开前确认注册入口已经关闭；
8. 由管理员在 Open WebUI 后端添加一个远程 OpenAI-compatible 模型连接；
9. 使用最小权限、可单独撤销和限制额度的模型 API key；
10. 复用第四册的生产 Tunnel，为 `chat.example.com` 创建独立 published route；
11. 在公开前设置并验证 `WEBUI_URL`、允许的 Origin、Secure Cookie、WebSocket 和流式响应；
12. 手动执行更新：先备份、记录版本和摘要，再更新、验证，失败时恢复更新前备份；
13. 在章节结尾分别记录 VPS、域名、模型调用和可选扩容的持续费用边界。

### 1.2 建议默认值

| 项目 | 建议默认值 | 说明 |
| --- | --- | --- |
| Compose 项目目录 | `$HOME/docker-labs/open-webui` | 沿用第三册目录习惯，与其他服务隔离 |
| Compose project | `book05-open-webui` | 日志、volume 与容器归属清楚 |
| 容器镜像 | `ghcr.io/open-webui/open-webui:vX.Y.Z` | `vX.Y.Z` 在样章/RC 校订时固定 |
| 镜像变体 | 标准镜像 | 不把 GPU、Ollama 和额外模型下载引入第一遍成功路径 |
| 主机监听 | `127.0.0.1:3000` | 容器仍监听 8080，公网不开放 3000 |
| 容器数据 | named volume → `/app/backend/data` | 保存账户、聊天、配置、上传文件和应用数据库 |
| 第一次访问 | SSH local forwarding | 公开 route 建立前完成管理员初始化与安全检查 |
| 应用认证 | 保持启用 | 公网应用不能使用 `WEBUI_AUTH=False` 单用户无登录模式 |
| 新用户策略 | 公开前关闭注册；如重新开放则默认 `pending` | 避免未知访客自动获得使用模型的能力 |
| 模型来源 | 远程 OpenAI-compatible API | VPS 不承担本地模型推理，不需要 GPU |
| 模型凭证 | 独立、最小权限、有限额的 key | 不使用管理主密钥，不写入仓库、截图或交接卡 |
| 公共主机名 | `chat.example.com` | 与第四册教学页和其他应用使用不同 route |
| 公开路径 | 已有 Tunnel 的独立 route | 不新增公网入站端口，不重新迁移 nameserver |
| 更新方式 | 人工审阅版本说明后更新 | 不把无人值守自动更新作为新手生产主线 |
| 完成率 | 只计算第 1—12 章 | introduction、appendix、sources 不计入 |
| 事实基线 | 2026-08-23 | 版本、界面、环境变量和许可在样章与 RC 前重查 |

### 1.3 不应使用的主线

- 不把“在 1 GB CPU VPS 上运行本地大模型”写成默认能力；
- 不要求读者购买 GPU VPS、安装 NVIDIA 驱动或编译模型运行时；
- 不把 Ollama、OpenAI、Anthropic、Gemini 和多个聚合网关扩写成五套并行教程；
- 不把模型 API key 放进 MDX、Git、Compose 明文示例、截图、聊天记录或 shell history；
- 不使用模型提供方的管理主密钥作为普通聊天流量凭证；
- 不向 `0.0.0.0:3000` 或公网防火墙开放 Open WebUI；
- 不在首位管理员和注册策略确认前创建公开 route；
- 不使用 `WEBUI_AUTH=False` 作为公网部署捷径；
- 不把 HTTPS、小锁、Cloudflare 代理或 Open WebUI 登录描述为绝对隐私保证；
- 不承诺一次点击只产生一次模型调用，也不承诺 Open WebUI 本身会替读者支付模型费用；
- 不使用滚动标签配合无人值守自动更新作为可回退的生产方案；
- 不把删除容器等同于删除数据，也不在未验证备份时删除 volume；
- 不移除或遮挡 Open WebUI 品牌，也不把项目描述为仍采用 MIT 许可证；
- 不在第一版启用社区 Functions、Pipelines、MCP、Open Terminal 或任意可执行代码插件。

## 2. 目标读者

### 核心读者

- 已完成第一、第三和第四册，或具备等价能力；
- 会用 SSH 登录 Ubuntu 服务器，但没有部署过 AI 对话界面；
- 使用过 ChatGPT 一类聊天产品，却不知道界面、模型和 API 是三个不同对象；
- 希望通过自己的域名，在电脑和手机上访问一个由自己管理的 AI 对话入口；
- 不理解 API endpoint、API key、模型 ID、上下文、token、流式响应和 WebSocket；
- 不知道“自托管界面”仍可能把提示词与附件发送给远程模型提供方；
- 害怕升级后聊天记录丢失，也不知道容器、volume 和备份各自保存什么；
- 希望先得到一套单用户或小规模自用、可维护、可下线的方案，而不是企业集群。

### 默认具备的能力

- 能确认 VPS 正在计费，并知道怎样停止或销毁不再需要的实例；
- 能运行 `sudo docker version`、`sudo docker compose version`、`sudo docker compose ps`；
- 能创建目录、编辑经过解释的文本文件，并读懂最小 Compose YAML；
- 知道容器端口、主机端口、回环地址和 named volume 的区别；
- 能登录 Cloudflare，并为已有 Tunnel 添加或移除一条独立 route；
- 能从服务器和外部网络分别验证一个 HTTPS 地址；
- 能在密码管理器中保存账户密码与 API key；
- 知道不能公开 `.env`、Cookie、Authorization header、Tunnel token 或 API key。

### 默认不具备的知识

- 不知道 Open WebUI 是对话与管理界面，不是大语言模型本身；
- 不知道远程模型费用通常按 token、请求、套餐或额度计算；
- 不知道一次可见聊天可能触发标题、标签等额外后台模型请求；
- 不知道首个本地账户、后续注册、用户角色和模型权限之间的关系；
- 不知道 Docker 内部的 `localhost` 与 VPS 主机的 `localhost` 不是同一个网络位置；
- 不知道 WebSocket 与 Server-Sent Events（SSE，服务器持续推送事件）会影响流式回答；
- 不知道部分环境变量首次启动后会写入数据库，之后改 Compose 不一定覆盖界面中的值；
- 不知道仅降级镜像不能撤销已经执行的数据库迁移；
- 不知道聊天、上传文件、知识库和 API key 具有不同的数据与隐私风险；
- 不知道当前 Open WebUI License 对品牌修改存在额外条件。

### 需要主动消除的焦虑

- “Open WebUI 会不会在我的小 VPS 上偷偷运行一个巨大模型？”；
- “没有 GPU 是不是完全不能开始？”；
- “用了自托管界面，提示词是否还会发给模型公司？”；
- “API key 填错会不会立刻产生无限费用？”；
- “手机能打开是不是代表端口已经暴露？”；
- “第一个注册的人为什么是管理员？”；
- “关闭注册会不会把现有管理员也锁在外面？”；
- “更新镜像会不会自动删掉所有聊天？”；
- “页面能开但模型不回答，应该查 Tunnel 还是查模型接口？”；
- “停止容器、删除容器、删除 volume 和销毁 VPS分别会丢什么？”

## 3. 阅读前提与停止条件

### 开始前需要准备

- 一台仍可通过 SSH 管理的 Ubuntu 24.04 LTS VPS；
- Docker Engine 与 Compose plugin；
- 至少能容纳官方镜像、应用数据、备份和更新期间双份镜像的磁盘余量；
- 一个可用且经过恢复演练的备份位置；
- 一个可控制的域名、Active Cloudflare zone 和健康的生产 Tunnel；
- 一个尚未用于其他业务的子域名，例如 `chat.example.com`；
- 一个支持 OpenAI-compatible Chat Completions 的远程模型接口；
- 该接口的 base URL、一个可用模型 ID 和一个独立的最小权限 API key；
- 模型提供方的当前价格、余额、限额、地区与数据处理政策；
- 密码管理器，以及可以创建强密码和保存恢复信息的受控位置；
- 维护窗口和明确的回退点。

读者不需要提前具备：

- GPU、CUDA 或本地模型；
- Kubernetes、Redis、PostgreSQL 或多实例负载均衡；
- Nginx、Caddy 或公开的 80/443 端口；
- OAuth、OIDC、LDAP、SCIM 或企业单点登录；
- Cloudflare 付费方案；
- Open WebUI 企业许可；
- 自动更新、自动扩缩容或集中日志平台。

### 必须停止的情况

出现以下任一情况，正文应要求读者先停下：

- VPS 内存或磁盘已经持续不足，且读者尚未评估扩容费用；
- 不知道现有 3000 端口是否被其他服务占用；
- Docker 或第三册遗留服务本身异常；
- 不知道 Cloudflare Tunnel 当前由谁维护，或 connector 已离线；
- `chat.example.com` 已承载其他业务；
- 无法确认模型 API 的计费方式、余额和支出上限；
- 只有模型提供方的账户管理主密钥，无法创建低权限 key；
- 准备把真实 key 粘贴到公开聊天、仓库或截图；
- Open WebUI 首位管理员身份不明，或公开页面仍允许未知访客注册；
- 计划上传工作秘密、个人敏感信息或受监管数据，却没有得到组织授权；
- 更新前没有可读备份，或从未验证备份能否恢复；
- 计划删除 volume、route、Tunnel 或 VPS，但无法说清影响对象和恢复方式。

## 4. 学习结果与交付物

### 认知结果

完成第五册后，读者应能：

- 区分 Open WebUI、模型提供方、模型、API 和浏览器；
- 解释浏览器访问路径与模型请求路径；
- 解释 endpoint、API key、模型 ID、token、上下文和流式响应；
- 理解自托管 Open WebUI 不等于本地运行模型，也不自动保证数据不出服务器；
- 理解应用登录、Cloudflare Tunnel 和 HTTPS 分别解决什么问题；
- 理解第一位用户、管理员、普通用户、pending 用户和关闭注册的关系；
- 理解 named volume 保存数据，但不能替代独立备份；
- 理解版本标签、镜像摘要、数据库迁移和恢复点之间的关系；
- 理解模型调用成本与 VPS、域名费用是不同账单；
- 按浏览器、Cloudflare、connector、Open WebUI、模型连接和提供方六层定位故障。

### 操作结果

| 交付物或能力 | 验收证据 |
| --- | --- |
| 可复现的 Compose 项目 | 项目目录、固定镜像版本、服务名和启动命令记录完整 |
| 仅本机监听的 Open WebUI | `127.0.0.1:3000` 可访问，公网 `:3000` 不可达 |
| 持久化应用数据 | named volume 挂载到 `/app/backend/data`，重建容器后账户仍在 |
| 可控制的管理员账户 | 首位管理员身份明确，强密码已保存，认证保持启用 |
| 已收紧的注册入口 | 公开前注册已关闭；如重新开放，新用户默认为 pending |
| 可用模型连接 | 管理员能看到预期模型并完成一次低风险测试对话 |
| 受控模型凭证 | key 可单独撤销、权限与额度受限，未进入仓库、日志或截图 |
| 独立 HTTPS 入口 | `https://chat.example.com` 可从电脑和手机访问 |
| 完整流式路径 | WebSocket/SSE 无报错，回答可以连续显示，不出现跨域或混合内容错误 |
| 可解释的成本记录 | 能分别指出 VPS、域名和模型提供方的持续或按量费用 |
| 可恢复的更新流程 | 更新前备份、固定旧版本、更新后验证和恢复演练均有记录 |
| 分层排错能力 | 能区分页面失败、应用失败、401/403、模型不存在、限额和上游超时 |
| 不含秘密的交接卡 | 只记录对象、路径、负责人、版本、验证和撤销方法，不抄录凭证 |

### 整册完成条件

建议只把第 1—12 章计入完成率。“开始之前”、附录和资料来源不计入。

12 章完成不只表示“聊过一次”，还必须确认：

- Open WebUI 仍只监听回环地址；
- HTTPS 地址可用，登录、WebSocket 与流式回答正常；
- 公开注册保持关闭，或新用户只能进入 pending；
- 管理员和模型 key 均可以独立撤销与恢复；
- 模型账单已设置合理上限，并能解释额外后台请求；
- 数据 volume、备份位置、当前版本与镜像摘要记录清楚；
- 至少完成一次更新前备份和隔离恢复验证；
- 知道怎样只下线 route、只停止应用、撤销模型 key 和永久清理全部资源；
- 交接卡与截图没有密码、API key、Cookie、token 或真实个人数据。

## 5. 第一版不包含的内容

第五册第一版不负责：

- 购买第一台 VPS、安装 Docker 或迁移 nameserver；
- 本地大语言模型选型、量化、微调、GPU 驱动和显存调优；
- Ollama 的完整安装、模型下载和硬件容量规划；
- 多节点 Open WebUI、Redis、PostgreSQL、对象存储或 Kubernetes；
- 高可用、水平扩展、企业监控、集中审计或灾难恢复架构；
- OAuth/OIDC、LDAP、SCIM、受信任请求头或企业 SSO 的完整实施；
- Cloudflare Access、WAF、Bot 管理或零信任策略的完整教程；
- RAG、向量数据库、Embedding 和知识库质量评测的完整课程；
- Web 搜索、图片生成、语音、Functions、Pipelines、MCP 和 Open Terminal；
- 社区插件的安装、代码审查或沙箱安全；
- 提示词工程、模型能力排行和聊天机器人产品设计；
- 多个模型提供方的付款、实名、地区和税务教程；
- 规避地区限制、支付限制、内容政策、组织审计或模型安全限制的方法；
- 法律、隐私、数据跨境或行业合规结论；
- 去除、替换或遮挡 Open WebUI 品牌；
- 第六册 Dify 的工作流、知识库和 AI 应用编排内容。

附录可以提供 Ollama 路径图、常用环境变量、命令速查和错误地图，但不扩展为第二条完整
部署主线。

## 6. 章节大纲提案

以下章节名和 slug 已随主线获得 Owner 确认。三篇样章已经确认；当前只继续第 1—5 章
第一批，其余内容单元在本批里程碑获确认后按批次建立。

| Order | 类型 | 建议 slug | 章节标题 | 读者要解决的问题 |
| ---: | --- | --- | --- | --- |
| 0 | introduction | `start` | 开始之前：先确认服务器、模型账户与费用边界 | 哪些资源已经具备，哪些凭证和费用必须先控制？ |
| 1 | chapter | `01-two-request-paths` | 一个聊天框背后有哪两条请求路径？ | 浏览器怎样到 Open WebUI，Open WebUI 又怎样到模型？ |
| 2 | chapter | `02-choose-model-provider` | 先选模型来源，再决定服务器规格 | 远程 API 与本地模型有什么差别，怎样判断费用和隐私边界？ |
| 3 | chapter | `03-plan-deployment` | 规划端口、数据、版本与回退点 | 怎样避免端口冲突、数据丢失和不可回退的滚动更新？ |
| 4 | chapter | `04-deploy-open-webui` | 用 Docker Compose 启动 Open WebUI | 怎样固定镜像、挂载数据并只监听 `127.0.0.1:3000`？ |
| 5 | chapter | `05-bootstrap-admin` | 创建首位管理员，公开前先收紧注册 | 谁会成为管理员，怎样验证认证、注册与角色设置？ |
| 6 | chapter | `06-connect-model-provider` | 接入第一个 OpenAI-compatible 模型 | endpoint、API key 和模型 ID 应该填在哪里，怎样避免凭证泄露？ |
| 7 | chapter | `07-publish-with-tunnel` | 用独立子域名发布 AI 对话入口 | 怎样复用已有 Tunnel，而不开放公网 3000？ |
| 8 | chapter | `08-first-conversation` | 完成第一次真实对话并核对完整路径 | 怎样验证登录、模型选择、流式输出、移动端和实际调用费用？ |
| 9 | chapter | `09-users-and-privacy` | 管理用户、聊天记录、附件与隐私边界 | 哪些数据保存在 VPS，哪些会发送给模型提供方？ |
| 10 | chapter | `10-backup-and-update` | 备份、更新、验证与恢复 | 为什么更新前必须备份，怎样处理单向数据库迁移？ |
| 11 | chapter | `11-troubleshooting` | 页面能开但模型不回答：逐层排查 | 401、403、404、模型不存在、限额、CORS、WebSocket 与上游超时怎样区分？ |
| 12 | chapter | `12-maintenance-handoff` | 巡检、撤销、下线与下一册交接 | 怎样让入口、数据、凭证和费用几个月后仍可维护？ |
| 13 | appendix | `appendix` | 附录：环境变量、命令、错误地图与 Ollama 路径图 | 日常维护时怎样快速查字段、命令和可选架构？ |
| 14 | sources | `sources` | 资料来源与校订记录 | 当前事实来自哪里，哪些内容每次发布前必须重查？ |

### 顺序设计说明

- 第 1 章先拆开浏览器路径和模型路径，避免把每次错误都归因于 Cloudflare；
- 第 2 章先判断远程或本地模型，再确定资源和费用；
- 第 3 章先设计端口、数据和回退点，再复制任何安装命令；
- 第 4—5 章只在回环地址完成部署和管理员初始化；
- 第 6 章在应用仍未公开时接入模型并验证凭证；
- 第 7 章才建立独立公开 route；
- 第 8 章同时验证电脑、手机、流式回答和模型账单；
- 第 9 章补足多用户、聊天、附件与数据流边界；
- 第 10 章把备份和恢复放在第一次正式更新之前；
- 第 11 章沿两条请求路径排错；
- 第 12 章形成可撤销、可下线、无秘密的交接；
- Ollama 只保留路径图，避免本地推理吞没整册主线。

## 7. 每章最低教学合同

每章正文都必须明确“做什么、为什么、成功状态、失败判断、安全或费用边界”。

### 开始之前

- 做什么：核对 VPS、Docker、域名、Tunnel、模型账户、可用额度和秘密保存位置；
- 为什么：部署之前必须先知道资源归属、持续费用和停止方法；
- 成功状态：能填写不含秘密的开始卡，并指出每笔可能费用；
- 失败判断：缺少模型 endpoint、模型 ID、受限 key、磁盘余量或回退负责人；
- 边界：不粘贴真实 key，不在未知付费状态下发送测试请求。

### 第 1 章：两条请求路径

- 做什么：画出浏览器路径和模型路径，并给每一段标注协议与责任方；
- 为什么：页面能打开与模型能回答是两个独立验收；
- 成功状态：读者能定位 `chat.example.com`、Open WebUI 和模型 API 的位置；
- 失败判断：仍认为模型运行在浏览器或 Cloudflare 中；
- 边界：自托管界面不等于提示词不会离开 VPS。

### 第 2 章：选择模型来源

- 做什么：比较远程兼容 API 与本地模型所需硬件、费用、数据流和维护；
- 为什么：模型来源决定服务器规格、账单和隐私边界；
- 成功状态：读者选定一种来源，并写明 endpoint、模型 ID、计费与撤销路径；
- 失败判断：只看到“免费”宣传，无法确认价格、地区、额度或数据政策；
- 边界：不承诺特定模型始终可用，不提供绕过地区或付款限制的方法。

### 第 3 章：规划部署

- 做什么：确定项目目录、端口、volume、版本、备份和回退点；
- 为什么：先设计归属与数据边界，才能安全创建容器；
- 成功状态：3000 未冲突，磁盘有余量，版本和备份位置明确；
- 失败判断：端口被占、磁盘不足、只有 `:main` 滚动标签或不知道 volume 归属；
- 边界：扩容、快照和额外备份可能持续收费，执行前单独确认。

### 第 4 章：部署 Open WebUI

- 做什么：建立最小 Compose 项目，拉取固定镜像并只绑定回环地址；
- 为什么：先得到可重复、未公开的应用基线；
- 成功状态：容器 healthy/running，本机 `127.0.0.1:3000` 返回预期页面，公网 3000 不可达；
- 失败判断：镜像拉取失败、容器反复重启、端口冲突或 volume 未挂载；
- 边界：不使用滚动或开发标签，不删除未知 volume。

### 第 5 章：初始化管理员

- 做什么：通过 SSH 本地转发访问应用，创建首位管理员并核对注册与角色；
- 为什么：首位用户拥有最高权限，必须在公开前由 Owner 控制；
- 成功状态：管理员能登录，认证启用，注册关闭或后续用户默认 pending；
- 失败判断：管理员身份不明、登录被禁用、未知用户已出现或注册仍无约束；
- 边界：密码不进入命令历史、截图或交接卡。

### 第 6 章：连接模型

- 做什么：在管理员设置中添加 base URL、受限 API key 和模型 allowlist；
- 为什么：Open WebUI 需要后端模型才能生成回复；
- 成功状态：模型列表只出现预期模型，完成一次受控测试请求；
- 失败判断：401/403、`/models` 不兼容、模型 ID 错误、额度不足或上游超时；
- 边界：不使用管理主密钥；必要时手工填写模型 ID，不随机修改 endpoint。

### 第 7 章：通过 Tunnel 公开

- 做什么：设置公开 URL 与 Origin，为 `chat.example.com` 创建独立 route；
- 为什么：在不开放公网 3000 的前提下提供 HTTPS 与移动端访问；
- 成功状态：DNS、证书、route、connector、登录页和应用源站全部对应；
- 失败判断：1016/1033/502、CORS、Cookie、WebSocket 或源站连接错误；
- 边界：不复用含敏感业务的主机名，不把 Tunnel token 放进 Compose。

### 第 8 章：第一次真实对话

- 做什么：从电脑和手机登录、选模型、发送低敏感测试问题并观察流式回答；
- 为什么：只有端到端请求和费用记录都成立，部署才算可用；
- 成功状态：回答连续显示，浏览器无 CORS/WS 报错，提供方出现可解释用量；
- 失败判断：页面可开但无模型、回答中断、重复请求异常或费用不可解释；
- 边界：第一次测试不上传隐私文件，设置小额限额和告警。

### 第 9 章：用户与隐私

- 做什么：检查注册、角色、模型权限、聊天、附件、分享和删除路径；
- 为什么：应用公开后，账户边界与数据流比页面样式更重要；
- 成功状态：只有授权用户可用模型，读者能说明数据保存与外发位置；
- 失败判断：匿名可访问、普通用户获得管理权限、公开分享不明或删除范围不清；
- 边界：不把受监管数据用于练习，不对提供方作超出官方政策的隐私承诺。

### 第 10 章：备份与更新

- 做什么：备份 volume、记录版本与摘要、更新固定标签、验证并做隔离恢复；
- 为什么：数据库迁移可能单向执行，只降级镜像不一定能回退；
- 成功状态：更新后登录、模型、聊天和附件正常，备份在独立位置可恢复；
- 失败判断：备份不可读、旧镜像与新数据库不兼容、Secret 变化导致会话失效；
- 边界：恢复会覆盖数据，必须明确目标 volume 并在独立环境先验证。

### 第 11 章：分层排错

- 做什么：沿浏览器、Cloudflare、connector、容器、模型连接和提供方逐层检查；
- 为什么：随机重装会破坏证据，甚至把单一 401 扩大为数据丢失；
- 成功状态：能根据状态码、日志和对照请求定位故障层；
- 失败判断：只能反复重启、删除 volume 或更换 key，却不能说明原因；
- 边界：日志脱敏，不公开 Authorization header、聊天正文和真实用户资料。

### 第 12 章：维护与交接

- 做什么：建立巡检、凭证轮换、费用核对、临时下线、永久退役和交接卡；
- 为什么：可维护服务必须能安全停止和转交；
- 成功状态：能分别撤销 route、停止应用、撤销模型 key、恢复数据和永久清理；
- 失败判断：所有资源依赖一个未知账户、没有费用负责人或无法确认剩余数据；
- 边界：永久删除和销毁必须单独确认，并先核对备份与精确目标。

## 8. 样章试写提案

第一阶段先写三篇 draft 样章；Owner 已于 2026-08-23 确认样章与第 1—5 章第一批，并继续授权第 7—10 章第二批：

| 样章 | 选择原因 | 要验证的组件与风险 |
| --- | --- | --- |
| `00-introduction.mdx` | 验证零基础读者是否能分清已有资源、模型账户、秘密和费用 | 开始卡、双路径总览、停止条件、费用闸门 |
| `06-connect-model-provider.mdx` | 验证全书最核心、最易随版本变化的应用设置路径 | 管理界面仿真、endpoint/key/model ID、401/403/404、秘密脱敏 |
| `11-troubleshooting.mdx` | 验证两条请求路径是否真正转化为可操作排错法 | 分层诊断器、状态码、日志脱敏、恢复动作 |

样章阶段仍保持：

- `src/data/books.ts` 中第五册为 `drafting / 0.0.0`；
- `search.enabled` 与 `print.enabled` 为 `false`；
- 样章不进入 production build、Pagefind 和正式完成状态；
- 不创建公开 route，不购买模型额度，不升级 VPS；
- 使用 HTML、CSS 或内联 SVG 教学仿真，不使用真实产品截图；
- 所有 API key、域名、IP、账户、用户邮件和资源 ID 使用占位符；
- 每篇样章通过内容结构、移动端、深色、无 JavaScript 和打印草稿检查后先汇报；
- 样章里程碑完成后等待 Owner 确认，再决定是否写第 1—12 章完整正文。

如果 Owner 更希望第一批直接验证部署命令，可用 `04-deploy-open-webui.mdx` 替换
`00-introduction.mdx`，其余两篇不变。

## 9. 界面与可视化需求

建议复用现有浅层仿真组件，并在必要时增加少量第五册专用组件：

- 双请求路径图：浏览器路径与模型路径并排显示；
- 资源与费用清单：VPS、域名、模型调用和可选扩容分别计费；
- Compose 项目卡：镜像、端口、volume、环境和状态；
- Open WebUI 登录/注册仿真：明确标注为教学仿真；
- 管理员设置侧栏仿真：突出 Connections、Users、Models 等本章字段；
- 模型连接表单仿真：只显示 `<MODEL_API_BASE_URL>`、掩码 key 与 `<MODEL_ID>`；
- 用户角色矩阵：admin、user、pending 的能力差异；
- 数据流图：浏览器、VPS、模型提供方分别能接触哪些数据；
- 流式回答状态卡：请求中、正在生成、完成、上游失败；
- 备份/更新/恢复时间线；
- 六层故障诊断器；
- 永久退役清单。

不应创建一张由复杂 JSON 驱动的整站 UI。MDX 中仍要能直接找到界面文字并修改。
所有仿真必须在手机宽度、深色模式、无 JavaScript 和打印样式下保留阅读顺序。

## 10. 官方事实来源与校订清单

初始校订基线日期：2026-08-23；最近复核日期：2026-09-10。最近复核把新部署固定版本从
`v0.11.0` 更新为 `v0.11.3`。样章开始前、完整正文开始前和每个 RC 前都要重新查看官方资料。

### Open WebUI 安装与版本

- 官方 Quick Start：<https://docs.openwebui.com/getting-started/quick-start/>；
- 官方 GitHub Releases：<https://github.com/open-webui/open-webui/releases>；
- [ ] Docker 是否仍为普通用户推荐路径；
- [ ] 官方镜像 registry、架构和标准变体；
- [ ] 当前稳定版本标签、发布日期、已知问题和镜像摘要；
- [ ] `:main`、`:latest`、`:dev` 与固定版本标签的当前含义；
- [ ] 容器端口和 `/app/backend/data` 数据路径；
- [ ] Compose v2 命令和官方示例是否变化；
- [ ] WebSocket 是否仍为当前版本必需能力；
- [ ] 当前版本对 CPU、内存、磁盘和架构的实际需求。

### 账户、认证与环境变量

- 官方环境变量参考：<https://docs.openwebui.com/reference/env-configuration/>；
- 官方 Hardening：<https://docs.openwebui.com/getting-started/advanced-topics/hardening/>；
- [ ] 首位注册用户成为管理员与首次注册后关闭 signup 的当前行为；
- [ ] `WEBUI_AUTH`、`ENABLE_SIGNUP`、`DEFAULT_USER_ROLE` 的默认值；
- [ ] 哪些变量属于持久化 ConfigVar，何时由数据库值覆盖环境值；
- [ ] `WEBUI_SECRET_KEY` 的生成、持久化、轮换与恢复影响；
- [ ] 密码复杂度默认值和推荐配置；
- [ ] 登录、注册、用户角色和管理员界面当前路径；
- [ ] Cookie Secure、SameSite 与公开 HTTPS 的当前建议。

### 模型连接、费用与隐私

- 官方 provider 入口：<https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/>；
- 官方 OpenAI-compatible 指南：
  <https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible/>；
- 官方 FAQ：<https://docs.openwebui.com/faq/>；
- [ ] `/v1/chat/completions`、`/v1/models` 与可选 endpoint 的当前要求；
- [ ] 管理员级连接在后端保存和调用 key 的当前行为；
- [ ] 模型 allowlist、连接启停与普通用户权限；
- [ ] 标题、标签、搜索等后台任务是否会产生额外调用；
- [ ] 选定模型提供方的价格、限额、余额告警、地区和数据政策；
- [ ] 上游返回 401、403、404、429 和 5xx 时的当前界面与日志；
- [ ] API key 撤销后现有连接的失败状态。

### HTTPS、Tunnel 与流式响应

- 官方 HTTPS / Reverse Proxy 说明：<https://docs.openwebui.com/reference/https/>；
- 官方 Cloudflare Tunnel 指南：
  <https://docs.openwebui.com/reference/https/cloudflare-tunnel/>；
- [ ] `WEBUI_URL`、`CORS_ALLOW_ORIGIN` 与公开域名的当前要求；
- [ ] WebSocket、SSE、proxy buffering 与超时的当前要求；
- [ ] Cloudflare Tunnel 是否正确透传登录 Cookie、WebSocket 和长响应；
- [ ] `127.0.0.1:3000` 到容器 8080 的路由是否通过实机验证；
- [ ] 手机网络、桌面浏览器和第二网络的登录与流式回答；
- [ ] Cloudflare 上传限制、连接时限或缓存行为是否影响本册功能。

### 更新、备份与许可

- 官方更新指南：<https://docs.openwebui.com/getting-started/updating/>；
- 官方 License 说明：<https://docs.openwebui.com/license/>；
- 仓库 LICENSE：<https://github.com/open-webui/open-webui/blob/main/LICENSE>；
- [ ] 官方 volume 备份与恢复命令是否仍适用于当前镜像；
- [ ] 数据库迁移是否单向，降级前需要怎样恢复旧备份；
- [ ] 更新后必须复核的账户、模型、聊天、附件、Cookie 和 WebSocket；
- [ ] 当前版本的许可名称、品牌限制、适用版本和官方说明；
- [ ] 教学仿真是否保持 Open WebUI 名称与品牌边界，不暗示官方合作；
- [ ] 正文不得把 v0.6.6 以后的版本继续称为 OSI 批准的开源许可证。

## 11. 实机校订与外部操作闸门提案

样章与 15 个完整 draft 已获 Owner 确认，独立 runbook 与空白结果台账已经建立。每个闸门只
授权当下阶段，不能自动跨越到下一步；当前停在 G1 授权前。

| 闸门 | 外部操作 | 成功标准 | 费用或停止边界 |
| --- | --- | --- | --- |
| G1 | 建立隔离 VPS/现有服务器基线 | Docker、磁盘、内存、端口和备份位置可解释 | 新 VPS、扩容、快照或备份产品均需单独费用确认 |
| G2 | 拉取固定镜像并回环启动 | container 正常、volume 持久、公网 3000 不可达 | 不使用滚动标签；资源不足先停，不自动扩容 |
| G3 | 创建首位管理员并收紧注册 | 管理员可登录、认证开启、注册关闭、无未知用户 | 密码不记录；身份异常立即停 |
| G4 | 添加真实模型连接并发起最小测试 | 模型列表正确、一次回答成功、用量可核对 | 先设支出上限；付费或预充值需明确授权 |
| G5 | 创建 `chat` 独立 route 并公开 | HTTPS、登录、Cookie、WS/SSE、电脑和手机通过 | 不开放公网 3000；route 创建前再次确认 |
| G6 | 短时故障注入与恢复 | 覆盖应用、错误 route、connector、401/404/429/上游超时 | 不故意产生高额调用；每项恢复后再继续 |
| G7 | 备份、更新、降级边界与隔离恢复 | 更新前备份可恢复，数据库迁移边界有实证 | 恢复会覆盖数据；只对精确隔离 volume 操作 |
| G8 | 永久清理实验 route、容器、volume、key 与临时 VPS | DNS/route/key/数据/实例和账单均闭环 | 永久删除、撤销 key、销毁 VPS分别最终确认 |

实机证据继续采用占位符：`<LAB_DOMAIN>`、`<LAB_IPV4>`、`<MODEL_API_BASE_URL>`、
`<MODEL_ID>`、`<TUNNEL_NAME>`。任何 API key、Tunnel token、Cookie、用户邮箱、账户 ID、
真实聊天和账单身份信息都不得进入仓库、聊天、日志摘录或截图。

详细执行顺序、费用边界、停止条件与 G8 清理分段见
[`docs/qa/05-open-webui/field-validation-runbook.md`](../qa/05-open-webui/field-validation-runbook.md)；
现场只向
[`docs/qa/05-open-webui/field-validation-results.md`](../qa/05-open-webui/field-validation-results.md)
填写脱敏实证。第四册 G8 已删除旧 VPS、connector 和 Tunnel，因此第五册默认在 G1 经费用确认后
建立新的隔离临时 VPS 与专用无 route connector，不把第四册旧结果冒充第五册实测。

## 12. 风险矩阵

| 风险 | 可能后果 | 策划控制 |
| --- | --- | --- |
| 把 Open WebUI 当成模型 | 错估 VPS 配置、费用和隐私 | 第一章用两条请求路径持续校正 |
| 在小型 VPS 运行本地模型 | 内存耗尽、响应极慢或额外扩容 | 主线只接远程兼容 API，Ollama 放附录路径图 |
| 使用滚动镜像标签 | 更新不可复现、界面与数据库突然变化 | RC 固定版本与摘要，人工更新 |
| volume 未挂载或误删 | 账户、聊天、配置和附件丢失 | 启动前检查挂载，删除前精确确认与备份 |
| 首位管理员被他人抢先注册 | 实例控制权丢失 | 只在 SSH 转发下初始化，公开前核对用户表 |
| 公网注册保持开放 | 未知用户消耗模型额度或接触数据 | 注册关闭；重新开放时默认 pending |
| `WEBUI_AUTH=False` | 公开实例没有应用登录 | 明确禁止用于公网主线 |
| API key 泄露 | 额度被盗用、数据和账单风险 | 最小权限、限额、受控输入、撤销演练和扫描 |
| 使用管理主密钥 | 普通流量获得过高权限 | 官方最小权限建议进入强制提示 |
| endpoint/model ID 错误 | 页面能开但无模型或 404 | 模型连接章提供字段级与 endpoint 级验证 |
| 后台任务产生额外请求 | 用量高于“一条消息”预期 | 费用章解释任务模型和账单对照 |
| CORS/Cookie/WS 配置错误 | 登录失败或流式回答中断 | 公开前固定 URL/Origin，跨浏览器与手机验收 |
| HTTPS 被误当成隐私保证 | 上传不应外发的数据 | 数据流图明确 VPS 与提供方边界 |
| 数据库迁移后只降级镜像 | 旧版本无法读取新数据库 | 更新前备份，恢复旧版本必须配套旧备份 |
| 自动更新无人值守 | 夜间中断或不可回退 | 不作为主线；先看 release notes 和安排窗口 |
| 许可描述过时 | 教学事实错误或品牌违规 | 每个 RC 重查 LICENSE，不去品牌、不声称 MIT |
| 社区插件执行任意代码 | 主机、数据和凭证暴露 | 第一版不安装 Functions、Pipelines、MCP 或 Open Terminal |
| 清理顺序错误 | 数据不可恢复或仍持续计费 | G8 分 route、key、应用数据、VPS 和账单逐项确认 |

## 13. 与系列前后册的衔接

### 从第一册接收

- Ubuntu 24.04 LTS VPS、SSH 与 sudo 能力；
- 公网地址、云防火墙、账户与计费边界；
- 磁盘、内存和实例销毁方法。

第五册不重新教授购买和首次登录，但必须重新评估 Open WebUI 的资源需求。

### 与第二册共存

- 不修改 3X-UI、Xray、节点端口、订阅或客户端；
- 不把 Open WebUI、模型 API 或 Tunnel 与第二册代理链路混为一谈；
- 不在 Open WebUI 中保存第二册 UUID、Reality 私钥或订阅 URL；
- 端口与资源检查必须避免影响第二册现有服务。

### 从第三册接收

- Docker Engine、Compose plugin 和可读的 Compose 项目结构；
- 镜像、容器、端口、volume、环境变量、日志、备份与恢复概念；
- `up -d`、`ps`、`logs`、`down` 等基本命令；
- 不把秘密写入仓库的习惯。

第五册仍需完整解释 Open WebUI 专属数据路径、端口、环境变量和更新风险。

### 从第四册接收

- 可控制域名、Active zone、DNSSEC 与生产 Tunnel；
- 每个应用使用独立子域名和独立 route 的原则；
- HTTPS、Cloudflare edge、connector 与本机源站的分层验证能力；
- 不公开应用主机端口、不泄露 Tunnel token 的安全边界。

第五册建议新增 `chat.example.com → http://127.0.0.1:3000`，而不是直接覆盖仍有用途的
`app.example.com`。

### 向第六册交付

第六册 Dify 可以接收：

- 一套可复现的 AI Web 应用 Compose 项目规范；
- 模型 endpoint、受限 API key、模型 ID 与费用边界；
- 应用登录、注册、用户角色和数据流检查方法；
- 独立子域名与 Tunnel route；
- WebSocket/SSE、上游模型错误和分层排错经验；
- 更新前备份、固定版本、隔离恢复和无秘密交接卡。

第六册仍需重新解释 Dify 的数据库、Redis、worker、知识库和工作流，不得直接复用 Open
WebUI 的数据或权限假设。

## 14. Owner 决策记录

项目 Owner 于 2026-08-23 确认以下决策：

1. 最终书名采用《搭建自己的 AI 对话入口：Open WebUI 从部署到维护》；
2. 采用“远程 OpenAI-compatible API”为唯一正文主线，本地 Ollama 放入附录路径图；
3. 采用官方标准镜像、固定稳定版本、`127.0.0.1:3000:8080` 和 named volume；
4. 采用“SSH 转发初始化首位管理员，收紧注册后再创建 `chat` route”的安全顺序；
5. 无人值守自动更新、SSO、Cloudflare Access、RAG 和插件排除在第一版；
6. 首批样章采用 `00-introduction`、`06-connect-model-provider`、
   `11-troubleshooting`；
7. 实机校订按 G1—G8 独立授权，任何付费模型调用、VPS 扩容和永久清理仍保留为明确的
   外部操作闸门；
8. 三篇样章与第 1—5 章第一批已获确认，第 7—10 章第二批与第 6、11 章连续性复核随后获确认；
9. Owner 已授权继续第三批第 12 章、附录与资料来源，完成后停在 15 篇完整 draft 整册复核闸门。
10. Owner 已确认第五册 15 个完整 draft，并授权建立独立实机 runbook 与空白结果台账；这不构成
    G1、VPS Deploy、Tunnel 创建、模型调用、公开 route 或任何付费操作授权。

当前 15 个完整 draft 已获确认，实机 runbook 已建立；G1 尚未授权。实机与 RC 闸门完成前不进入
production、Pagefind、完成状态、正式打印或发布。
