# 第四册 RC 实机校订执行方案

建立日期：2026-08-12

状态：G1—G8 与阶段 1—9 已完成；Tunnel、故障恢复、Caddy 对照、永久清理与费用闭环均已实测通过；Owner 已授权进入 `1.0.0-rc.1` 综合验收

适用内容：《让服务拥有域名：从 DNS 到 Cloudflare HTTPS》15 个发布候选内容单元

## 目标

使用一枚不承载业务的独立域名和一台临时 Ubuntu VPS，按书中顺序验证：

1. 第三方注册商域名能够完成 Cloudflare full setup、nameserver 迁移和 DNSSEC；
2. 第三册交接状态 `http://127.0.0.1:8080` 能被第四册直接接收；
3. 具名 Cloudflare Tunnel、connector、published application route 与 HTTPS 主线能够连续成立；
4. DNS、证书、Tunnel、connector、本机源站和 Compose 故障能够按层判断；
5. 单一公开 route 可以临时下线和恢复，而不删除 Compose 数据；
6. Caddy 能在独立主机名上完成传统公网反向代理对照，并在结束后彻底收口 80/443；
7. 全部实机差异可以脱敏记录，不把真实域名、IP、UUID、token 或账户材料写入仓库；
8. 校订结束后没有继续计费的 VPS、快照、备份、Reserved IP 或 Block Storage。

实机通过只证明这套主线在校订日期和环境中成立，不代表所有注册商、地区、账户、网络和未来控制台都相同。

## 推荐隔离拓扑

```text
第三方注册商中的独立空闲根域名
└── Cloudflare full setup / Free
    ├── app.<LAB_DOMAIN>
    │   └── Cloudflare Tunnel
    │       └── cloudflared
    │           └── http://127.0.0.1:8080
    └── caddy.<LAB_DOMAIN>
        └── DNS only → 临时 VPS 公网 IPv4:80/443
            └── Caddy
                └── http://127.0.0.1:8080
```

`app.<LAB_DOMAIN>` 验证全书主线；`caddy.<LAB_DOMAIN>` 只验证附录。两个主机名不能互相替换，也不能把同一个主机名同时交给 Tunnel 和 Caddy。

## 为什么不能用 Cloudflare Registrar 新购域名验证全书

Cloudflare Registrar 当前要求注册域名使用 Cloudflare nameserver。这样虽然可以验证域名、DNS、Tunnel 和 HTTPS，却会跳过第 3—4 章最重要的“从注册商修改 nameserver、等待 Active、处理旧 DS”过程。

完整校订应使用：

- 第三方注册商中的新域名；或
- 第三方注册商中明确不承载网站、邮箱、验证记录或其他业务的既有域名。

如果只能得到 Cloudflare Registrar 域名，可以验证第 5—12 章，但必须把第 3—4 章记录为“环境不覆盖”，不能伪造 nameserver 迁移结果。

## 资源与费用上限

| 资源 | 推荐值 | 费用边界 |
| --- | --- | --- |
| 域名 | 普通 ASCII 域名，第三方注册商，无现有业务 | 购买前由 Owner 核对首年价、续费价、税费与退款；不买 premium 域名 |
| Cloudflare | 现有合法账户，Free，2FA 已启用 | 不开通付费 Access、Load Balancer 或企业功能 |
| VPS | Ubuntu 24.04 LTS、amd64、1 vCPU、1 GiB、独立公网 IPv4 | 最多 1 台；Deploy 前由 Owner 设定月价上限；按小时使用并尽快销毁 |
| 附加资源 | 自动备份、快照、Block Storage、Reserved IP 均关闭 | 任何附加收费项出现时先停止 |
| 流量 | 静态教学页和少量校订请求 | 不做压力测试、下载大文件或公开传播 URL |
| Caddy | 官方稳定软件包 | 软件本身无额外购买；只在最后一个隔离阶段开放 80/443 |

如果复用一个已经付费但完全空闲的第三方注册商域名，新增费用通常只剩临时 VPS。复用域名前仍必须证明它没有网站、邮箱、子域名、验证记录或组织依赖。

## 账户、凭证与证据边界

项目 Owner 保留：

- 注册商、Cloudflare 和 VPS 控制台的登录、密码、2FA 与恢复码；
- 付款方式、账单地址、身份核验和 CAPTCHA；
- 域名购买、VPS Deploy 和所有永久删除的最终确认；
- 是否允许在指定维护窗口修改 nameserver、DS、route 和防火墙。

