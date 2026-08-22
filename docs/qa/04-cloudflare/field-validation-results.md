# 第四册 RC 实机校订结果台账

建立日期：2026-08-12

状态：G1—G8 已脱敏确认并执行且阶段 1—9 通过；route、教学 DNS、connector、Tunnel、临时 VPS 与计费附加资源均已完成永久清理；Owner 已授权进入 `1.0.0-rc.1` 综合验收

执行方案：`field-validation-runbook.md`

## 环境摘要

只填写不具识别性的概括值：

| 项目 | 实际值 |
| --- | --- |
| 执行日期与时区 | 2026-08-22—2026-08-23；Asia/Shanghai |
| 注册商类型 | 境内第三方注册商；不写账户或真实域名 |
| 域名用途 | Owner 已确认是独立教学域名，不承载业务 |
| Cloudflare 方案 | Free / Active；DNSSEC 公共验证正常 |
| VPS 服务商与地区 | Vultr；东京；G8 已销毁，不写实例 ID 或公网 IP |
| Ubuntu 与架构 | Ubuntu 24.04.4 LTS；amd64 |
| 资源 | 1 vCPU、1 GiB 内存、25 GB 套餐磁盘 |
| Docker / Compose | Docker Engine 29.7.2；Compose v5.5.0；Buildx 0.36.1 |
| cloudflared | 2026.8.2；Cloudflare 官方 Noble APT；G8 已停止并卸载 connector，实例随后销毁 |
| Caddy | 2.11.4；官方稳定 APT；G7 已收口，G8 随临时实例销毁 |
| 验证人 | 项目 Owner 授权的校订会话 |

## 闸门记录

| 闸门 | 状态 | Owner 确认时间 | 脱敏备注 |
| --- | --- | --- | --- |
| G1 域名 | 已确认 | 2026-08-22 22:19 +08:00 | 既有 `.cn` 域名；Owner 确认可管理 NS / DNSSEC 且无业务；未修改外部状态 |
| G2 VPS Deploy | 已确认并执行 | 2026-08-22 22:41 +08:00 | 单台 Shared CPU、东京、Ubuntu 24.04 x64、1 vCPU / 1 GiB / 25 GB、Public IPv4；自动备份与其他可见付费附加项未启用 |
| G3 nameserver / DS | 已确认并执行 | 2026-08-22 23:28 +08:00 | Quick Scan 为 0 条；添加 1 条无业务含义的 TXT 教学记录；无旧 DS，注册商 NS 已改为本 zone 分配值；zone Active 后登记新 DS；两个公共解析器均验证通过 |
| G4 Tunnel token 安装 | 已确认并执行 | 2026-08-23 +08:00 | 唯一教学 Tunnel；隐藏 token 安装单个 connector；控制台“健康”、1 个 connector、“无路由”；未启用付费产品 |
| G5 published route | 已确认并执行 | 2026-08-23 +08:00 | 唯一 `app` route；自动 Proxied CNAME、Universal SSL、macOS、第二网络与手机 5G HTTPS 通过；未启用付费产品 |
| G6 重启与故障注入 | 已确认并执行 | 2026-08-23 +08:00 | 源站、错误端口、connector、单 route 下线与 VPS 重启均已验证并恢复；未启用付费产品或安装系统更新 |
| G7 Caddy 80/443 | 已确认并执行 | 2026-08-23 +08:00 | 独立 `caddy` 主机名、DNS only、公共证书、HTTP 308、Proxied、`Full (strict)` 均通过；临时 DNS、Caddy 公共配置、UFW 与 Vultr 80/443 规则已全部收口 |
| G8 清理与永久删除 | 已确认并执行 | 2026-08-23 +08:00 | 删除 `app` route、关联 DNS、教学 TXT、connector、Tunnel 与临时 VPS；计费附加资源均为空，保留根 zone、nameserver、DNSSEC 与既有不计费防火墙组 |

## 逐阶段结果

