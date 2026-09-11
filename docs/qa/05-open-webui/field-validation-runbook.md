# 第五册 RC 实机校订执行方案

建立日期：2026-08-23

最近修订：2026-09-11

状态：执行闭环；第五册 15 个内容单元已进入 RC；G1—G8 均已授权并通过

适用内容：《搭建自己的 AI 对话入口：Open WebUI 从部署到维护》15 个 draft 内容单元

## 当前边界

本文件只定义实机校订顺序、证据、费用和停止条件，不构成任何外部操作授权。

G1—G3 已在 2026-09-10 经 Owner 授权后完成，G4—G8 已在 2026-09-11 经 Owner 授权后完成。
全部故障均先恢复到已知正常基线，再进入下一阶段。执行结束后的边界为：

Owner 曾授权按顺序继续 G6—G8；现场执行没有跨过任何失败基线。

- 第五册临时 VPS、Docker 对象、教学 Tunnel / connector、`chat` route / DNS、模型连接 / 专用 key、
  两个精确 volume、Secret 与临时备份均已删除；
- Cloudflare 根 zone、nameserver 与 DNSSEC 保留，Free 方案未变；
- DeepSeek 最终只有 2 次合成请求、97 tokens、费用低于 0.01 元，没有充值或订阅；
- VPS 已永久销毁，附加资源清单为空；最终已发生账单行可能延迟入账，但没有继续运行的计算对象；
- 仓库只保存占位符与脱敏结论，未保存真实地址、ID 或凭证。

本文件继续保留每个闸门的执行顺序、成功标准和停止条件，供以后版本重跑；本轮现场结果以
`field-validation-results.md` 为准。

## 目标

使用一套与业务隔离的临时环境，按书中顺序验证：

1. Open WebUI 固定版本能够以 Docker Compose 运行，数据进入 named volume，主机只监听
   `127.0.0.1:3000`；
2. 首位管理员只能从 SSH local forwarding 初始化，公开前保持认证开启、注册关闭且没有未知用户；
3. 一个最小权限的 OpenAI-compatible 连接能够列出预期模型并完成可核对用量的最小请求；
4. 独立 `chat` route 能经 Cloudflare Tunnel 提供 HTTPS、登录 Cookie、WebSocket / SSE 和流式回答；
5. 应用、route、connector 与模型上游故障能够分层观察、逐项恢复，不靠删除 volume 排错；
6. 停止写入后的备份能够在独立测试 volume 中恢复，更新与数据库 migration 的不可逆边界有证据；
7. 结束时能够精确清除临时 route、模型连接、key、容器、volume、Tunnel、VPS 和计费附加资源；
8. 全部证据保持脱敏，不把真实域名、IP、账户、凭证、聊天或账单身份材料写入仓库。

实机通过只证明主线在校订日期、所选版本和隔离环境中成立，不代表所有提供方、地区、账户、
浏览器、模型或未来控制台都相同。

## 从第四册接收的实际基线

第四册 G8 已永久删除教学 route、教学 DNS、connector、Tunnel 和临时 VPS。当前只保留：

- 一枚仍由 Owner 管理的隔离根域名；
- Cloudflare Free zone、权威 nameserver 和 DNSSEC；
- 域名续费责任。

因此，第五册实机环境**不能假定旧 VPS、旧 connector 或旧 Tunnel 仍存在**。默认方案是在 G1
建立一套第五册专用临时计算与 Tunnel 前置条件，但不创建公开 route。这样既不触碰生产 Tunnel，
也能在 G6 安全停止 connector。

如果 Owner 提供已经付费且明确空闲的服务器和 Tunnel，只有在资产清点证明它们不承载业务、
没有未知 route、资源余量足够且停止 connector 不影响其他服务后，才能改为复用。任何一项无法
证明时，使用新的隔离临时资源。

## 推荐隔离拓扑