Codex 可以在每个操作闸门获准后：

- 在本机创建仅用于第四册的 ED25519 SSH 密钥；
- 通过 SSH 在隔离 VPS 上连续执行书中命令；
- 在已经登录的浏览器会话中填写和核对 Cloudflare 字段；
- 读取生成的 Tunnel 安装命令并直接用于指定 VPS，但不输出、记录或提交 token；
- 运行 DNS、HTTPS、端口、systemd、Compose、日志与回退验证；
- 生成脱敏结果、修改确有证据的正文差异并运行回归；
- 在 Owner 最终确认后协助清理 route、Tunnel、DNS 和 VPS。

禁止写入 Git、聊天、截图或 QA 文档：

- 真实根域名、公开主机名和公网 IP；
- 注册商、Cloudflare 或 VPS 的账户邮箱、账户 ID、zone ID 和实例 ID；
- Tunnel UUID、connector ID、Tunnel token、API token 或完整安装命令；
- SSH 私钥、公钥全文、登录密码、Cookie、2FA 验证码或恢复码；
- 未脱敏日志、证书序列号、账单、订单、WHOIS 联系信息和控制台截图。

仓库内统一使用 `<LAB_DOMAIN>`、`<LAB_IPV4>`、`<TUNNEL_NAME>` 等占位符。真实值只存在于当前受控浏览器、SSH 会话和本机忽略目录；交付报告只记录概括结果。

## 操作确认闸门

以下每一步都改变外部状态，必须在实际动作前单独确认：

| 闸门 | 将发生的动作 | 主要风险 | 确认人 |
| --- | --- | --- | --- |
| G1 | 购买或指定独立域名 | 产生费用、联系信息与续费责任 | Owner |
| G2 | Deploy 一台临时 VPS | 开始持续计费 | Owner |
| G3 | 把域名添加到 Cloudflare 并更改 nameserver / DS | 整个域名 DNS 迁移 | Owner |
| G4 | 把 Tunnel token 用于 VPS connector 安装 | 敏感凭证传输、创建 systemd 服务 | Owner 授权，Codex 执行或 Owner 自行执行 |
| G5 | 创建 `app` published route | 教学页开始公开，可被任何互联网用户访问 | Owner |
| G6 | 重启 VPS、停止 connector 或注入错误 route | 造成预期的短暂中断 | Owner |
| G7 | 为 Caddy 临时开放公网 TCP 80/443 | 增加公网攻击面和源站可见性 | Owner |
| G8 | 删除 route、Tunnel、DNS、VPS 或其他资源 | 不可逆删除、可能丢失证据 | Owner 最终确认 |

一个“继续”只授权当前明确阶段，不能自动跨过后续所有闸门。

## 统一结果分类

- **通过**：实际操作、成功状态、失败判断和结束状态与正文一致；
- **界面差异**：字段名称、入口或排序变化，但技术关系未变；
- **文档差异**：官方输出、时间或状态说明发生非实质变化；
- **技术纠错**：书中命令或事实不能按描述工作；
- **安全纠错**：正文可能扩大公开面、泄露凭证或造成错误删除；
- **安全停止**：继续可能影响非教学对象、凭证、数据或账户；
- **环境阻塞**：支付、实名、库存、网络、TLD、账户或平台限制无法继续。

技术纠错和安全纠错可以在证据充分时最小修订正文；其他差异先记入台账，由 Owner 决定是否修改表达或仿真。

## 阶段 0：资源清点，尚不产生费用

### 域名候选停止条件

候选域名必须同时满足：

- 由第三方注册商管理，可以修改 nameserver；
- 不承载网站、邮箱、重定向、API、验证记录或品牌业务；
- 注册邮箱可用，2FA 与恢复方式可控；
- 到期日、自动续费、首年价和续费价已记录；
- 当前 nameserver、全部 DNS 记录和 DNSSEC / DS 状态可导出；
- 不是 premium、争议、暂停、赎回或待验证状态。

无法证明“无业务”时，停止，不用它做实验。

### Cloudflare 账户停止条件

- 2FA 未启用或恢复方式不可用；
- 存在无法解释的管理员、成员或授权应用；
- 需要开通付费产品才能创建普通 Tunnel；
- 当前账户策略不允许添加个人实验域名。

