# 第五册 RC 实机校订结果台账

更新时间：2026-09-11

当前状态：第五册 15 个内容单元已获 Owner 确认；第五册 G1—G8 已通过；临时资源已永久清理

## 当前结论

2026-09-10 至 2026-09-11，第五册在一套隔离环境中完成固定 `v0.11.3`、回环源站、唯一管理员、
DeepSeek 单模型连接、Cloudflare Tunnel 公开路径、分层故障、备份恢复和永久退役验证。全部记录只保留
占位符、版本、状态、HTTP 类别和数量，不保存真实域名、IP、账户、实例、Tunnel、用户或凭证。

G8 已删除第五册教学 route 与自动 DNS、模型连接与专用 key、容器、network、两个精确 volume、
Secret、VPS 内外临时备份、connector、Tunnel、临时防火墙规则和 VPS。公共 DNS 为零答案，旧模型
key 返回 401，Vultr 附加资源清单为空。Cloudflare 根 zone、nameserver 与 DNSSEC 保留，方案仍为 Free。

模型最终用量为 2 次合成请求、97 tokens、费用低于 0.01 元，没有充值或订阅。VPS 已永久销毁，不再产生
持续计算费用；已发生的小时费与税费可能延迟出现在最终账单。

Cloudflare 当前费用为 0；G4—G5 共两次固定合成请求。

## 脱敏环境摘要

| 项目 | 现场结论 |
| --- | --- |
| 校订日期 | 2026-09-10 至 2026-09-11 |
| VPS | Ubuntu 24.04 LTS、amd64；1 vCPU、2 GB RAM、55 GB SSD；0.014 美元/小时基准；G8 已销毁 |
| Docker | Engine `29.8.0`；Compose `5.5.1`；Buildx `0.37.0` |
| Open WebUI | 固定 `v0.11.3`；RC 期间 healthy；G8 已删除应用对象与数据 |
| 应用端口 | RC 期间仅 `127.0.0.1:3000 -> 8080/tcp`；公网 80、443、3000 不可直达源站 |
| 管理员与用户 | 唯一已知管理员；signup 关闭；默认角色 `pending`；服务端用户对象已随 volume 删除 |
| 模型 | DeepSeek `deepseek-flash`（DeepSeek-V4.1-Flash）；专用 key 已撤销 |
| Tunnel | 第五册唯一 Tunnel 与单 connector；G8 已删除 |
| 公开入口 | RC 期间唯一 `https://chat.<LAB_DOMAIN>`；G8 已删除 route 与自动 DNS |
| 根域名边界 | 根 zone、nameserver、DNSSEC 与域名续费责任保留 |

## 闸门记录

| 闸门 | 状态 | 日期 | 脱敏结论 |
| --- | --- | --- | --- |
| G1 隔离 VPS、Docker、Tunnel / connector | 已授权 / 已通过 | 2026-09-10 | 单 VPS、单 Tunnel、单 connector；无 DNS / route |
| G2 固定镜像、回环 3000 与 named volume | 已授权 / 已通过 | 2026-09-10 | 固定版本、healthy、回环监听、Secret 与数据持久 |
| G3 首位管理员、认证与注册策略 | 已授权 / 已通过 | 2026-09-10 | 唯一管理员、signup 关闭、默认 `pending`、第一版权限收紧 |
| G4 模型连接与最小费用测试 | 已授权 / 已通过 | 2026-09-11 | 专用 key、单模型、合成 SSE、禁用与恢复通过 |
| G5 公开 route 与多网络验证 | 已授权 / 已通过 | 2026-09-11 | HTTPS、Cookie、WebSocket / SSE、桌面与手机通过 |
| G6 故障注入与恢复 | 已授权 / 已通过 | 2026-09-11 | 应用、route、connector、模型 ID 与 CORS 单变量故障均恢复 |
| G7 备份、隔离恢复与更新边界 | 已授权 / 已通过 | 2026-09-11 | 停写备份、hash、VPS 外副本与同版本恢复通过；跨版本不覆盖 |
| G8 永久清理与费用闭环 | 已授权 / 已通过 | 2026-09-11 | 全部第五册临时对象精确删除；保留根 zone 与 DNSSEC |

## 逐阶段结果

| 阶段 | 对应内容 | 结果 | 关键证据或边界 |
| ---: | --- | --- | --- |
| 0 | 资源、费用与风险 | 通过 | Cloudflare Free；单台临时 VPS；无付费附加项；停止实例仍计费的边界已记录 |
| 1 | 开始之前、第 1—3 章 | 通过 | 官方 Docker；单 Healthy connector；出站 7844；无公开应用端口或 route |
| 2 | 第 4 章 | 通过 | 固定 `v0.11.3`；回环 3000；persistent volume / Secret；公网不可达 |
| 3 | 第 5 章 | 通过 | 唯一管理员；signup 关闭；错误密码与重复注册拒绝；重建后策略保持 |
| 4 | 第 6 章 | 通过 | `deepseek-flash` 单模型；一次 G4 合成请求；连接禁用 / 恢复不追加请求 |
| 5 | 第 7—9 章 | 通过 | 唯一 route；Universal SSL；Secure Cookie；桌面、手机蜂窝、WS / SSE |
| 6 | 第 11 章 | 通过 | 应用停机 502、错误 route 500、connector 停机 530、错误 CORS 的 WS 500，恢复后 200 |
| 7 | 第 10 章 | 通过 | 停写归档、SHA-256、VPS 外副本、回环 3100 同版本隔离恢复；跨版本环境不覆盖 |
| 8 | 第 12 章、附录、资料来源 | 通过 | route、key、数据、备份、Tunnel、VPS 与附加资源全部清理 |