```text
保留的隔离根域名 / Cloudflare Free / DNSSEC
└── chat.<LAB_DOMAIN>                         G5 前不存在公开 route
    └── 第五册专用 <TUNNEL_NAME>
        └── 单个 cloudflared connector
            └── 临时 Ubuntu 24.04 LTS VPS
                ├── http://127.0.0.1:3000
                │   └── Open WebUI 固定版本
                │       └── book05-open-webui-data
                └── HTTPS 出站
                    └── <MODEL_API_BASE_URL> / <MODEL_ID>
```

约束：

- 公网入站只保留受控 SSH；不开放公网 TCP 80、443、3000 或模型端口；
- Tunnel connector 只发起出站连接；Cloudflare 当前文档要求防火墙允许出站 TCP / UDP 7844；
- `chat.<LAB_DOMAIN>` 只属于第五册；不覆盖第四册 `app` 或其他已有记录；
- 主线不安装 Ollama，不开放 11434，不下载本地模型；
- 第一版不启用 Functions、Pipelines、MCP、Open Terminal、Web Search、文件上传或应用 API key。

## 版本、来源与复核日期

方案建立日为 2026-08-23，最近复核日为 2026-09-11。当前官方 GitHub latest release API 返回的
最新稳定版本是 `v0.11.3`，draft 固定版本已经随之更新。G2 实际拉取镜像前必须再次核对 latest stable、release notes、
官方 Quick Start、更新说明与许可证；如果版本发生变化，先记录差异，不自动把正文改成新版本。

主要官方依据：

- Open WebUI Quick Start：<https://docs.openwebui.com/getting-started/quick-start/>；
- Open WebUI Hardening：<https://docs.openwebui.com/getting-started/advanced-topics/hardening/>；
- 环境变量与 ConfigVar：<https://docs.openwebui.com/reference/env-configuration/>；
- OpenAI-compatible 连接：
  <https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible/>；
- Open WebUI 更新：<https://docs.openwebui.com/getting-started/updating/>；
- Open WebUI Cloudflare Tunnel：
  <https://docs.openwebui.com/reference/https/cloudflare-tunnel/>；
- Docker volume：<https://docs.docker.com/engine/storage/volumes/>；
- Cloudflare published applications：
  <https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/>；
- Cloudflare Tunnel 防火墙要求：
  <https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-with-firewall/>；
- Cloudflare Tunnel 故障边界：
  <https://developers.cloudflare.com/cloudflare-one/troubleshooting/tunnel/>。

Open WebUI 的部分环境变量属于 ConfigVar，首次启动后数据库或管理员界面中的值可能优先于新的
环境变量。校订时必须同时核对 Compose、管理员设置和实际 `/api/config` / 浏览器行为，不能只看
`.env` 就宣称配置生效。

## 资源与费用边界

| 资源 | 默认方案 | 费用闸门 |
| --- | --- | --- |
| 域名与 Cloudflare | 复用第四册保留的隔离根域名、Free zone 和 DNSSEC | 不购买新域名，不开通付费 Cloudflare 产品；发现付费页立即停 |
| VPS | 最多 1 台 Ubuntu 24.04 LTS amd64 临时 VPS | Deploy 前展示精确小时价、月价、税费与最低扣费规则，并由 Owner 确认 `<VPS_PRICE_CAP>` |
| VPS 附加项 | 自动备份、快照、Block Storage、Reserved IP、Load Balancer 默认关闭 | 任一附加收费项默认开启或无法关闭时停止 |
| Open WebUI | 官方固定稳定镜像，不使用滚动标签 | 软件拉取本身不授权升级 VPS；资源不足先停 |
| Cloudflare Tunnel | 第五册专用 Tunnel 与单 connector，Free 能力 | 出现 Access、Load Balancer 或其他付费选择时停止 |
| 模型 | DeepSeek Open Platform、一个专用可独立撤销 key、`deepseek-flash` 单模型 allowlist | 提供方当前无逐 key scope / hard cap；充值、订阅或提高账户额度分别确认 |
| 模型校订预算 | 只发固定短提示，记录所有前台与后台调用 | 人工硬上限 5 元；累计达到 4 元停止新增调用，达到 5 元立即停止 |
| 备份 | 首选受控本机或 Owner 已有且不新增费用的存储位置 | 购买对象存储、快照或备份产品需要单独费用确认 |