### VPS 购买前条件

- 只使用 1 台 Ubuntu 24.04 LTS amd64 Shared CPU 实例；
- 选择独立公网 IPv4、SSH key 和仅允许当前可信 IPv4 `/32` 的 TCP 22；
- 自动备份、快照、Reserved IP 和 Block Storage 全部关闭；
- 最终摘要的地区、配置、数量、小时/月价与附加项全部可解释；
- 没有点击 Deploy 前，不记录实例为已创建。

阶段结束状态：只完成选择与记录，不改变 nameserver，不 Deploy。

## 阶段 1：建立第三册交接状态

Deploy 获准后，在隔离 VPS 上完成：

1. 两个独立 SSH 会话均可登录；
2. Ubuntu 24.04、amd64、内存、磁盘、时间和现有端口符合预期；
3. 使用 Docker 官方 APT 路径安装 Engine 与 Compose plugin；
4. 创建独立教学 Compose 项目；
5. Web service 只绑定 `127.0.0.1:8080`；
6. VPS 本机 curl 返回包含唯一校订标记的静态页；
7. 公网 `<LAB_IPV4>:8080` 不可访问；
8. 记录项目目录、镜像、端口、备份和恢复入口，不记录公网地址。

如果 VPS 已存在任何不明服务、容器、80/443/8080 监听、第二册节点或真实数据，停止并改用全新实例。

阶段结束状态：第三册交接基线正常；尚未安装 `cloudflared`，尚未开放 80/443。

脱敏执行结果（2026-08-22）：两次独立 SSH、系统与监听基线、Docker 官方 APT 安装、Compose 页面标记、回环绑定、公网 8080 不可达、备份与恢复比对均通过。版本和证据见 `field-validation-results.md`。

## 阶段 2：添加 zone 与迁移 nameserver

按第 2—4 章执行：

1. 再次导出旧 DNS、NS、SOA、DS 和业务基线；
2. 把根域名添加到 Cloudflare Free；
3. 把 Quick Scan 与旧 DNS 逐条比较，不信任自动扫描完整性；
4. 若已有 DS，先在注册商移除旧 DS，并至少等待一个完整 DS TTL；
5. 从两个公共解析器确认旧 DS 不再返回；
6. 在注册商只填入当前 zone 分配的 Cloudflare nameserver；
7. 等待公共 NS 查询一致且 Cloudflare zone 为 Active；
8. 核对 DNS 记录后，在 Cloudflare 启用 DNSSEC；
9. 按注册商方式提交或确认新 DS；
10. 从多个公共解析器确认 DNSSEC 链正常。

不能用“页面显示已保存”代替公共 DNS 查询。Cloudflare 当前官方资料强调：旧 DS 缓存未过期就切换 nameserver，验证型解析器可能返回 `SERVFAIL`。

阶段结束状态：zone 为 Active，DNSSEC 正常；没有 Web 公共主机名。

脱敏执行结果（2026-08-22）：Quick Scan 为 0 条，与切换前远程 DoH 空记录基线一致；只保留 1 条无业务含义的 TXT 教学记录。注册商 nameserver 修改成功，公共 NS 与 zone Active 均已确认。旧 DS 为空；Active 后启用 DNSSEC 并登记新 DS，Cloudflare 与 Google 公共解析器均验证 DS、DNSKEY 和教学 TXT 正常。Cloudflare 设置页在本次短时观察窗口内仍显示后台等待 DS，此界面延迟不改变公共验证结果，已作为非阻塞差异记录。真实域名、nameserver、DS 值和账户标识未进入仓库。

## 阶段 3：读懂记录并固定公开设计

按第 1、5、6 章人工与命令复核：

- NS、A、AAAA、CNAME、MX、TXT、DS 和 TTL 的输出与正文解释一致；
- Proxied 与 DNS only 的控制台语义准确；
- 唯一 Tunnel 主线固定为 `app.<LAB_DOMAIN> → http://127.0.0.1:8080`；
- SSH、数据库、3X-UI、第二册端口、Docker socket 和管理面板均不进入 route；
- 云防火墙仍只允许受信来源 SSH，没有 80/443/8080 公网规则；
- 第 6 章设计卡不包含真实 token、IP 或账户 ID。