| 阶段 | 对应内容 | 开始状态 | 必验项目 | 结束状态 | 结果 | 正文差异 |
| ---: | --- | --- | --- | --- | --- | --- |
| 0 | 资源与风险 | 无外部变更 | 域名无业务、账户安全、VPS 摘要、费用与附加项 | 域名与单台 VPS 已选 | 通过；G1、G2 已确认 | — |
| 1 | 第三册交接 | 新 VPS | SSH、Docker、Compose、回环 8080、公网不可达 | 本机服务正常；未装 cloudflared / Caddy；80/443 无监听 | 通过 | 无正文修改 |
| 2 | 第 2—4 章 | 旧 DNS 已导出 | zone、Quick Scan、旧 DS、nameserver、Active、新 DNSSEC | Cloudflare 权威 DNS 正常；只有 1 条 TXT 教学记录，没有 Web 公共主机名 | 通过 | 无正文修改 |
| 3 | 第 1、5、6 章 | zone Active | DNS 类型、代理状态、唯一公开设计与禁止公开清单 | 只有设计卡 | 通过；G4 前再次核对 | 无正文修改 |
| 4 | 第 7 章 | 无 cloudflared | 官方 APT、隐藏 token、systemd、Healthy、7844 出站 | connector 正常，无 route | 通过 | 按现场控制台把 Ubuntu 的选择项校订为 `Debian` / `64-bit`，补充中文“健康”状态 |
| 5 | 第 8—9 章 | connector 正常 | route、CNAME、Universal SSL、HTTPS、本机与外部一致 | Tunnel 主线正常；桌面、第二网络与手机 5G 均通过 | 通过 | 无正文修改；HTTP 返回 200 已被现有正文覆盖 |
| 6 | 第 10—11 章 | 主线正常 | 公开边界、502、1016/1033、错误端口、单 route 下线恢复 | 所有故障恢复；唯一 route 与自动 DNS 重建 | 通过 | 无正文修改；现有正文已把错误码与控制台联动写成条件结果 |
| 7 | 第 12 章 | 主线正常 | VPS 重启、更新预览、交接卡、敏感模式扫描 | SSH、服务、Tunnel 与 HTTPS 自动恢复；交接卡可用 | 通过 | 无正文修改；更新预览没有实际安装软件包 |
| 8 | 附录 | app 主线正常 | 独立 caddy 主机名、80/443、公共证书、Proxied、Full strict、完整收口 | app 正常；caddy DNS 已删除；公网 80/443/8080 均不可达 | 通过 | 无正文修改；现有附录已明确云防火墙与主机防火墙必须同时放行 |
| 9 | 资料与清理 | 证据已保存 | route、DNS、connector、Tunnel、VPS、附加资源与账单 | 教学入口和临时计算资源均已删除；根 zone 与 DNSSEC 保留 | 通过 | 无正文修改；本机 SSH 密钥与受控临时文件已永久删除 |

## 关键事实实测