VPS 创建后会持续按提供方规则计费，直到实例被永久销毁；停止系统或删除容器通常不会停止 VPS
费用。每个阶段开始和结束都记录累计运行时长。G8 完成前，结果台账必须把 VPS 标为“仍可能持续
计费”。

模型费用不能只按“一条聊天”估算。标题、标签或其他后台任务可能额外调用模型；每次测试前后都要
核对提供方用量。不得用压力测试、循环请求、长上下文、大附件或高价模型制造错误。

## 账户、凭证、数据与证据边界

Owner 保留：

- VPS、Cloudflare 和模型提供方的登录、密码、2FA、恢复码、支付与身份核验；
- VPS Deploy、充值、订阅、提高支出上限和所有永久删除的最终确认；
- Open WebUI 管理员密码与模型提供方专用 key 的密码管理器记录；
- CAPTCHA、验证码、账单地址、税务或实名信息输入。

Codex 只在当前闸门获准后：

- 使用受控 SSH 和已登录浏览器完成明确步骤；
- 通过标准输入或浏览器密码字段传递秘密，不在终端命令行、Shell history 或聊天中回显；
- 运行 Docker、端口、DNS、HTTPS、Cookie、WebSocket、SSE、日志、备份和恢复检查；
- 只摘录版本、状态、错误类别、HTTP 状态和脱敏时间线；
- 根据实证最小修订正文与 QA 台账。

禁止写入聊天、仓库、日志摘录或截图：

- 真实根域名、完整公开主机名、公网 IP、nameserver、DS 具体值；
- 账户、zone、实例、Tunnel、connector、用户或账单 ID；
- SSH 私钥、公钥全文、Tunnel token、模型 API key、Open WebUI Secret、密码、Cookie、验证码；
- 管理员邮箱、真实聊天、真实文件、附件名、Authorization header 或提供方原始请求；
- 未脱敏控制台截图、账单、余额、订单、WHOIS 或身份材料。

仓库统一使用 `<LAB_DOMAIN>`、`<LAB_IPV4>`、`<TUNNEL_NAME>`、`<MODEL_API_BASE_URL>`、
`<MODEL_ID>`、`<MODEL_TEST_BUDGET>`、`<BACKUP_LOCATION>` 等占位符。实机只使用合成聊天，
例如“只回复：BOOK05-RC-OK”，不得上传文件或粘贴敏感内容。

## 操作确认闸门

| 闸门 | 将发生的外部动作 | 公开 / 费用 / 删除风险 | 通过后仍不授权 |
| --- | --- | --- | --- |
| G1 | 复核保留 zone；部署或指定单台隔离 VPS；安装 Docker 与官方 `cloudflared`；创建第五册专用 Tunnel 和单 connector，但不创建 route | 新 VPS 开始持续计费；Tunnel token 属于敏感凭证 | 拉取 Open WebUI、创建管理员、模型 key 或公开 route |
| G2 | 拉取再次核对过的固定镜像，创建 Compose、network 与 named volume，只绑定回环 3000 | 消耗 VPS 磁盘、网络和内存 | 创建首位管理员或删除 volume |
| G3 | 通过 SSH local forwarding 创建唯一管理员，核对用户与注册策略 | 首位用户拥有最高权限；错误公开会被抢注 | 模型 key、模型调用或公开 route |
| G4 | 选择提供方、创建专用 key、建立一个连接并发起最小模型测试 | 可能充值、产生调用费用并向提供方发送合成提示 | 对互联网公开 Open WebUI |
| G5 | 写入唯一公开 URL / Origin / Secure Cookie 配置，并创建 `chat` route | 应用开始公开；互联网用户可抵达登录页 | 故障注入、更新或永久删除 |
| G6 | 依次停止应用、设置错误 route、停止专用 connector、注入安全的模型错误并恢复 | 预期短时中断；模型错误可能有少量调用 | 更新、覆盖数据或清理资源 |
| G7 | 停止写入、备份、隔离恢复；有安全新版本时才执行更新与回退边界验证 | 需要额外磁盘；错误恢复可能覆盖数据 | 删除正式 volume、key、Tunnel 或 VPS |
| G8 | 分批永久删除 route / DNS、模型连接 / key、容器 / volume / 备份、connector / Tunnel / VPS，并核账 | 不可逆删除、数据丢失与凭证撤销 | 删除根 zone、nameserver 或 DNSSEC |