阶段结束状态：只有设计，没有 Tunnel、route 或公开页面。

## 阶段 4：创建具名 Tunnel 与 connector

在 G4 获准后：

1. 在当前控制台 `Networking → Tunnels` 创建唯一教学 Tunnel；
2. 按当前控制台为 Ubuntu 选择 `Debian` 与 `64-bit`，并确认实际包仍对应 Linux amd64；
3. 从 Cloudflare 官方 APT 软件源安装 `cloudflared`；
4. 通过隐藏输入把 token 直接交给 `cloudflared service install`；
5. 清除 Shell 临时变量和不再需要的剪贴板内容；
6. 验证 `cloudflared` 为 `active`、`enabled`；
7. 验证控制台 connector 为 Healthy；
8. 检查日志与出站 TCP/UDP 7844，不新增公网入站 7844；
9. 扫描 Shell history、项目目录和仓库，确认没有 token。

`Healthy` 只证明 connector 与 Cloudflare 相连，不证明 DNS、route 或源站正常。

阶段结束状态：Tunnel 与 connector 正常；没有 published route。

脱敏执行结果（2026-08-23）：唯一教学 Tunnel 已创建；Ubuntu 24.04 amd64 通过 Cloudflare
官方 Noble APT 仓库安装 `cloudflared 2026.8.2`，隐藏 token 注册 systemd 服务后为
`active`、`running`、`enabled`。控制台显示“健康”、1 个 connector 和“无路由”；实际
QUIC 注册与 TCP 7844 可达性通过，未新增 80、443、8080 或 7844 入站监听。token 临时
文件、剪贴板和受控内存副本已清除，Shell history 与仓库未发现泄露。

## 阶段 5：创建 route 与验证 HTTPS

在 G5 获准后：

1. 创建 `app.<LAB_DOMAIN>` 的 published application route；
2. service 固定为 `http://127.0.0.1:8080`；
3. 核对 Cloudflare 自动创建的 CNAME 与 Tunnel 目标关系；
4. 从两个公共解析器查询主机名；
5. 等待 Universal SSL 正常，不使用 `curl -k`；
6. 从 macOS、手机网络和可用的第二种网络打开 HTTPS；
7. 核对证书主机名、响应状态和唯一教学标记；
8. 比较公开页面与 VPS 本机页面；
9. 确认公网 8080、80 和 443 仍未开放；
10. 记录实际签发等待、控制台名称和错误状态，但不记录真实主机名。

Cloudflare 当前官方资料说明 route 与 DNS 是相关但独立的对象。停止 Tunnel 不会自动删除 DNS；校订必须分别记录 route、CNAME、connector 与源站。

阶段结束状态：Tunnel HTTPS 主线完整可用，源站仍只监听回环地址。

脱敏执行进度（2026-08-23）：唯一 `app` published route 已创建，映射到
`http://127.0.0.1:8080`；控制台自动出现 Proxied CNAME，两个公共解析器返回
`NOERROR` 并带 DNSSEC 验证标志。Universal SSL 显示有效，HTTPS 为 200，证书链和
主机名验证通过；macOS Chrome / curl 与东京 VPS 第二网络均返回同一教学页。HTTP 实测
仍返回 200，符合正文“可能重定向，也可能继续返回 HTTP”的边界。VPS 公网
80/443/8080 仍不可直连。Owner 使用手机 5G 打开 HTTPS 后，页面标题与唯一教学标记
正确，未出现证书或隐私警告；阶段 5 完整通过。

## 阶段 6：安全与受控故障注入

每次只注入一个故障，保存变更前状态，并在下一项前完全恢复。

| 故障 | 预期观察 | 恢复条件 |
| --- | --- | --- |
| 停止 Compose service | connector 仍在线，公开请求出现源站类 502 或当前等价错误 | 启动 Compose，本机与外部均恢复 |
| 临时把 route 端口改错 | DNS 和 connector 正常，`cloudflared` 日志显示连接失败 | 恢复 `127.0.0.1:8080` |
| 停止 `cloudflared` | DNS 记录保留，公开请求出现 1016、1033 或当前产品等价状态 | 启动服务，connector Healthy，外部恢复 |
| 查询不存在的主机名 | 记录 `NXDOMAIN` 或经 DNSSEC 验证的 signed NODATA，不把零答案等同超时 | 不创建无关记录 |
| 暂时移除单一 `app` route | 外部入口消失或返回预期错误，本机服务和数据不变 | 按保存字段重建 route 并验证 |