| 事实 | 预期 | 实际 | 判定 |
| --- | --- | --- | --- |
| 旧 DNS 业务基线 | 没有网站、邮箱、验证或教学主机名 | Owner 确认无业务；远程 DoH 未发现根 A / AAAA / MX / TXT / CAA，`www`、`app`、`caddy` 均无有效记录 | G1 通过 |
| 本地 DNS 观察边界 | 不把代理 Fake-IP 当作权威记录 | 本地查询受到 `198.18.0.0/15` Fake-IP 映射；后续固定使用远程 DoH、公共解析器和 VPS 交叉验证 | 已记录 |
| SSH 与主机身份 | 两个独立会话可登录，临时信任文件与服务器内部主机密钥一致 | 两次独立 root SSH 会话成功；ED25519 指纹交叉一致；没有改动用户常用 `known_hosts` | 阶段 1 通过 |
| 新机监听基线 | 只有 SSH；无未知容器、Web 或 Tunnel 服务 | 初始状态无 Docker / Podman、Nginx、Caddy、cloudflared；80/443/8080 均无监听 | 阶段 1 通过 |
| Docker 官方安装路径 | Engine、Compose plugin 与 Buildx 可用 | 官方 Ubuntu APT 仓库安装成功；`hello-world` 实际运行通过 | 阶段 1 通过 |
| 第三册 Compose 交接 | 固定项目、只读挂载、回环 8080、受限日志 | `book03-compose-demo` 运行；页面唯一标记可读；bind mount 为只读；restart 与 local 日志限制符合交接卡 | 阶段 1 通过 |
| 公网 8080 | 始终不可直连 | VPS 公网接口自检与当前客户端绕过 HTTP 代理直连均失败；主机只监听 `127.0.0.1:8080` | 阶段 1 通过 |
| 备份与恢复入口 | 有脱敏交接卡、备份和可验证恢复路径 | 项目备份已生成；临时解压后配置与页面逐文件比对通过；交接卡不含域名、IP 或凭证 | 阶段 1 通过 |
| Quick Scan 完整性 | 不能代替旧 DNS 导出 | Quick Scan 返回 0 条，与切换前远程 DoH 空记录基线一致；随后只添加 1 条无业务含义的 TXT 教学记录 | 通过；仍保留“扫描不能代替导出”的正文口径 |
| nameserver 激活 | 以公共 NS 与 Active 为准 | 注册商保存后，公共解析器返回本 zone 分配的两台 Cloudflare NS，随后控制台显示 zone Active | 通过 |
| DNSSEC 顺序 | 旧 DS TTL 结束后再改 NS | 切换前确认公共 DS 为空，按“无旧 DS”分支迁移；zone Active 后在 Cloudflare 启用 DNSSEC，并在注册商登记新 DS；Cloudflare 与 Google 公共解析器均返回 DS、DNSKEY 和教学 TXT，验证标志正常 | 通过 |
| Proxied 返回 | 返回 Cloudflare 地址，不直接显示源站 | 两个公共解析器均返回 `NOERROR`、Cloudflare 代理地址和 DNSSEC 验证标志；没有返回 VPS 公网地址 | G5 技术验证通过 |
| Tunnel token | 不进入历史、日志摘录和仓库 | 通过原生复制控件取得后，经 0600 临时文件和 SSH 标准输入交给指定 VPS；安装后清除剪贴板、临时文件与受控内存；Shell history 和仓库扫描无匹配 | G4 通过 |
| Healthy 含义 | 只证明 connector 连接 | 控制台显示“健康”、1 个 connector 和“无路由”；systemd 为 active / running / enabled；没有据此声称 route 或源站已公开 | G4 通过 |
| route 自动 DNS | 创建 route 时建立关联 CNAME | route 保存后 DNS Records 自动出现同名 Proxied CNAME；Tunnel Routes 同时保留相同主机名与回环 Service URL；未复制或记录敏感 Tunnel 目标值 | G5 技术验证通过 |
| connector 停止 | DNS 保留，观察实际错误码 | systemd 为 inactive 时，源站仍为 200，两个公共 DoH 仍有代理答案与 DNSSEC 验证标志；公开请求实测 502，未出现 1016 / 1033；启动后 systemd active、控制台单个 connector Healthy、HTTPS 200 | G6 通过；官方 1033 仍表示没有健康 connector，本次不把错误码写成必然 |
| 源站停止 | connector 在线，观察 502 或等价错误 | Compose 停止后回环 8080 不可达、connector 仍 active，公开请求为 502；恢复后回环与公开均为 200，页面哈希一致 | G6 通过；符合官方 Tunnel 源站不可达边界 |
| route 错误端口 | DNS、connector 正常，日志出现连接失败 | 临时改为未监听端口后公开请求为 502；cloudflared 日志同时记录错误端口、connection refused 与 origin unreachable；恢复回环 8080 后 HTTPS 200 | G6 通过 |
| 不存在主机名 | 记录负响应，不创建无关 DNS | Cloudflare 与 Google DoH 均返回 `NOERROR`、零 Answer、SOA / RRSIG / NSEC 与 DNSSEC 验证成功标志，即 signed NODATA | G6 通过；runbook 不再把 NXDOMAIN 写成唯一成功结果 |
| Universal SSL | 主机名匹配且无需关闭验证 | 控制台 Universal SSL 显示有效；macOS curl 与 Chrome 均为 HTTPS 200，证书链和主机名验证通过；Owner 使用手机 5G 打开同一教学页且无证书或隐私警告；未使用 `-k` 完成验收 | G5 通过 |
| VPS 重启恢复 | Docker、Compose、cloudflared 和 HTTPS 恢复 | 观察到 SSH 中断；23 秒后确认新 boot，Docker、Compose、cloudflared、单个 Healthy connector、回环源站与第二网络 HTTPS 均恢复；只有回环 8080 监听 | G6 / 阶段 7 通过；恢复时间只代表本次环境 |
| APT 更新预览 | cloudflared 使用官方源，不人为降级 | APT 索引刷新成功；官方 Noble 源正常；已安装与候选版本均为 `2026.8.2`；另有 5 个系统包仅预览，未安装 | 阶段 7 通过；cloudflared 无更新 |
| route 移除 | 本机数据保留，记录 CNAME 实际行为 | 删除确认框明确提示关联 CNAME 会删除；删除后两个公共 DoH 为零 Answer，公网无法解析，回环源站仍为 200；按原字段重建后自动 DNS、DNSSEC 验证与第二网络 HTTPS 200 恢复 | G6 通过；本次联动结果不扩展为永久产品保证 |
| Caddy 自动 HTTPS | DNS、80/443 与证书均正常 | DNS only A 记录由两个公共解析器返回唯一源站地址且 DNSSEC 验证正常；云侧与 UFW 同时放行后，多地 TCP 80 恢复可达；Caddy 2.11.4 取得 Let’s Encrypt 公共证书，主机名匹配，有效期覆盖本次校订；HTTP 308、HTTPS 200、反代正文哈希一致 | G7 通过；首次云防火墙遗漏导致 ACME connection timeout，随后触发短时 failed-authorization 限流，等待返回窗口后成功，不把本次时间写成固定值 |
| Full (strict) | Proxied 后严格验证源站证书 | `caddy` 记录切为 Proxied 后，两个公共解析器只返回 Cloudflare 边缘地址且不返回源站地址；临时切换 `Full (strict)`，经 Cloudflare 边缘请求返回 Caddy 专用探针 200，根页面与 `app` 主线哈希一致；随后恢复原 `Full` 模式 | G7 通过；没有用 Flexible 或关闭证书验证绕过问题 |
| Caddy 收口 | DNS 删除，80/443 关闭，app 不受影响 | 删除 `caddy` DNS 后两个公共解析器均为零 A 答案且 DNSSEC 验证正常；Caddy inactive / disabled、公共配置为空、80/443 无监听，UFW 与 Vultr 临时规则均删除；5 个外部节点对 80/443/8080 的探测均为 0 个连接成功；`app` HTTPS 200 且与回环源站哈希一致 | G7 通过；Vultr 防火墙组只保留既有 SSH 22 与默认丢弃规则 |
| G8 Cloudflare 清理 | 删除公开入口但保留根 zone 与 DNSSEC | 删除唯一 `app` route 及关联 CNAME、教学 TXT、connector 与教学 Tunnel；控制台无教学 route、DNS 或 Tunnel；Cloudflare 与 Google HTTPS 公共解析器对 `app`、`caddy` 和教学 TXT 均为零答案，同时 DS、DNSKEY 与验证成功标志继续有效 | G8 通过；域名仍在 Cloudflare Free，未迁移 nameserver 或删除 DNSSEC |
| G8 Vultr 费用闭环 | 销毁临时实例且无计费附加资源 | 唯一实例已 Destroy，Compute 列表为空；自动备份未启用，Block Storage、Snapshots、Reserved IPs 与 Load Balancers 均为空；本次按小时计算的实例不再持续消耗 | G8 通过；既有早期校订防火墙组已解绑且不计费，因此保留 |
| G8 本机材料清理 | 不保留失效访问凭证或真实值临时文件 | 本次实验 SSH 私钥、公钥、临时主机地址与独立 known-hosts 文件均已按精确路径永久删除；仓库真实域名、公开主机名与公网 IP 精确扫描均为 0 | G8 通过；删除材料不可恢复 |