## 统一结果分类

- **通过**：实际操作、成功状态、失败判断和结束状态与正文一致；
- **界面差异**：入口、字段、标签或排序变化，技术关系未变；
- **文档差异**：官方输出、版本、等待时间或状态说明变化；
- **技术纠错**：命令、版本、端口、数据路径或事实不能按描述工作；
- **安全纠错**：正文会扩大公开面、泄露凭证、误删数据或绕过认证；
- **费用停止**：需要未授权的部署、充值、订阅、扩容、备份或更高额度；
- **安全停止**：对象归属、身份、影响范围、备份、秘密或删除目标不明确；
- **环境不覆盖**：所选提供方、版本或账户没有安全可控的相应错误 / 更新路径；
- **环境阻塞**：支付、实名、库存、地区、网络、风控或平台状态无法继续。

技术纠错和安全纠错可以在证据充分时最小修订正文。单次错误码、响应时长、模型回答内容或
控制台排列不得扩展成所有环境的固定结论。

## G1：隔离基础设施与无 route 的 connector

### G1 授权前必须展示

1. 第四册保留 zone 的方案仍为 Free，权威 DNS 与 DNSSEC 公共验证正常；
2. `chat.<LAB_DOMAIN>` 没有 A、AAAA、CNAME 或 published application route；
3. 复用服务器或新建临时 VPS 的选择。默认新建；如复用，必须列出既有容器、监听、route、
   CPU、内存、磁盘、备份与停机影响；
4. 新 VPS 的精确地区、系统、架构、vCPU、内存、磁盘、流量、IPv4、小时价、月价、税费、
   最低扣费规则和所有附加项；
5. G1 将创建的唯一对象：单台 VPS、第五册专用 `<TUNNEL_NAME>`、单个 connector；
6. 明确说明 G1 不创建 DNS 或 route，不拉取 Open WebUI 镜像。

### G1 执行顺序

1. 只读导出 zone、DNS、Tunnel 与 route 摘要，用占位符记录，确认没有同名或未知对象；
2. 经费用确认后 Deploy 单台临时 VPS，交叉核对 SSH 主机身份；
3. 记录 Ubuntu / 架构、CPU、内存、磁盘、端口、云防火墙和附加资源基线；
4. 使用 Docker 官方仓库安装 Engine、Compose plugin 与 Buildx，运行最小官方验证后清理验证容器；
5. 在 Cloudflare 创建唯一第五册教学 Tunnel，但不添加 published application route；
6. 只通过隐藏 token 在指定 VPS 安装官方 `cloudflared` systemd 服务，随后清理临时 token 传递材料；
7. 验证 systemd enabled / active、控制台单个 connector Healthy、出站 TCP / UDP 7844；
8. 再次核对没有 `chat` DNS、没有 route、没有新增公网 80 / 443 / 3000 入站。

### G1 成功标准

- 只有一台已知临时 VPS，附加计费资源符合 Owner 确认；
- Docker、Compose 和 Buildx 版本可读，无未知容器或 volume；
- 只有一个第五册专用 Tunnel 和一个 Healthy connector；
- `cloudflared` enabled / active，7844 出站验证通过；
- Cloudflare route 列表为空，`chat.<LAB_DOMAIN>` 公共 DNS 零答案；
- VPS 没有 Open WebUI 镜像、容器、管理员、模型连接或 3000 监听；
- 仓库、Shell history 和脱敏日志没有 token、域名、IP、ID 或账户材料。

### G1 停止条件