## 关键事实实测

| 事实 | 实际观察 | 判定 |
| --- | --- | --- |
| zone 与 DNSSEC | Free zone 保持 Active；根 zone、nameserver 与公共 DNSSEC 链未改动 | 通过 |
| 初始主机名 | G1 时 DNS 与 published route 均为 0 | 通过 |
| VPS 费用与附加项 | 单台共享实例，0.014 美元/小时、10 美元/月基准加适用税费；无自动备份或附加资源 | 通过 |
| Docker 与 connector | 官方 APT；`cloudflared 2026.9.0`；systemd enabled / active；TCP 7844 与 QUIC 注册成功 | 通过 |
| 固定镜像 | 官方 latest stable 与 release 均为 `v0.11.3`；Compose 未使用滚动标签 | 通过 |
| 回环 3000 | 只有 `127.0.0.1:3000 -> 8080/tcp`；公网 80、443、3000 不能直达源站 | 通过 |
| named volume 与 Secret | 精确 volume；项目目录 700、文件 600；重建后数据库与 Secret hash 一致 | 通过 |
| 管理员与注册 | 用户总数 1；唯一 admin；signup false；默认 `pending`；错误登录 400、重复注册 403 | 通过 |
| 第一版权限 | API key、上传、分享、语音、调用、多模型、Web Search、图像、代码解释器、Memories 与直接工具服务器关闭 | 通过 |
| 模型 allowlist | 关闭内置 Arena 后模型列表恰好只有 `deepseek-flash` | 通过 |
| 模型调用 | G4、G5 各一条固定合成短提示；最终 2 次请求、97 tokens、费用低于 0.01 元 | 通过 |
| 公开路径 | 唯一 route 与自动 Proxied DNS；TLS 主机名、首页、版本接口、Cookie、CORS、WS / SSE、桌面与手机通过 | 通过 |
| 应用停止 | 本机 health 失败，公开端实际为 502；恢复后本机与公开端均 200 | 通过 |
| 错误 route | 指向未监听回环端口时 connector 仍 Healthy，公开端实际为 500；恢复后 200 | 通过；错误码不是固定 502 |
| connector 停止 | systemd inactive，DNS 仍存在，公开端实际为 530；恢复 enabled / active、Healthy 与 200 | 通过；现场未显示 1033 |
| 错误模型 ID | 明确不存在的 ID 返回支持列表与传入模型不一致；恢复后只有正确模型；未增加提供方用量 | 通过 |
| 401 / 403、429、timeout | 没有独立无效测试 key、官方 sandbox、低额度 key 或安全 timeout endpoint | 环境不覆盖 |
| CORS / WebSocket | 错误 Origin 配置时 WebSocket 路径实际为 500 且无允许头；恢复后 Socket.IO polling 200 | 通过 |
| 备份与 hash | 停止写入后归档 volume、Compose 与 `.env`，生成 SHA-256 manifest；复制到 VPS 外并核对 hash | 通过 |
| 隔离恢复 | 同版本、精确测试 volume、回环 3100；数据库 hash 一致；1 admin、4 条合成聊天、345 项配置与连接占位一致；没有模型调用 | 通过 |
| 更新与 migration | 校订时没有比 `v0.11.3` 更新的稳定版，不安装旧版或预发布版制造 migration | 环境不覆盖 |
| 公开入口清理 | route 删除时自动 DNS 一并删除；两个公共解析器均为 `NOERROR` 零 A / AAAA；HTTPS 不可达 | 通过 |
| 模型凭证清理 | Open WebUI 连接配置离线清除；专用 key 撤销；旧 key 的 `/models` 探针返回 401 | 通过 |
| 数据清理 | 应用停止；容器、network、生产 / 测试 volume、`.env`、Secret 与 VPS 内外备份精确删除 | 通过 |
| 计算清理 | connector 卸载、Tunnel 删除、临时防火墙规则删除、VPS 销毁 | 通过 |
| 附加资源清理 | Block Storage、Snapshot、Reserved IP 与 Load Balancer 清单为空 | 通过 |

## 现场差异与正文处理