## 差异与修订

| 章节 / 锚点 | 现场发现 | 分类 | 建议处理 | Owner 决定 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 第 4 章 / 启用 DNSSEC | 注册商保存 DS 后，两个公共解析器已返回有效 DS、DNSKEY 和教学 TXT，且验证标志正常；Cloudflare 设置页在本次短时观察窗口内仍显示“等待 DS” | 界面状态延迟 | 继续以公共 DNS 验证作为技术验收依据，不把控制台延迟写成固定时长；现有正文已经要求等待并使用多个公共解析器复核 | 暂不修改正文 | 已记录，非阻塞 |
| 第 7 章 / 设置环境与 Tunnel 状态 | 当前中文控制台为 Ubuntu 安装显示 `Debian`、`64-bit`，列表状态显示“健康”，并明确显示“无路由” | 界面差异 | 把正文选择项改为当前实测标签，解释 Ubuntu 使用 Debian 系 `.deb` 包；保留 Healthy 技术含义并补充中文标签 | 按实测最小修订 | 已完成 |
| 第 9 章 / HTTP 实际行为 | HTTPS 已正常时，未加密 HTTP 实测仍返回 200，没有自动跳转 | 环境结果 | 保留“可能重定向，也可能仍返回 HTTP”的现有正文，不顺手启用全局重定向规则 | 无需修改 | 已记录 |
| 第 11 章 / connector 故障错误码 | 停止单个 connector 时，DNS 与源站保持正常，但公开请求本次返回 502，没有出现 1033 或 1016 | 环境结果 | 保留官方 1033、1016 与 502 的分层定义；不把单次返回码写成所有环境的保证 | 无需修改正文 | 已记录 |
| Runbook / 不存在主机名 | 两个公共 DoH 对不存在主机名返回经 DNSSEC 验证的 signed NODATA，而不是 NXDOMAIN | DNSSEC negative answer 差异 | 把 runbook 成功条件改为记录 NXDOMAIN 或 signed NODATA，并区分零答案、超时和解析失败 | 最小修订执行方案 | 已完成 |
| 第 12 章 / route 临时下线 | 本次删除确认框明确说明关联 CNAME 会删除，实际公共 DoH 随后为零 Answer；重建 route 后自动 DNS 恢复 | 界面与环境结果 | 保留正文“以当次确认框和 Records 实际结果为准”的口径，不写成永久联动 | 无需修改正文 | 已记录 |
| 附录 / Caddy 公网可达 | 实例绑定的 Vultr 防火墙组最初只允许 SSH；虽然 UFW 已允许 80/443，ACME 与多地 TCP 探测仍超时；补齐云侧两条临时规则后恢复可达 | 环境结果 | 现有附录已经把“云防火墙和主机防火墙同时允许 80/443”列为停止条件，无需重复扩写正文 | 无需修改正文 | 已记录 |
| 附录 / ACME 重试 | 公网入口修复前的失败授权触发 Let’s Encrypt 短时限流；停止连续重启并等待返回的重试窗口后签发成功 | 环境结果 | 不写死本次等待时间；保留证书签发失败与日志检查边界，实机台账记录具体类别 | 无需修改正文 | 已记录 |