- 价格、计费周期、附加资源或实例删除规则无法解释；
- zone、域名、服务器或 Tunnel 可能承载业务；
- 需要修改 nameserver、DS、根 zone 方案或启用 Cloudflare 付费产品；
- SSH 主机身份、VPS 镜像、系统架构或 Docker 来源无法确认；
- 出现未知 connector、route、DNS、容器、volume 或公网监听；
- token、密钥或真实标识进入聊天、日志、截图或仓库；
- 7844 出站失败且必须扩大公网入站才能继续。

## G2：固定镜像、回环端口与持久 volume

1. 再次核对 latest stable、release notes、许可证和固定版本；不使用 `main`、`latest` 等滚动标签；
2. 检查磁盘、内存、swap、3000 占用和 Docker 基线；资源不足先停，不自动扩容；
3. 按第 4 章创建权限为 600 的 `.env`、固定 Compose project、显式随机 Secret 和
   `book05-open-webui-data`；秘密不打印；
4. 先运行 `docker compose config -q`，再拉取镜像并启动；
5. 验证容器 Running / healthy、`/health`、`/api/config`、named volume 和镜像固定标识；
6. 从 VPS 与独立外部网络验证只有 `127.0.0.1:3000 -> 8080/tcp`，公网 3000 不可达；
7. `down` 后确认 volume 仍在，再 `up -d` 并验证数据持久入口；不得使用 `down -v`。

通过：固定版本、回环端口、认证开启、Secret 持久、volume 持久且公网 3000 关闭。

停止：容器反复重启、内存不足、磁盘异常、端口公开、匿名 volume、Secret 变化或需要删除 volume。

## G3：首位管理员、认证与注册策略

1. 保持没有 route，只通过 SSH local forwarding 打开本机入口；
2. 在 Owner 可控的浏览器中创建唯一首位管理员，密码与邮箱不记录；
3. 退出并重新登录，核对认证保持开启；
4. 核对注册已经自动关闭或由管理员关闭，默认新用户角色为 `pending`；
5. 核对用户列表恰好只有一名已知管理员，没有未知用户；
6. 重建容器但保留原 volume 与 Secret，再次登录，证明管理员状态持久；
7. 关闭 Open WebUI 应用 API key、文件上传和第一版排除功能。

通过：唯一管理员可重复登录，`WEBUI_AUTH=True`，signup 关闭，无未知用户，公网仍无 route。

停止：已存在未知用户、要求重新初始化管理员、Secret 或 volume 不一致、认证被关闭、入口意外公开。

## G4：远程模型连接与最小费用测试

### G4 费用前置

Owner 必须先确定：

- 提供方与官方 OpenAI-compatible base URL；
- 精确 `<MODEL_ID>`、地区可用性、数据保存 / 训练政策；
- 输入、输出与其他计费项目的当前官方单价；
- 余额、硬支出上限、告警和 `<MODEL_TEST_BUDGET>`；
- 是否需要充值或订阅。任何付款、预充值、订阅或提高上限都另行确认。

### G4 执行顺序

1. 创建第五册专用、最小权限、可独立撤销的模型提供方 key；不使用账户管理主 key；
2. 记录测试前余额 / 用量的脱敏摘要；
3. 仍只通过 SSH local forwarding，在管理员连接页填写 `<MODEL_API_BASE_URL>`、隐藏 key 和
   单个 `<MODEL_ID>` allowlist；
4. 验证模型列表只出现预期模型；
5. 发送一次固定短提示，不上传文件、不使用 Web Search / Tools / Functions；
6. 验证流式回答、停止按钮、聊天持久化和应用日志中的脱敏状态；
7. 核对提供方实际请求数、输入 / 输出量与费用，包括可能的标题或标签后台调用；
8. 禁用连接，再次确认模型不可用；恢复连接后不重复调用，除非结果不完整且预算仍允许。

通过：连接字段正确、模型 allowlist 正确、至少一次合成回答成功、实际用量可解释且不超预算。

