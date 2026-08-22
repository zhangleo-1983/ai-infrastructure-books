# 第四册技术事实校订台账

建立日期：2026-08-11

当前范围：15 个完整 draft 内容单元所需事实；正式来源分组见第四册 `sources.mdx`，本台账用于追踪写作结论与待实机边界

## 当前校订记录

| 事实 | 对应内容 | 校订结论 | 官方来源 | 状态 |
| --- | --- | --- | --- | --- |
| published application route | 第 8 章 | 公开主机名可以映射到本地 HTTP 服务，例如 `app.example.com` 到 `http://localhost:8080` | [Routing](https://developers.cloudflare.com/tunnel/routing/) | 已核对 |
| full DNS 自动记录 | 第 8 章 | 在 Cloudflare 完整 DNS 设置中，从 Tunnel 控制台添加 published application route 会自动建立相关 DNS 记录 | [Published applications](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/) | 已核对 |
| Access 不是发布前提 | 第 8 章 | 发布应用本身不需要付费 Access 方案；没有 Access 或应用登录时，公开主机名可能对所有互联网用户开放 | [Published applications](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/) | 已核对 |
| Tunnel 出站连接 | 开始之前、第 6—8、10—11 章 | `cloudflared` 主动建立出站连接；当前使用 UDP 7844 / QUIC 或 TCP 7844 / HTTP2，主线不新增公网入站 7844、80、443 或 8080 | [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/)、[Tunnel with firewall](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-with-firewall/) | 2026-08-12 已核对 |
| Quick Tunnel 边界 | 第 7 章 | Quick Tunnel 仅用于开发测试，不作为本书生产交付物 | [Set up Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/setup/) | 2026-08-12 已核对 |
| zone Pending | 开始之前、第 11 章 | nameserver 正确但 zone 长期 Pending 时，注册商遗留的 DNSSEC DS 记录是常见原因 | [Pending nameservers](https://developers.cloudflare.com/dns/zone-setups/troubleshooting/pending-nameservers/) | 已核对 |
| 1033 | 第 11 章 | Cloudflare 找不到健康的 `cloudflared` connector，Tunnel 未连接到 Cloudflare 网络 | [Tunnel troubleshooting](https://developers.cloudflare.com/tunnel/troubleshooting/) | 已核对 |
| Tunnel 502 | 第 11 章 | Tunnel 已连接，但 `cloudflared` 无法访问路由中配置的本地源站，常见原因是服务停止、协议或端口错误 | [Tunnel troubleshooting](https://developers.cloudflare.com/tunnel/troubleshooting/) | 已核对 |
| DNS 成功不等于应用成功 | 第 11 章 | DNS 只能证明主机名有查询结果；仍需分别验证 Tunnel、connector 与本机服务 | [Routing](https://developers.cloudflare.com/tunnel/routing/) | 已核对 |
| 不忽略证书错误 | 第 11 章 | TLS 信任问题应修复信任链或配置，不把关闭验证作为零基础主线 | [Tunnel troubleshooting](https://developers.cloudflare.com/tunnel/troubleshooting/) | 已核对 |
| Full setup | 第 3—4 章 | Free 和 Pro 当前使用 primary/full setup；Cloudflare 成为权威 DNS，注册商只需改用分配的 nameserver | [Primary setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/) | 2026-08-12 已核对 |
| Quick scan 边界 | 第 3 章 | 快速扫描按常见模式启发式查找，不能保证发现自定义子域名、DKIM 和全部现有记录，切换前必须人工复核 | [DNS quick scan](https://developers.cloudflare.com/dns/zone-setups/reference/dns-quick-scan/) | 2026-08-12 已核对 |
| nameserver 激活等待 | 第 4 章 | 注册商更新后最长可能等待约 24 小时；以公共 NS 查询与 Cloudflare Active 状态为准，不承诺固定完成时间 | [Set up a primary zone](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) | 2026-08-12 已核对 |
| DNSSEC 迁移顺序 | 第 4 章 | 已有 DNSSEC 时先移除旧 DS 并等待其 TTL 过期，再换 nameserver；Active 后在 Cloudflare 启用 DNSSEC 并发布新 DS | [DNSSEC](https://developers.cloudflare.com/dns/dnssec/) | 2026-08-12 已核对 |
| DS 缓存时间 | 第 4 章 | 官方给出常见 24—48 小时但强调各 TLD 不同；正文要求查询多个公共解析器，不用倒计时替代验证 | [DNSSEC](https://developers.cloudflare.com/dns/dnssec/) | 2026-08-12 已核对 |
| Pending 与旧 DS | 第 4 章 | nameserver 已正确但仍 Pending 时，遗留 DS 是常见原因之一，不扩展为唯一原因 | [Pending nameservers](https://developers.cloudflare.com/dns/zone-setups/troubleshooting/pending-nameservers/) | 2026-08-12 已核对 |
| DNS 记录类型 | 第 5 章 | A/AAAA 对应 IPv4/IPv6，CNAME 对应规范名称，MX 用于邮件，TXT 常用于验证，普通 NS 主要用于委派 | [DNS record types](https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/) | 2026-08-12 已核对 |
| Proxy status | 第 1、3、5 章 | A、AAAA、CNAME 可代理；MX、TXT 始终 DNS only；Proxied 返回 Cloudflare 地址并让 HTTP/HTTPS 经由代理 | [Proxy status](https://developers.cloudflare.com/dns/proxy-status/) | 2026-08-12 已核对 |
| Proxied TTL | 第 5 章 | Proxied 记录当前固定 Auto、文档当前值 300 秒；本地缓存可能更久且平台可调整，不承诺五分钟全网完成 | [Proxy status](https://developers.cloudflare.com/dns/proxy-status/) | 2026-08-12 已核对 |
| 公共解析器样本 | 第 4 章 | `1.1.1.1` 与 `8.8.8.8` 分别是 Cloudflare 与 Google 当前公开递归解析器；两者用于交叉观察，不代表覆盖所有缓存 | [Cloudflare 1.1.1.1](https://developers.cloudflare.com/1.1.1.1/)、[Google Public DNS](https://developers.google.com/speed/public-dns) | 2026-08-12 已核对 |
| 注册联系信息 | 第 2 章 | ICANN 资料要求注册人保持准确可靠的联系信息；未及时验证或回应可能导致暂停或取消 | [Keeping registration data accurate](https://www.icann.org/resources/pages/registration-data-accurate-2023-11-02-en) | 2026-08-12 已核对 |
| 具名 Tunnel 主线 | 第 7 章 | 当前 Setup 流程在 `Networking → Tunnels` 创建具名 Tunnel，选择服务器系统与架构，再按 Install and Run 连接 connector | [Set up Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/setup/) | 2026-08-12 已核对 |
| Ubuntu 24.04 APT | 第 7 章 | 官方软件包站当前提供 Noble 稳定仓库、公钥与 `apt-get install cloudflared` 命令 | [Cloudflare package repository](https://pkg.cloudflare.com/) | 2026-08-12 已核对 |
| Tunnel token 权限 | 第 7、10 章 | 远程管理 Tunnel 只需 token 即可运行 connector；泄露后应旋转 token，并强制断开仍使用旧 token 的连接 | [Tunnel tokens](https://developers.cloudflare.com/tunnel/advanced/tunnel-tokens/) | 2026-08-12 已核对 |
| Tunnel 状态 | 第 7、11 章 | Healthy、Inactive、Down、Degraded 分别表示完整连接、从未连接、曾连接但已断开、部分连接失败；状态不证明源站健康 | [Tunnel troubleshooting](https://developers.cloudflare.com/tunnel/troubleshooting/) | 2026-08-12 已核对 |
| Universal SSL 默认行为 | 第 9 章 | full setup 激活后默认签发与续期；官方当前给出 15 分钟至 24 小时窗口，证书覆盖 apex 与一级子域名，只在代理主机名上呈现 | [Enable Universal SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/enable-universal-ssl/) | 2026-08-12 已核对 |
| 边缘与源站连接分层 | 第 9 章 | Cloudflare 架构可能包含访问者到边缘与边缘到源站两段证书；本书 Tunnel 同机源站使用回环 HTTP，不虚构 Nginx 公网证书 | [SSL/TLS overview](https://developers.cloudflare.com/ssl/) | 2026-08-12 已核对 |
| Access 鉴权边界 | 第 8、10 章 | Access 需要独立应用与策略；自托管应用在匹配 Allow 政策后才放行，不把 published route 或 HTTPS 当成 Access | [Create an Access application](https://developers.cloudflare.com/learning-paths/clientless-access/access-application/create-access-app/) | 2026-08-12 已核对 |
| 默认缓存边界 | 第 10 章 | Cloudflare 当前默认不缓存 HTML 或 JSON；Cache Rules、响应头和 Cookie 等会改变结果，登录与动态页面不能随意 Cache Everything | [Default cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/) | 2026-08-12 已核对 |
| 域名续费不能只依赖自动开关 | 第 12 章 | Cloudflare Registrar 当前默认自动续费并约在到期前 30 天首次尝试，但明确不保证成功；其他注册商政策单独核对 | [Renew domains](https://developers.cloudflare.com/registrar/account-options/renew-domains/) | 2026-08-12 已核对 |
| cloudflared 更新影响 | 第 12 章 | 使用包管理器安装时继续用同一包管理器更新；更新和重启会影响当前流量，零停机需要多 connector 或负载均衡设计 | [Update cloudflared](https://developers.cloudflare.com/tunnel/downloads/update-cloudflared/) | 2026-08-12 已核对 |
| Tunnel 删除边界 | 第 12 章 | 有活动连接时 Tunnel 不能正常删除；本书不提供 `-f` 强制删除捷径，永久退役先移除单 route 并保留回退证据 | [Useful commands](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/tunnel-useful-commands/) | 2026-08-12 已核对 |
| published route 与 DNS 关联 | 第 12 章、附录 | 公开应用主机名通过 DNS CNAME 或负载均衡关联 Tunnel；临时下线单 route 后必须复核关联 DNS | [Published applications](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/) | 2026-08-12 已核对 |
| Caddy 官方安装 | 附录 | Debian/Ubuntu 官方稳定软件包使用 Cloudsmith 仓库，安装后以 `caddy` systemd 服务运行 | [Install Caddy](https://caddyserver.com/docs/install) | 2026-08-12 已核对 |
| Caddy 自动 HTTPS 前提 | 附录 | 公共域名需 DNS 指向服务器、80/443 可达、Caddy 可绑定端口且数据目录持久可写，Caddy 才能自动签发续期并重定向 | [Automatic HTTPS](https://caddyserver.com/docs/automatic-https) | 2026-08-12 已核对 |
| Caddy reverse_proxy | 附录 | `reverse_proxy 127.0.0.1:8080` 把 Caddy 收到的请求转发给同机回环源站；附录不与 Tunnel 主线并行 | [reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy) | 2026-08-12 已核对 |
| Full (strict) | 附录 | 传统 Cloudflare 源站必须在 443 提供未过期、受信且主机名匹配的证书，否则可能返回 526 | [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/) | 2026-08-12 已核对 |
| Origin CA 浏览器信任边界 | 附录 | Origin CA 证书用于 Cloudflare 到源站；暂停代理或 DNS only 后浏览器直连通常不信任，应改用公共受信证书 | [Origin CA troubleshooting](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/troubleshooting/) | 2026-08-12 已核对 |
| Cloudflare Registrar 不覆盖 nameserver 迁移实测 | RC 实机方案 | Cloudflare Registrar 域名固定使用 Cloudflare nameserver，不能完整验证第三方注册商改 NS 的第 3—4 章主线；完整校订使用第三方注册商独立域名 | [Register a new domain](https://developers.cloudflare.com/registrar/get-started/register-domain/) | 2026-08-12 已核对 |
| Tunnel 主控制台入口 | 第 7—12 章、RC 实机方案 | 2026-02 起主 Cloudflare Dashboard 的 `Networking → Tunnels` 支持公开应用 Tunnel 生命周期、route 和健康状态；Zero Trust 入口仍适合 Access 与私网场景 | [Tunnel Core Dashboard changelog](https://developers.cloudflare.com/changelog/post/2026-02-20-tunnel-core-dashboard/) | 2026-08-12 已核对 |
| route、DNS 与 1016 | 第 8、11、12 章、资料来源、RC 实机方案 | Dashboard 添加 route 会创建指向 Tunnel 的 DNS 记录，但 DNS 与 Tunnel 为独立对象；Tunnel 停止不会删除 DNS，访问者可能看到 1016。1016 的通用含义是 Cloudflare 无法解析源站目标，不能把所有 1016 都归为 Tunnel 停止 | [Routing](https://developers.cloudflare.com/tunnel/routing/)、[Error 1016](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1016/) | 2026-08-22 已核对并补入正文 |

## 写作限制

- 不复制控制台生成的真实安装 token；
- 不在仓库中保存真实 Tunnel UUID、账户 ID、zone ID 或 hostname；
- 不把 Healthy、Inactive、Down、Degraded 的界面颜色当作唯一语义；
- 不声称 Cloudflare Free 提供中国大陆境内节点加速；
- 不用 `curl -k`、关闭 TLS 验证或开放所有防火墙端口作为排错捷径；
- 不把 1033、502 或 Pending 扩展成所有场景都只有一个根因；
- 控制台导航名称和状态文案在批量写作、实机校订和 RC 前再次复核。

## 后续待校订

- 第 2 章：具体注册商价格、续费、支付、实名与地区规则仍需在实机或 RC 阶段按选定服务商复核；当前正文保持通用判断，不写固定结果；
- 第 7 章：Ubuntu 24.04 amd64 软件源、systemd、token、状态和出站端口已核对；卸载与正常轮换留给第 12 章维护流程；
- 第 9 章：边缘证书、Universal SSL 覆盖和签发等待已核对；实机证书界面与真实等待仍留给 RC 实机校订；
- 第 10 章：缓存、公开应用与 Access 责任边界已核对；不在第一版扩展为 Access 配置教程；
- 第 2 章：选定注册商的实时价格、支付、实名或身份核验、退款与中国大陆地区可用性；
- 第 7—12 章：使用隔离域名与教学服务实测 Tunnel 创建、重启恢复、单 route 下线恢复、token 轮换和更新窗口；
- 第 9 章：实机 Universal SSL 签发、证书覆盖与等待时间；
- 附录：在隔离 VPS 或维护窗口实测 Caddy 软件包、80/443、自动 HTTPS、Full (strict)、Origin CA 和完整回退。