| 发现 | 分类 | 处理 |
| --- | --- | --- |
| 目标区域目标规格无库存，改用同属亚洲的可用区域 | 界面 / 环境差异 | 正文要求按库存选择近邻地区，不写死单次地区 |
| cloudflared 官方安装最终使用 root-only token 文件 | 文档 / 安全差异 | 正文强调凭证不进入 Compose、命令历史或公开日志 |
| 固定镜像本机约 6.65 GB，2 GB VPS healthy 时内存样本约 823 MiB | 环境差异 | 正文把数字标为现场样本并要求预留空间 |
| 浏览器自动化不适合搬运管理员秘密 | 安全边界 | 首次初始化保持 SSH 本地转发与密码管理器主体边界 |
| `deepseek-flash` 是当日正式 ID；旧名称只作兼容路由 | 文档差异 | 正文、事实台账和 allowlist 使用正式 ID |
| DeepSeek 没有逐 key scope / hard cap | 费用 / 安全边界 | 专用可撤销 key、单模型 allowlist、4 元停发线、5 元硬上限 |
| Open WebUI 内置 Arena 会额外显示模型 | 界面差异 | 关闭 Arena 后验收单模型基线 |
| `WEBUI_URL` 管理员 ConfigVar 可覆盖环境变量 | 安全纠错 | 同时核对 Compose 环境和数据库保存值 |
| G6 现场错误码为 502、500、530、500，不完全等于文档示例 | 技术边界 | 正文用“或等价错误”，排错先识别失败层而非死记错误码 |
| `v0.11.3` 仍是最新稳定版 | 环境不覆盖 | 完成同版本备份恢复，不人为制造跨版本 migration |

## 敏感信息检查

- [x] 仓库没有真实域名、公开主机名、公网 IP、nameserver 或 DS 具体值；
- [x] 没有账户、zone、实例、Tunnel、connector、用户或账单 ID；
- [x] 没有 SSH key、Tunnel token、模型 API key、Secret、密码、Cookie、Authorization 或验证码；
- [x] 没有管理员邮箱、真实聊天、附件、账单、余额、订单或身份信息；
- [x] 日志只保留错误类别、HTTP 状态、版本、数量和必要脱敏时间线；
- [x] 原始控制台截图没有进入仓库；
- [x] 本机临时剪贴板、SSH 控制 socket 与 VPS 外临时备份已清理；
- [x] 仓库敏感模式扫描结果将随 RC 综合验收复核。

## 清理与费用闭环

| 对象 | 最终状态 | 最终证据 |
| --- | --- | --- |
| `chat` route / DNS | 已删除 | route 列表 0；公共解析器零 A / AAAA；HTTPS 不可达 |
| 模型连接 | 已删除 | 数据库连接配置离线清除后再删除 volume |
| 模型专用 key | 已撤销 | key 列表减少一项；旧 key 探针返回 `401` |
| Open WebUI 管理员 | 服务端对象已删除 | 精确生产 volume 已删除；本机密码管理器如有记录已失去服务端对象，由 Owner 管理 |
| 容器 / network | 已删除 | 精确 Compose 对象不存在 |
| 生产 / 恢复测试 volume | 已删除 | 两个精确名称均不存在 |
| `.env` / Secret | 已删除 | 远端项目目录与凭证目录清理 |
| VPS 内外备份 | 已删除 | 远端与本机临时目录均清理 |
| connector / Tunnel | 已删除 | systemd 服务卸载；Tunnel 列表无第五册对象 |
| VPS 实例 | 已永久销毁 | 实例列表无第五册对象；持续计算计费停止 |
| 临时防火墙规则 | 已删除 | G7 HTTPS / 443 与临时 SSH / 22 规则均为 0；既有非第五册规则保留 |
| 付费附加资源 | 未创建 / 清单为空 | Snapshot、Block Storage、Reserved IP、Load Balancer 均无第五册对象 |
| Cloudflare 付费产品 | 未启用 | Free 方案保持 |
| 模型调用费用 | 闭环 | 2 次请求、97 tokens、低于 0.01 元；未充值或订阅 |
| VPS 费用 | 持续费用已停止 | 实例已销毁；最终已发生小时费 / 税费账单行可能延迟出现 |
| 根 zone / nameserver / DNSSEC | 保留 | 不属于第五册临时资源清理 |

## 最终结论

第五册 G1—G8 已完整通过。受控实机证明了固定版本、回环监听、数据持久、认证收紧、单模型连接、
公开 HTTPS、多网络、分层故障恢复、同版本备份恢复以及可核对的永久退役。没有未知第五册 route、
Tunnel、模型 key、volume、VPS 或计费附加资源继续运行；根 zone 与 DNSSEC 按范围保留。

本结论只覆盖校订日期与所选环境。429、上游 timeout、普通用户 / 分享 UI、跨版本 migration、
管理员密码与 Secret 轮换、Ollama 路径继续明确标为环境未覆盖。完成实机并不自动等于已发布；
production、Pagefind、正式打印、PDF、跨浏览器、性能、安全和线上冒烟检查由独立 RC 综合验收记录。