停止：需要扩大 key 权限、价格或数据政策不明、必须充值但未授权、出现真实数据、用量异常、达到
预算 80%、key 泄露或提供方账户异常。

## G5：独立 `chat` route 与端到端公开验证

1. 公开前核对唯一管理员、signup 关闭、普通用户无高风险功能、模型预算仍有效；
2. 把 `WEBUI_URL`、`CORS_ALLOW_ORIGIN` 与两个 Secure Cookie 设置收紧到唯一
   `https://chat.<LAB_DOMAIN>`，保留原 Secret 与 volume；
3. 重建应用后先经 SSH 验证 health、登录、模型列表和配置实际生效；
4. 经 G5 明确授权创建唯一 route：`chat.<LAB_DOMAIN> -> http://127.0.0.1:3000`；
5. 核对自动 DNS、Proxied 状态、Universal SSL、证书主机名和 HTTPS，不使用 `-k` 验收；
6. 在桌面浏览器、手机网络和第二独立网络验证登录、Cookie、页面刷新、WebSocket / SSE、
   一次固定短回答和聊天持久化；
7. 核对回环页面与公开页面身份一致，公网 3000、80、443 仍不可直连源站；
8. 记录 G5 新增模型用量；如果需要超出预算，不继续调用。

通过：HTTPS、登录、Secure Cookie、WS / SSE、流式回答、多网络与回环源站一致；只有一个 route；
没有新增源站公网端口。

停止：证书错误、CORS / WebSocket 失败、注册重新开放、出现未知用户、DNS 冲突、源站端口公开、
模型费用异常或需要 Cloudflare 付费功能。

## G6：短时故障注入与逐项恢复

每个故障都遵循“保存正常基线 → 注入一个变量 → 记录现象 → 恢复 → 复测完整基线”。前一项没有
恢复时不得继续下一项。

| 故障 | 安全注入 | 预期观察 | 恢复标准 |
| --- | --- | --- | --- |
| 应用停止 | 只停止 Open WebUI 服务，保留 volume 与 connector | 本机 health 失败；公开端可能 502 或等价源站错误 | 应用 healthy，本机与公开登录恢复 |
| 错误 route | 临时改为一个明确未监听的回环端口 | connector 仍 Healthy；公开端可能 502；日志为 connection refused / origin unreachable | 改回 127.0.0.1:3000，HTTPS 恢复 |
| connector 停止 | 只停止第五册专用 connector | DNS 可能保留；公开端可能 1033、502、1016 或等价错误 | systemd active、单 connector Healthy、HTTPS 恢复 |
| 错误模型 key | 在受控维护窗口替换为专用无效测试值，不覆盖密码管理器原 key | 401 / 403 或提供方等价鉴权错误；页面仍能登录 | 恢复原 key，模型列表与一次允许的最小探针恢复 |
| 错误模型 ID | 临时设置一个明确不存在的占位模型 | 404、model not found 或提供方等价错误 | 恢复 allowlist，模型列表正确 |
| 429 | 只使用提供方官方 sandbox、低额度测试 key 或自然出现的额度错误 | 429 / quota / rate-limit 类别可分辨 | 不循环请求；恢复可用额度或记录环境不覆盖 |
| 上游超时 | 只使用提供方官方 sandbox / test endpoint 或安全可控的单连接超时 | timeout / 5xx 类别可分辨；应用与 Tunnel 正常 | 恢复真实 endpoint；不修改整机宽泛出站防火墙 |
| CORS / WebSocket | 保存配置后短时写入错误 Origin，保留 SSH 回退入口 | 浏览器拒绝 Origin、WebSocket 403 或流式失败 | 恢复唯一 HTTPS Origin，登录与流式复测通过 |

错误码是条件结果，不是必然结果。不得靠高频请求、耗尽真实余额、公开 key、关闭认证、删除 volume、
重建整个 zone 或停止非教学 Tunnel 制造错误。429 或超时没有安全测试路径时记录“环境不覆盖”。

## G7：备份、隔离恢复与更新边界