只有具有实际证据的差异才能进入本表。不得因为单次等待时间、账户风控或界面排列不同，就把局部结果改写成所有用户的固定结论。

## 敏感信息检查

- [x] 仓库没有真实域名、主机名和公网 IP；
- [x] 没有 Tunnel UUID、connector ID、zone ID 或账户 ID；
- [x] 没有 token、API key、SSH 私钥、公钥全文或密码；
- [x] 没有 2FA、恢复码、Cookie、支付或 WHOIS 联系信息；
- [x] 日志只保留错误类型、状态、版本和必要时间，不含完整请求或账户上下文；
- [x] 截图只用于当前受控核对，未脱敏原图不进入仓库；
- [x] 脱敏交接卡只含占位符、只读巡检命令和责任边界；
- [x] 本阶段没有创建需要保留的 `output/` 原始证据。

## 清理与费用闭环

| 对象 | 最终状态 | 证据 |
| --- | --- | --- |
| `app` route | 已永久删除 | Tunnel Routes 已无 published application |
| `app` CNAME | 已随 route 删除 | DNS Records 无该记录；两个 HTTPS 公共解析器均为零答案且 DNSSEC 验证正常 |
| `caddy` DNS 记录 | 已删除 | Cloudflare 与 Google 公共解析器均为零 A 答案，DNSSEC 验证标志正常 |
| 教学 TXT | 已删除 | DNS Records 无该记录；两个 HTTPS 公共解析器均为零答案且 DNSSEC 验证正常 |
| cloudflared connector | 已停止并卸载 | 删除 Tunnel 前已确认 systemd inactive、unit 不存在且无 connector 进程 |
| 教学 Tunnel | 已永久删除 | 控制台列表无该 Tunnel，创建入口恢复可用 |
| 公网 TCP 80/443 | 已在 G7 短时开放并完全关闭 | Caddy 无监听；UFW 与 Vultr 临时规则均删除；5 个外部节点均为 0 个连接成功 |
| 公网 TCP 8080 | 关闭 | 双路径直连失败；主机仅回环监听 |
| VPS 实例 | 已永久销毁，不再持续按小时消耗 | Compute 列表为空 |
| 自动备份 | 未启用，无残留 | 实例详情与 Backups 清单复核 |
| 快照 | 无残留 | Snapshots 清单为空 |
| Reserved IP | 无残留 | Reserved IPs 清单为空 |
| Block Storage | 无残留 | Block Storage 清单为空 |
| Load Balancer | 无残留 | Load Balancers 清单为空 |
| Vultr 防火墙组 | 保留 1 个既有、未绑定且不计费的早期校订资源 | 实例销毁后 Attached Instances 为 0；规则说明证明不是本次 G7 新建对象 |
| 其他付费 Cloudflare 产品 | Free zone；未启用付费产品 | zone 概述显示 Free，G3 未进入付费配置 |
| 域名续费责任 | Owner 保留；校订后继续留在 Cloudflare 或迁回原 DNS 待最终决定 | G1 确认 |

## 最终结论

当前结论：**G1—G8 与阶段 1—9 已通过，第四册 RC 实机校订完成；这不等于已经发布。**

- 15 个内容单元均已获得对应阶段的“通过、差异或无需修改”结论；
- nameserver、DNSSEC、Tunnel HTTPS、故障恢复、Caddy 对照与永久清理主线连续通过；
- 正文只按实测最小修订第 7 章的当前控制台标签，其他错误码、HTTP、DNSSEC 与 ACME 差异保留在台账中；
- 账户风控、控制台排列、单次错误码与等待时间不扩展为所有读者的固定结果；
- 无未恢复的公开入口、VPS 或计费附加资源；域名续费责任、Free zone、nameserver、DNSSEC 与一个不计费的既有防火墙组继续保留；
- 第四册已进入 production、Pagefind、完成状态、正式打印、PDF、跨浏览器与 RC 综合验收；发布结果见 `release-candidate.md`。