错误码必须记录“实测值 + 当时官方定义”，不能为了匹配正文反复操作。不得注入错误 DS、删除整个 zone、关闭所有防火墙、删除 volume 或停止第二册服务。

阶段结束状态：所有故障均恢复，公开主线再次完整通过。

脱敏执行结果（2026-08-23）：停止 Compose service 与把 route 临时改为错误端口时，
connector 均保持在线，公开请求实测为 502；回环源站或正确端口恢复后，HTTPS 回到 200
且页面哈希一致。停止 `cloudflared` 时，源站仍为 200，两个公共 DoH 仍保留代理答案与
DNSSEC 验证；公开请求本次也返回 502，未强制复现 1016 或 1033。重新启动服务后，
systemd 为 active，控制台恢复单个 Healthy connector，HTTPS 回到 200。

查询不存在的教学主机名时，两个公共 DoH 返回 `NOERROR`、零 Answer、SOA / RRSIG /
NSEC 与验证成功标志，即 signed NODATA，而不是 NXDOMAIN。Cloudflare 的
[DNSSEC negative answer 实现](https://blog.cloudflare.com/black-lies/)允许出现这种结果；
校订只记录状态与答案数，不为匹配预期重复制造记录。

临时删除唯一 `app` route 时，确认框明确提示关联 CNAME 会删除；删除后两个公共 DoH
均为零 Answer，公网因无法解析而失败，回环源站仍为 200。按原 hostname、Tunnel 与
回环 Service URL 重建后，自动 DNS、DNSSEC 验证、第二网络 HTTPS 与页面哈希均恢复。

## 阶段 7：重启、更新预览与交接

在 G6 获准后：

1. 保存外部、本机、Compose、systemd 和 connector 基线；
2. 在维护窗口重启 VPS；
3. 验证 SSH、Docker、Compose、`cloudflared`、Tunnel 和 HTTPS 按顺序恢复；
4. 记录实际恢复时间，不写成所有环境的保证；
5. 运行 APT 更新预览，确认 `cloudflared` 使用官方源；
6. 若存在安全且可回退的实际更新，再单独确认后更新和重启服务；没有新版本时记录“no-op”，不人为降级制造升级；
7. 生成不含秘密的第四册交接卡；
8. 扫描交接卡、Shell history、仓库和日志摘录中的敏感模式。

阶段结束状态：主线可在重启后恢复，交接卡可供另一位维护者执行只读检查。

脱敏执行结果（2026-08-23）：VPS 确实进入不可 SSH 状态，23 秒后确认新 boot 并恢复
SSH；Docker、Compose、cloudflared、单个 Healthy connector、回环源站与第二网络 HTTPS
均自动恢复。公网仍只监听回环 8080，没有新增 80、443 或 7844 入站监听。APT 索引刷新
成功，cloudflared 继续使用官方 Noble 源，已安装版本与候选版本同为 `2026.8.2`；另有
5 个系统包只出现在更新预览中，本阶段没有安装。脱敏交接卡已保存为
`field-validation-handoff.md`。

## 阶段 8：Caddy 附录隔离验证

只使用 `caddy.<LAB_DOMAIN>`，不修改 `app` Tunnel route。

在 G7 获准后：

1. 确认 VPS 的 80/443 没有监听者；
2. 为 `caddy.<LAB_DOMAIN>` 创建指向 `<LAB_IPV4>` 的 DNS only A 记录；
3. 只为本阶段开放公网 TCP 80/443；
4. 使用 Caddy 官方稳定 APT 软件源安装软件包；
5. 配置 `caddy.<LAB_DOMAIN> { reverse_proxy 127.0.0.1:8080 }`；
6. `caddy validate` 通过后 reload；
7. 验证公共受信证书、HTTP 到 HTTPS 重定向和页面标记；
8. 将该记录切为 Proxied，并在 Cloudflare 使用 `Full (strict)`；
9. 验证 Cloudflare 到 Caddy 的严格 TLS 与公开页面；
10. 人工复核 Origin CA 浏览器信任边界，不为了制造错误替换已经正常的公共证书；
11. 删除 `caddy` DNS 记录、停止并移除 Caddy 公共配置；
12. 关闭公网 TCP 80/443；
13. 验证 `app` Tunnel 主线仍正常，公网 80/443/8080 均不可直连。

Origin CA 的“浏览器通常不直接信任”由官方资料校订即可。若要实测，必须另建独立主机名和回退方案，不把替换证书列为本轮 RC 必须动作。

阶段结束状态：Caddy 对照通过并完全收口，Tunnel 主线不受影响。

脱敏执行结果（2026-08-23）：实例实际绑定的 Vultr 防火墙组最初只允许 SSH，单独放行 UFW
不足以让 ACME 验证到达；临时补齐云侧与主机侧 TCP 80/443 后，多地探测恢复，Caddy
取得主机名匹配的公共受信证书，HTTP 到 HTTPS 重定向、反代正文与 `Full (strict)` 均通过。
结束时已恢复原 SSL 模式，删除 `caddy` DNS，停止并禁用 Caddy，清空公共配置，撤销 UFW
和 Vultr 的临时 80/443 规则；多地复核公网 80/443/8080 均不可达，`app` HTTPS 与回环
源站正文哈希一致。首次连接失败造成的 ACME 短时限流只作为本次环境结果记录，不写成固定等待时长。

## 阶段 9：清理与费用闭环

先保存脱敏证据并确认不再需要故障复现，然后按 G8 逐项确认：

1. 删除 `app` published route；
2. 单独核对并删除遗留的 `app` CNAME；
3. 卸载或停止 VPS 上的 `cloudflared` connector；
4. 确认 Tunnel 没有活动 connector 后删除教学 Tunnel；
5. 删除其他教学 DNS 记录；
6. 保留根 zone 和 DNSSEC，除非 Owner 明确决定把域名迁离 Cloudflare；
7. 如果迁离 Cloudflare，先按当前官方顺序处理 DS TTL，再改 nameserver，不能直接删除 zone；
8. 删除 VPS 前确认没有需要保留的交接或证据；
9. Destroy 实例并确认 Compute 列表为空；
10. 检查自动备份、快照、Reserved IP、Block Storage 和负载均衡均无残留；
11. 检查账单只有预期的域名与临时 VPS费用；
12. 私钥不再需要时从本机受控删除，公钥条目按用途清理。

脱敏执行结果（2026-08-23）：Owner 明确授权 G8 后，先删除唯一 `app` published route
及关联 CNAME，再删除教学 TXT；VPS 上的 cloudflared connector 已停止并卸载，确认无活动
connector 后输入教学 Tunnel 名称完成永久删除。Cloudflare DNS Records 无教学记录，两个
HTTPS 公共解析器对 `app`、`caddy` 和教学 TXT 均返回零答案，同时 DS、DNSKEY 与验证成功
标志继续有效；根 zone、nameserver 与 DNSSEC 按计划保留。

唯一临时 Vultr 实例随后 Destroy，Compute 列表为空；自动备份未启用，Block Storage、
Snapshots、Reserved IPs 与 Load Balancers 均为空。一个既有早期校订防火墙组已自动解绑，
当前不计费且不是本次新建对象，因此保留。实验 SSH 私钥、公钥、临时主机地址与独立
known-hosts 文件均按精确路径永久删除。临时 VPS 的小时消耗已经停止，域名续费责任不变。

域名是年度资产，不会随 VPS 销毁而停止续费。Owner 应决定保留、关闭自动续费或迁作后续图书校订用途。

## RC 通过条件

- 15 个内容单元都有“通过、差异、停止或阻塞”结论；
- 第 2—12 章主线至少在一个隔离环境连续完成；
- nameserver 与 DNSSEC 的顺序有公共解析器证据；
- Tunnel、route、DNS、connector、源站和 HTTPS 分层证据齐全；
- 受控故障全部恢复，没有残留公开 8080；
- Caddy 使用独立主机名，结束后 80/443 已关闭；
- 仓库和报告没有真实域名、IP、UUID、token、账户或支付信息；
- 所有技术与安全纠错均有台账，正文只做最小修订；
- production、Pagefind、完成状态和正式打印仍要在实机内容确认后单独启用；
- VPS 与附加资源完成费用闭环，或 Owner 明确记录继续保留的理由和责任人。

满足这些条件后，才能进入第四册正式 RC 综合验收。