1. 只创建合成聊天和小型合成配置；不上传真实文件；
2. 停止应用写入，精确核对 source volume、固定版本、原 Secret、Compose 和备份目标；
3. 只读挂载 `book05-open-webui-data` 生成归档，复制 Compose 与权限受限的 `.env`，计算 hash；
4. 把唯一可恢复副本复制到 `<BACKUP_LOCATION>`；不得只留在待销毁 VPS；
5. 创建精确测试 volume `book05-open-webui-restore-check`，在回环 3100 使用同一源版本和原 Secret 启动；
6. 通过 SSH local forwarding 核对管理员、合成聊天、模型连接占位与配置，不从测试副本发真实模型请求；
7. 停止并精确删除测试容器。测试 volume 是否删除留到 G8 清单；
8. 再次检查当前 latest stable 与 release notes。只有存在经评审的安全新固定版本时，才对 live volume
   执行更新；更新前保留旧镜像、旧备份和原 Secret；
9. 更新后验证账户、聊天、模型、Cookie、WS / SSE、公开路径和 migration；
10. 回退只能使用“旧固定镜像 + 更新前备份 + 原 Secret”在隔离 volume 验证。不得只降镜像标签
    读取已经迁移的 live volume。

如果执行时 `v0.11.3` 仍是最新稳定版，更新与跨版本降级记录为“环境不覆盖”；只完成同版本备份、
恢复和容器重建验证，不人为安装旧版或预发布版制造 migration。

任何把备份恢复到 live volume、覆盖现有数据或删除唯一备份的动作，都需要 G7 内单独的恢复确认。

## G8：永久清理与费用闭环

G8 必须使用从控制台和主机只读导出的精确对象清单，不使用通配符、`docker volume prune`、
未核对的 `docker compose down -v` 或模糊名称。根 zone、nameserver 与 DNSSEC 默认永久保留。

### G8-A：公开入口与模型凭证

1. Owner 确认删除唯一 `chat` route 及其自动 DNS；
2. 验证公共 DNS 零答案、HTTPS 不可达，本机应用与 volume 仍在；
3. 删除 Open WebUI 中的第五册模型连接；
4. 证明专用模型 key 没有其他消费者后，由 Owner 确认并在提供方永久撤销；
5. 验证旧 key 不能再用，并核对最终模型用量与费用。

### G8-B：应用数据与备份

1. 停止应用，导出最终脱敏交接与备份 hash；
2. Owner 决定 `<BACKUP_LOCATION>` 中的最终备份是保留还是永久删除；
3. 逐个列出并确认删除：Open WebUI 容器、Compose network、
   `book05-open-webui-data`、`book05-open-webui-restore-check`、本机临时备份；
4. 删除权限受限 `.env` 与实验 Secret；验证没有其他 volume 或 Compose 项目受影响。

### G8-C：Tunnel、VPS 与账单

1. 停止并卸载第五册专用 connector，清理 token 传递材料；
2. Owner 输入精确 `<TUNNEL_NAME>` 并永久删除唯一教学 Tunnel；
3. 核对 Cloudflare 无第五册 route、DNS、Tunnel 或付费产品；
4. 核对 VPS 中没有需要保留的证据后，由 Owner 最终确认永久销毁实例；
5. 核对实例、自动备份、快照、Block Storage、Reserved IP、Load Balancer 和其他附加资源清单为空；
6. 核对本次小时费用、模型调用费用、税费与域名续费责任，确认没有继续计费对象；
7. 永久删除本机实验 SSH key、独立 known-hosts、真实地址和受控临时文件；
8. 运行仓库敏感值精确扫描。

G8 只有在公开入口、模型 key、数据、Tunnel、VPS、附加资源和账单全部闭环后才通过。任何对象归属、
唯一备份、费用或删除影响不明确时立即停止。

## 完整实机通过标准

- G1—G8 都有独立 Owner 授权与脱敏结果；
- 固定版本、回环 3000、named volume、认证、注册、模型连接、route、HTTPS、WS / SSE、备份恢复和
  分层故障均有实际证据或明确“环境不覆盖”；
- 所有故障已恢复，没有未知用户、未知 route、未知 volume 或未解释调用；
- 没有公网 3000 / 80 / 443 源站入口，没有泄露凭证或真实用户数据；
- G8 后没有第五册 VPS、Tunnel、route、DNS、模型 key 或计费附加资源；
- 根 zone、nameserver 与 DNSSEC 保留，除非 Owner 未来用新的独立任务授权变更；
- 实机差异已进入 `field-validation-results.md`，正文只做有证据支持的最小修订；
- 完成后再由 Owner 决定是否进入 production、Pagefind、完成状态、正式打印、PDF、跨浏览器与 RC
  综合验收。

## 本轮执行闭环

G1—G8 已通过，G8 已完成永久清理与费用闭环。

G1—G3 已于 2026-09-10 通过：单台 Ubuntu 24.04 amd64 临时 VPS、Docker 官方 APT、唯一
`<TUNNEL_NAME>`、单 Healthy connector、固定 `v0.11.3`、`127.0.0.1:3000`、named volume、
持久 Secret、`down` / `up` 数据保持、公网 3000 不可达、唯一管理员、signup 关闭、默认 `pending`
角色、第一版权限收紧以及刷新和重建后的认证持久均有脱敏证据。

G4 已于 2026-09-11 通过：官方 base URL 与 `/models` 确认 `deepseek-flash`，创建一把专用可撤销 key，
Open WebUI 只保留一个后端连接和单模型 allowlist；关闭内置 Arena 后模型列表只有一个预期模型；一次
固定合成提示得到 HTTP 200、SSE、`[DONE]` 与精确预期回答，刷新后聊天仍在。禁用连接时模型列表为 0，
恢复后只回到预期模型且未再次调用。提供方余额可用，人工 5 元硬上限未触发；用量面板注明最多延迟
5 分钟。G5 复核后专用 key 汇总为 2 次请求、97 tokens、费用低于 0.01 元；最终费用仍在 G8 核账。

G5 已于 2026-09-11 通过：Compose 环境与管理员 ConfigVar 都已收紧到唯一公开 HTTPS URL，精确 CORS、
Secure / HttpOnly Cookie、唯一 published application route、自动 Proxied DNS、Universal SSL、证书主机名、
桌面浏览器、手机蜂窝网络、WebSocket / SSE、固定短答和聊天刷新均通过；G5 只新增一次模型请求，专用 key
汇总为 G4—G5 共 2 次请求、97 tokens、费用低于 0.01 元。源站公网 80 / 443 / 3000 仍不可达，Cloudflare
保持 Free；VPS 按 0.014 美元/小时持续计费，停止实例仍计费，直到 G8 永久销毁。

G6 已按“保存正常基线 → 注入一个变量 → 记录现象 → 立即恢复 → 复测完整基线”完成。应用停止实际
得到公开 502，connector 停止实际得到公开 530，错误 route 实际得到 500，错误 Origin 使 WebSocket
路径得到 500；全部恢复后本机和公开路径均回到 200。错误模型 ID 已验证；401 / 403、429 和上游
timeout 因没有安全可控 sandbox 记为环境不覆盖。

G7 已完成停止写入备份、SHA-256 校验、VPS 外副本与同版本独立 volume 恢复；恢复副本中的管理员、
4 条合成聊天、配置和单模型连接占位一致，测试实例只监听回环且没有调用模型。校订时 `v0.11.3`
仍为最新稳定版，跨版本 migration 记为环境不覆盖。

G8 已精确删除 route / DNS、模型连接 / 专用 key、容器 / network、生产与恢复测试 volume、Secret、
VPS 内外临时备份、connector / Tunnel、临时防火墙规则和 VPS。两个公共解析器均返回主机名零答案，
旧模型 key 验证为 401；Block Storage、Snapshot、Reserved IP 与 Load Balancer 清单为空。根 zone、
nameserver 与 DNSSEC 保留，Cloudflare Free 不变。外部实机部分至此完成，可以进入 RC 综合验收与发布。
