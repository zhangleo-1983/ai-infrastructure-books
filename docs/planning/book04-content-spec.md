# 第四册内容规格与章节大纲

状态：核心方案与 15 个 draft 内容单元已获项目 Owner 确认；正在进行 RC 前事实二校，尚未启用公开路由

策划日期：2026-08-11

书籍 ID：`04-cloudflare`

最终书名：《让服务拥有域名：从 DNS 到 Cloudflare HTTPS》

本文定义第四册的目标读者、交付结果、内容边界、章节结构、界面需求、事实校订要求和
风险，是正文写作与审阅的规格基准，不是正式发布内容。15 个 MDX 内容单元已经形成
draft，但不改动第一至第三册正文，也不启用第四册公开路由、搜索、完成状态或正式打印。

## 策划结论

第四册接收第三册留下的本机服务：

```text
Compose 项目目录明确
+ 服务在服务器上正常运行
+ 服务器本机可以访问 http://127.0.0.1:8080
+ 8080 没有直接暴露到公网
+ 尚无域名、DNS、HTTPS 和公开入口
```

本册的任务不是“把一个域名指向 IP”这么单一，而是让零基础读者建立完整的请求路径：

```text
注册商
→ 权威 DNS
→ Cloudflare 边缘网络
→ Cloudflare Tunnel
→ 服务器上的 cloudflared
→ http://127.0.0.1:8080
→ Docker Compose 服务
```

### 已确认主线

第一版采用以下主线：

1. 使用一个由读者控制的域名；
2. 使用 Cloudflare Free 方案的完整 DNS 设置（full setup）；
3. 为服务规划独立子域名，例如 `app.example.com`；
4. 创建具名的生产 Cloudflare Tunnel；
5. 把公开主机名映射到 `http://127.0.0.1:8080`；
6. 通过 Cloudflare 边缘证书向浏览器提供 HTTPS；
7. 保持服务器的 `8080` 端口不对公网开放；
8. 用分层检查法判断故障发生在域名、DNS、Cloudflare、Tunnel、服务器还是容器。

选择 Tunnel 作为零基础主线，主要因为它可以直接接住第三册的 `127.0.0.1:8080`，而且
连接由服务器主动向 Cloudflare 建立，不要求先开放新的公网入站端口。它减少了第一遍
学习时证书签发、80/443 入站规则和源站公网暴露之间的耦合。

本书仍然必须解释“反向代理”。Cloudflare 边缘代理和 Tunnel 共同承担了公开请求转发，
不能让读者误以为 Tunnel 是“神秘直连”。传统的 Caddy 反向代理路径建议放入附录或
独立对照单元：它用于解释 `域名 → 服务器 443 → Caddy → 127.0.0.1:8080`，但不与
Tunnel 主线同时配置，避免新手得到两套互相覆盖的入口。

### 建议的主线默认值

| 项目 | 建议默认值 | 说明 |
| --- | --- | --- |
| 域名 | 读者控制的普通 ASCII 域名 | 正文使用 `example.com` 一类保留示例，不出现真实域名 |
| 公共服务名 | `app.example.com` | 给根域名保留未来用途，也便于识别服务边界 |
| DNS 托管 | Cloudflare 完整设置 | 由 Cloudflare 提供权威 DNS；注册商仍负责域名所有权和续费 |
| Cloudflare 方案 | Free | 不把付费功能写成完成本册的前提 |
| DNS 代理状态 | 主线服务记录使用 Proxied | 需要明确 DNS only 与 Proxied 对源站地址和请求路径的影响 |
| 公开入口 | 生产 Cloudflare Tunnel | 不使用 Quick Tunnel 作为正式交付物 |
| 本地源站 | `http://127.0.0.1:8080` | 沿用第三册交接状态，不直接暴露公网 8080 |
| 浏览器入口 | `https://app.example.com` | 用户 URL 不带 `:8080` |
| HTTPS | Cloudflare 边缘证书 | 解释浏览器到边缘与边缘到源站是两段连接 |
| 传统路径 | Caddy 作为附录对照 | 使用 80/443、自动 HTTPS；不与 Tunnel 主线并行启用 |
| 完成率 | 只计算第 1—12 章 | introduction、appendix 和 sources 不计入 |
| 事实校订日期 | 2026-08-11 | UI、套餐、限制、安装命令在写作和发布候选阶段再次核对 |

### 不应使用的主线

- 不把 `http://公网 IP:8080` 当作正式发布方式；
- 不把 Cloudflare 的 Flexible SSL/TLS 模式作为教学方案；
- 不使用临时 `trycloudflare.com` Quick Tunnel 作为整册交付物；
- 不要求读者将真实域名、Tunnel token、API token 或源站凭证写入仓库；
- 不把 Cloudflare Free 代理描述为“中国大陆节点加速”或 ICP 备案替代方案；
- 不把 Caddy、Nginx 和 Tunnel 写成三套并行的完整教程；
- 不要求关闭服务器现有的第二册或第三册服务；
- 不把“浏览器显示小锁”当作应用已经安全、私密或具备登录保护的证明。

## 1. 第四册目标读者

### 核心读者

- 已完成第一册，拥有一台可以管理的 VPS；
- 已完成第三册，服务器本机已有一个可访问的 Compose Web 服务；
- 第一次购买或管理域名；
- 不理解注册商、DNS 托管商、权威名称服务器之间的分工；
- 不知道 A、AAAA、CNAME、TXT、TTL、Proxied 和 DNS only 是什么；
- 看到 HTTPS、小锁和证书，但不知道加密发生在哪两端；
- 希望用一个容易记忆的域名访问自己的服务；
- 主要位于中国大陆，可能遇到跨境支付、注册商访问、域名实名或备案概念混淆；
- 不准备先系统学习网络工程、PKI 或 Web 服务器运维。

### 默认具备的能力

- 能用 SSH 登录 Ubuntu 24.04 LTS 服务器；
- 能使用 `sudo` 执行经过解释的命令；
- 能找到第三册 Compose 项目目录；
- 能运行 `sudo docker compose ps`；
- 能从服务器本机验证 `curl http://127.0.0.1:8080`；
- 能在浏览器登录邮箱、域名注册商和 Cloudflare；
- 知道密码、私钥和 token 不能公开分享；
- 愿意在更改名称服务器前核对现有 DNS 记录。

### 默认不具备的知识

- 不知道购买域名获得的是限期注册使用权，不是永久买断；
- 不知道注册商与 DNS 解析服务可以是不同公司；
- 不知道 nameserver 决定谁回答权威 DNS 查询；
- 不知道 DNS 记录改变后，缓存和激活状态可能需要时间；
- 不知道 Proxied 记录返回 Cloudflare 地址，而 DNS only 通常直接返回源站地址；
- 不知道一个子域名可以只对应一个应用入口；
- 不知道 Tunnel connector 是服务器主动建立的出站连接；
- 不知道 HTTPS 证书只证明连接和域名身份，不证明应用没有漏洞；
- 不知道 Cloudflare 代理、Tunnel 和应用鉴权是三个不同能力；
- 不知道 DNSSEC 在名称服务器迁移时需要按顺序处理；
- 不知道域名过期、邮箱失效或 2FA 丢失都可能让服务失去控制。

### 需要主动消除的焦虑

- 担心域名购买后立即产生未知的持续费用；
- 不知道是否必须在中国大陆备案才能完成海外 VPS 实验；
- 害怕改 nameserver 会导致域名永久失效；
- 看到 Cloudflare 扫描出的 DNS 记录，不知道哪些可以保留、删除或修改；
- 不知道橙色云和灰色云有什么实际区别；
- 不知道“证书正在签发”是失败还是等待状态；
- 害怕安装 `cloudflared` 会替换 Docker 或修改现有容器；
- 不知道 Tunnel 在线但页面打不开时应该查哪一层；
- 误以为开启 Cloudflare 后源站、应用和账户自动变得绝对安全；
- 不敢停止错误的 Tunnel，或误删仍在使用的 DNS 记录。

## 2. 阅读前提

读者开始前需要：

- 一台正在运行、可以通过 SSH 登录的 Ubuntu 24.04 LTS VPS；
- 一个 `root` 账户，或一个已验证可以使用 `sudo` 的管理员账户；
- 稳定的公网连接和正常的系统时间；
- 一个已经完成第三册的 Compose 项目；
- 服务在服务器本机可通过 `http://127.0.0.1:8080` 访问；
- 项目目录、服务名、容器端口、主机监听地址和备份位置的交接卡；
- 一个可长期使用并能接收验证邮件的邮箱；
- 一个启用 2FA 的 Cloudflare 账户；
- 一个由读者控制的域名，或为购买一个域名准备的合法付款方式与准确联系信息；
- 有能力登录域名注册商并修改 nameserver；
- 同意遵守域名注册政策、Cloudflare 条款、所在地法律和组织安全制度。

读者不需要提前具备：

- 中国大陆 ICP 备案；本册主线只验证海外 VPS 与普通全球 Cloudflare 服务，不承诺中国大陆托管或加速能力；
- Cloudflare 付费方案；
- 固定家庭公网 IP；
- 在 VPS 上开放公网 80、443 或 8080；
- 自己生成或购买 TLS 证书；
- Nginx、Caddy 或 Apache 经验；
- Cloudflare API token、Terraform 或自动化部署知识；
- Cloudflare Access、Zero Trust 身份策略或企业账号；
- GitHub、Vercel 或 Cloudflare Pages 项目。

### 开始前的停止条件

出现以下任一情况时，正文应要求读者先停下，而不是继续改 DNS：

- 不确定域名当前是否承载邮箱、网站或其他业务；
- 无法登录注册商或无法接收注册邮箱邮件；
- 不知道当前 nameserver 和 DNS 记录由谁维护；
- 域名状态显示锁定、过期、暂停、争议或待验证；
- Cloudflare 扫描记录与注册商当前记录明显不一致；
- DNSSEC 已启用，但读者不知道 DS 记录在哪里管理；
- 第三册本机服务本身已经无法通过 `127.0.0.1:8080` 访问；
- 准备使用真实生产域名，但没有变更窗口、回退记录或负责人确认。

## 3. 学习结果

### 认知结果

完成第四册后，读者应当能够：

- 区分域名注册商、注册局、权威 DNS、递归 DNS 和 Web 服务；
- 解释 URL 中协议、主机名、端口和路径的含义；
- 用自己的话解释 A、AAAA、CNAME、TXT、MX、TTL 和 nameserver；
- 理解域名注册、DNS 解析、Cloudflare 代理、Tunnel 和应用服务是不同层；
- 解释 Proxied 与 DNS only 的请求路径和源站暴露差异；
- 理解 Cloudflare Tunnel 由 `cloudflared` 主动建立出站连接；
- 理解浏览器到 Cloudflare 与 Cloudflare 到本地服务是两段连接；
- 知道 HTTPS 不等于应用已经登录保护、合规或没有漏洞；
- 知道 DNS 修改可能受激活状态、TTL 和本地缓存影响；
- 知道 DNSSEC 能保护 DNS 完整性，但迁移顺序错误可能导致域名不可解析；
- 理解 Cloudflare 的全球代理服务不等于中国大陆境内 Cloudflare China Network；
- 能用分层方法判断故障，而不是反复随机修改记录。

### 操作结果

完成第四册后，读者必须已经获得：

| 交付物或能力 | 验收证据 |
| --- | --- |
| 一个可控制的域名 | 能登录注册商，确认注册邮箱、到期日、自动续费和 2FA 状态 |
| Cloudflare 中 Active 的站点 | Cloudflare 显示域名已激活，权威 nameserver 与分配值一致 |
| 可解释的 DNS 记录 | 能指出服务主机名、记录类型、代理状态和用途 |
| 一个生产 Tunnel | Tunnel 具有稳定名称，connector 状态正常，不使用临时 Quick Tunnel |
| 服务器上的 connector | `cloudflared` 服务运行，并能在重启后恢复连接 |
| 一个公开主机名路由 | `app.example.com` 映射到 `http://127.0.0.1:8080` |
| 可用的 HTTPS 地址 | 浏览器能打开 `https://app.example.com`，证书和主机名匹配 |
| 不直接暴露的练习服务 | 公网 URL 不使用 `:8080`，服务器仍只在本机监听练习端口 |
| 分层排错能力 | 能分别检查 DNS、Cloudflare、Tunnel、服务器服务和容器日志 |
| 可维护的交接记录 | 记录注册商、续费日、域名、Tunnel 名、源站地址、项目目录和回退步骤，不记录 token |

### 整册完成条件

建议只把第 1—12 章计入完成率。以下内容不计入：

- “开始之前”；
- 附录；
- 资料来源。

12 章全部完成时可以显示整册完成，但最后一章的完成清单必须核验：

- 域名仍由读者控制，续费与注册邮箱可用；
- Cloudflare zone 状态为 Active；
- `https://app.example.com` 可以从外部网络访问；
- Tunnel connector 在服务器重启后能够恢复；
- `http://127.0.0.1:8080` 仍是有效的本机源站；
- 没有为了本册把公网 `8080` 端口开放给所有来源；
- 读者知道如何暂时下线公开入口，而不删除 Compose 数据；
- 交接卡没有真实密码、私钥、API token、Tunnel token 或账户恢复码。

“DNS 已生效”不等于整册完成。“浏览器出现小锁”也不等于服务已经具备用户鉴权。

## 4. 不包含的内容

第四册不负责：

- 购买 VPS、首次 SSH 登录或 Docker 安装；
- 修改第二册的 3X-UI、Xray、VLESS、Reality 或客户端配置；
- 把代理节点、面板或 SSH 管理入口公开到本册域名；
- 中国大陆网站备案、经营许可、公安备案或境内部署合规教程；
- 申请 Cloudflare China Network、China Express 或企业合同；
- 承诺某个域名后缀、注册商、DNS 或线路在中国大陆始终可访问；
- 域名投资、抢注、交易、品牌保护或商标法律意见；
- 邮件托管、SPF、DKIM、DMARC 的完整配置；
- DNS 高级路由、负载均衡、GeoDNS、Anycast 原理或多活架构；
- Cloudflare Workers、Pages、R2、D1、KV 或应用开发；
- Cloudflare Access、WAF、自定义规则和机器人管理的完整教程；
- Cloudflare API、Terraform、GitOps 或自动化证书轮换；
- 为数据库、SSH、远程桌面或任意 TCP/UDP 服务设计公网入口；
- 高可用 Tunnel、多个 connector、跨服务器故障转移或企业监控；
- 深入讲解 PKI、CA、OCSP、TLS 握手、密码套件或 HTTP/3；
- Nginx、Apache 或 Caddy 的完整运维教程；
- 为 Open WebUI、Dify 或其他具体应用配置登录、OAuth 和权限；
- 绕过地区限制、平台策略、付费限制或网络监管的方法。

可以在附录解释传统 Caddy 反向代理、Cloudflare Origin CA、Full (strict)、常见 DNS 命令
和错误码，但它们不扩展成与 Tunnel 同等篇幅的第二主线。

## 5. 章节大纲

以下是提案，不是已确认的最终章节名称或 slug。确认前不创建对应 MDX。

| Order | 类型 | 建议 slug | 章节标题 | 读者要解决的问题 |
| ---: | --- | --- | --- | --- |
| 0 | introduction | `start` | 开始之前：先确认域名与本机服务都在你控制中 | 哪些信息必须先准备，哪些现有业务不能碰？ |
| 1 | chapter | `01-request-path` | 一个网址怎样找到你的服务？ | 域名、DNS、HTTPS、反向代理和容器之间是什么关系？ |
| 2 | chapter | `02-own-domain` | 选择并持有一个可长期使用的域名 | 怎样选择注册商、后缀、联系邮箱、续费与账户保护？ |
| 3 | chapter | `03-add-to-cloudflare` | 把域名添加到 Cloudflare | Free 方案、站点扫描和接管 DNS 分别意味着什么？ |
| 4 | chapter | `04-change-nameservers` | 更换权威名称服务器，等待站点激活 | 怎样安全修改 nameserver，DNSSEC 为什么要按顺序处理？ |
| 5 | chapter | `05-read-dns-records` | 看懂 DNS 记录、TTL 与橙色云 | A、AAAA、CNAME、TXT、MX、Proxied 和 DNS only 怎样选择？ |
| 6 | chapter | `06-plan-public-hostname` | 规划公开主机名与暴露边界 | 为什么使用 `app.example.com`，哪些端口和服务不应该公开？ |
| 7 | chapter | `07-create-tunnel` | 创建生产 Cloudflare Tunnel | Tunnel 做了什么，怎样安全安装并运行 `cloudflared`？ |
| 8 | chapter | `08-publish-application` | 把域名连接到本机 Compose 服务 | 怎样将公开主机名映射到 `http://127.0.0.1:8080`？ |
| 9 | chapter | `09-verify-https` | 验证 HTTPS 与完整请求路径 | 小锁、证书、响应内容和每一段连接怎样分别验证？ |
| 10 | chapter | `10-security-boundary` | 收紧入口：账户、域名、Tunnel 与源站 | 怎样避免泄露 token、误开端口或把“已代理”误当成“已鉴权”？ |
| 11 | chapter | `11-troubleshooting` | 页面打不开：按层排查 DNS、Tunnel 与容器 | NXDOMAIN、Pending、502、Tunnel 离线和源站失败怎样区分？ |
| 12 | chapter | `12-maintenance-handoff` | 续费、变更、回退与下一册交接 | 怎样让域名和公开入口几个月后仍然可维护？ |
| 13 | appendix | `appendix` | 附录：DNS 命令、错误地图与 Caddy 对照路径 | 怎样快速检查记录，并理解传统 80/443 反向代理？ |
| 14 | sources | `sources` | 资料来源与校订记录 | 当前事实来自哪些官方资料，何时需要重查？ |

### 顺序设计说明

- 第 1 章先建立请求路径，避免读者把 Cloudflare 当成一个“加速按钮”；
- 第 2—4 章先处理所有权和权威 DNS，再创建服务记录；
- 第 5 章集中解释 DNS 字段，后续界面不再反复猜字段含义；
- 第 6 章先做暴露设计，再安装 connector；
- 第 7—9 章只走一条 Tunnel 主线，形成可验证的 HTTPS 交付；
- 第 10 章补齐安全边界，不把公开等同于安全；
- 第 11 章以请求路径为排错顺序；
- 第 12 章把域名续费、Tunnel 和 Compose 交接到后续应用册；
- Caddy 放在附录，保留传统反向代理知识，但不干扰第一次成功路径。

## 6. 每章目标

### 开始之前：先确认域名与本机服务都在你控制中

- 做什么：填写前置检查表，确认注册商、邮箱、Cloudflare、服务器和 Compose 项目可用；
- 为什么：DNS 修改会影响整个域名，源站本身故障时不应通过反复改 DNS 排错；
- 成功状态：能说出域名所有权、当前 nameserver、服务本机地址和回退负责人；
- 失败判断：无法登录注册商、域名已有未知业务、DNSSEC 状态不明或本机服务不可访问；
- 安全边界：不粘贴密码、恢复码、私钥或 token；不直接使用重要生产域名练习。

### 第 1 章：一个网址怎样找到你的服务？

- 做什么：沿一条请求路径识别注册商、DNS、Cloudflare、Tunnel、服务器和容器；
- 为什么：后续每个故障都必须先定位层级；
- 成功状态：读者能解释 `https://app.example.com/path` 各部分和转发路径；
- 失败判断：仍把域名、DNS、服务器和 HTTPS 当成同一个对象；
- 安全边界：明确 HTTPS 不提供应用登录，也不保证内容合法或应用无漏洞。

### 第 2 章：选择并持有一个可长期使用的域名

- 做什么：比较域名后缀、首年价、续费价、联系人、自动续费、转移锁和 2FA；
- 为什么：域名是长期入口，低首年价格不能代表长期成本；
- 成功状态：读者拥有或选定一个可控制的域名，并记录到期日与恢复路径；
- 失败判断：无法验证邮箱、付款失败、名称拼写错误、联系信息不准确或后缀规则不明；
- 安全边界：不推荐侵权名称，不承诺匿名注册，不收集真实付款或联系信息。

### 第 3 章：把域名添加到 Cloudflare

- 做什么：在 Cloudflare 添加站点、选择 Free 方案、阅读扫描到的 DNS 记录；
- 为什么：Cloudflare 必须先建立 zone，才能分配权威 nameserver；
- 成功状态：出现两条分配的 nameserver，原有重要记录已人工核对；
- 失败判断：域名拼写错误、zone 已属于其他账户、扫描漏掉 MX/TXT 或用户不认识现有记录；
- 安全边界：有邮件或业务记录时不盲删；不把扫描结果当作完整备份。

### 第 4 章：更换权威名称服务器，等待站点激活

- 做什么：在注册商更换 nameserver，并观察 Cloudflare 从 Pending 到 Active；
- 为什么：只有注册局委派到 Cloudflare，Cloudflare 才能回答权威查询；
- 成功状态：注册商和公共查询显示 Cloudflare 分配的 nameserver，zone 状态 Active；
- 失败判断：超过合理等待时间仍 Pending、nameserver 有拼写错误或遗留 DS 记录导致验证失败；
- 安全边界：迁移前处理 DNSSEC；不在重要业务时段无回退地操作。

### 第 5 章：看懂 DNS 记录、TTL 与橙色云

- 做什么：阅读并区分 A、AAAA、CNAME、TXT、MX、TTL 和代理状态；
- 为什么：记录类型和代理状态决定查询答案与请求路径；
- 成功状态：能说明服务记录为何代理、邮件记录为何不能随意代理；
- 失败判断：把 nameserver 当作 A 记录，把橙色云当作 DNS 已生效，或误删验证记录；
- 安全边界：不在示例中暴露真实源站 IP；任何删除先记录原值和用途。

### 第 6 章：规划公开主机名与暴露边界

- 做什么：选择 `app.example.com`，核对 `127.0.0.1:8080`，画出允许和禁止的入口；
- 为什么：公开一个 Web 应用不等于公开整台服务器；
- 成功状态：公开主机名唯一、无冲突，源站本机可用，公网 8080 不需要开放；
- 失败判断：主机名已被占用、服务监听错误、端口与第二册服务冲突；
- 安全边界：SSH、数据库、管理面板和第二册代理端口不进入本册公开路由。

### 第 7 章：创建生产 Cloudflare Tunnel

- 做什么：创建具名 Tunnel，安装官方 `cloudflared`，注册为系统服务并检查 connector；
- 为什么：生产 Tunnel 提供稳定身份与可维护 connector，Quick Tunnel 只适合临时测试；
- 成功状态：Tunnel 与 connector 显示 Healthy/Connected，服务重启后自动恢复；
- 失败判断：软件源不可达、架构不匹配、token 失效、服务未运行或系统时间异常；
- 安全边界：安装 token 视为敏感凭证，不写入正文、截图、Shell 历史示例或 Git。

### 第 8 章：把域名连接到本机 Compose 服务

- 做什么：创建 published application route，将 `app.example.com` 指向 `http://127.0.0.1:8080`；
- 为什么：公开主机名需要明确映射到服务器上的一个本地服务；
- 成功状态：路由保存、DNS 记录生成、connector 能访问源站；
- 失败判断：协议写错、端口写错、使用了容器内部地址、DNS 记录冲突或源站拒绝连接；
- 安全边界：不使用 `0.0.0.0` 作为浏览器地址，不把 SSH 或管理面板误填为 HTTP 服务。

### 第 9 章：验证 HTTPS 与完整请求路径

- 做什么：从外部浏览器、DNS 查询、Tunnel 状态、服务器本机和容器状态逐层验证；
- 为什么：页面能开、证书有效和源站健康需要分别判断；
- 成功状态：HTTPS 主机名正确、内容符合预期、HTTP 不泄露非预期入口、每层有证据；
- 失败判断：证书待签发、主机名不匹配、缓存内容错误、Tunnel 在线但源站 502；
- 安全边界：不建议忽略浏览器证书警告；不把边缘证书与源站证书混为一谈。

### 第 10 章：收紧入口——账户、域名、Tunnel 与源站

- 做什么：复查 2FA、恢复方式、最小公开面、token 管理、日志、缓存和应用鉴权边界；
- 为什么：公开服务增加攻击面，Cloudflare 代理不能代替应用安全；
- 成功状态：无公网 8080、token 不在仓库、账户恢复可用、公开内容和鉴权责任明确；
- 失败判断：任何人可进入管理功能、token 出现在命令记录、源站 IP 被不必要公开；
- 安全边界：不承诺匿名、不可追踪或绝对防护；Access/WAF 只解释边界，不扩展成主线。

### 第 11 章：页面打不开——按层排查 DNS、Tunnel 与容器

- 做什么：按照“名称 → DNS → 边缘 → Tunnel → 本机服务 → 容器”排查；
- 为什么：随机删除记录或重建容器会掩盖真正原因；
- 成功状态：能用一个最小证据把问题定位到某一层，并选择可逆操作；
- 失败判断：NXDOMAIN、zone Pending、Tunnel 无 connector、502、容器停止或端口不监听；
- 安全边界：排错前备份记录；不关闭所有防火墙、不泄露 token、不用 `curl -k` 掩盖证书问题。

### 第 12 章：续费、变更、回退与下一册交接

- 做什么：记录续费、注册邮箱、zone、Tunnel、主机名、源站、项目目录、停止和恢复步骤；
- 为什么：域名与 Tunnel 是持续运行资产，不是一次设置后永久不变；
- 成功状态：另一位维护者不接触秘密值也能识别系统结构、验证状态和执行回退；
- 失败判断：不知道域名何时到期、Tunnel 名称与服务器不对应、回退只能靠删除资源；
- 安全边界：交接卡只记录凭证存放位置和负责人，不记录凭证值。

## 7. 每章需要的仿真界面或图解

继续遵守系列规则：不使用真实软件截图；所有注册商、Cloudflare、浏览器和终端界面均用
HTML、CSS 或内联 SVG 绘制，并明确标注“教学仿真，不对应软件某一版本的像素级截图”。

| 内容单元 | 建议仿真或图解 | 维护方式 |
| --- | --- | --- |
| 开始之前 | 五项前置清单、秘密值禁入区、现有业务停止条件 | 通用清单与 Callout |
| 第 1 章 | 完整请求路径、URL 拆解、六层责任地图 | `FlowDiagram` + 专用 SVG |
| 第 2 章 | 通用注册商搜索、价格结构、续费与 2FA 面板 | 专用 `RegistrarMock`；价格不写死 |
| 第 3 章 | Add a site、方案选择、DNS 扫描复核 | 浅层 `MockWindow` + 专用区块 |
| 第 4 章 | 注册商 nameserver 表单、Pending/Active 状态 | `MockField` + `MockStatusBadge` |
| 第 5 章 | DNS 记录表、橙色云/灰色云、TTL | 专用 `DnsRecordsMock` |
| 第 6 章 | 主机名规划卡、允许/禁止入口边界图 | `ComparisonTable` + `FlowDiagram` |
| 第 7 章 | Tunnel 创建流程、安装终端、connector 状态 | `TerminalMock` + 专用 `TunnelMock` |
| 第 8 章 | Public hostname 路由表单与保存结果 | 专用 `TunnelRouteMock` |
| 第 9 章 | 浏览器地址栏教学仿真、证书链路、逐层验证终端 | `BrowserMock` + `TerminalMock` |
| 第 10 章 | 账户/域名/Tunnel/源站安全矩阵 | `ChapterChecklist` + 状态徽标 |
| 第 11 章 | 错误到层级的决策树、常见状态卡 | `TroubleshootingItem` + 流程图 |
| 第 12 章 | 不含秘密的交接卡、变更与回退时间线 | 专用 `HandoffCardMock` |
| 附录 | 命令地图、DNS 记录表、Caddy 对照路径 | 表格、代码块与两张流程图 |

### 组件策略

- 优先复用现有 `Callout`、`CodeBlock`、`TerminalMock`、`BrowserMock`、
  `FlowDiagram`、`ComparisonTable`、`TroubleshootingItem` 和 `ChapterChecklist`；
- 可以增加 `RegistrarMock`、`DnsRecordsMock`、`TunnelMock`、`TunnelRouteMock`；
- 单次出现的 Cloudflare onboarding 或交接卡允许使用专用 Astro 组件；
- 不把 Cloudflare 全部界面抽象成大型 JSON 配置；
- 命令文本必须是显示与复制的单一来源；
- token、域名、邮箱、IP 和账户 ID 只使用明显的文档示例值；
- 图中同时使用文字、形状和状态，不只依赖橙色/灰色或红色/绿色表达含义。

## 8. 时效性信息清单

### 长期稳定知识

以下内容预计长期稳定，仍需在写作阶段复核术语：

- 域名注册商、注册局、权威 DNS 和递归 DNS 的基本分工；
- URL 的协议、主机名、端口和路径；
- A、AAAA、CNAME、TXT、MX、NS 和 TTL 的基本含义；
- HTTPS、证书和反向代理的基本关系；
- DNS 缓存意味着修改不会在所有设备上同时可见；
- 最小公开面、凭证保密、2FA、续费与回退的安全原则；
- 分层排错优于随机修改；
- 应用鉴权、传输加密和网络代理不是同一个能力。

### 厂商界面相关内容

发布前必须重看官方界面或官方文档：

- Cloudflare 添加站点、选择方案和 DNS 扫描流程；
- 分配 nameserver、Pending/Active 状态文字和激活时限；
- DNS Records 页面字段、代理开关和 TTL 选项；
- Zero Trust / Networks / Tunnels 的导航位置；
- Tunnel 创建、connector 安装和 published application route 的字段名称；
- `cloudflared` 官方安装命令、包源、服务管理与卸载方式；
- Universal SSL 状态、证书覆盖范围和签发等待提示；
- 注册商域名锁、自动续费、联系人验证和 DNSSEC 界面。

仿真界面表达字段关系和操作顺序，不承诺与 Cloudflare 当前 UI 像素一致。

### 价格和套餐相关内容

- 域名首年、续费、赎回、转移和税费会随后缀、注册商、币种和时间变化；
- Cloudflare Registrar 的具体批发成本不写成固定价格承诺；
- Cloudflare Free 功能和限制需要在发布候选阶段复核；
- 自动续费、退款、优惠、支付失败和域名恢复费用必须链接官方政策；
- 传统 Caddy 路径可能涉及额外公网 IP、端口或证书条件，但 Caddy 本身不作为付费产品推荐；
- Cloudflare 代理上传大小、缓存和其他限制只在确实影响后续应用时说明，并标校订日期。

正文采用“查看当前价和续费价的方法”，不维护一张很快失效的服务商价格排行榜。

### 支付和实名认证相关内容

第一版以中国大陆读者为主要场景，但必须区分：

- 海外注册商可能要求国际信用卡、账单资料、邮箱验证和风控审核；
- 中国大陆注册商可能要求域名实名认证，具体材料和生效时间取决于注册商与后缀；
- Cloudflare Registrar 要求准确联系信息和付款资料，其可用支付方式需要实时核对；
- 注册联系信息、账单信息和实名材料不得出现在截图、仓库、日志或示例；
- 本册不提供虚假资料、代实名、共享账户或绕过支付风控的方法；
- 支付成功、域名注册成功、Cloudflare zone Active 是三个不同状态。

### 可能涉及地区差异的内容

- 普通 Cloudflare 全球网络与 Cloudflare China Network 是不同产品；
- China Network 需要企业订阅和有效 ICP 许可，不能写成 Free 方案默认能力；
- 中国大陆访问速度、可用性、支付、注册商界面和邮箱收信可能因网络与服务商变化；
- 在中国大陆服务器上公开网站可能涉及备案与其他合规义务，本册不提供法律结论；
- 在海外 VPS 上完成全球 DNS/Tunnel 教学不等于对中国大陆访问质量作出保证；
- Cloudflare Pages、Turnstile 和其他产品在中国大陆的可用性边界不能外推到 Tunnel；
- 域名后缀的注册资格、实名、隐私代理和转移规则具有地区与注册局差异。

## 9. 作者决策记录

项目 Owner 于 2026-08-11 确认以下核心决策：

1. **最终书名：**《让服务拥有域名：从 DNS 到 Cloudflare HTTPS》；
2. **正文主线：**使用生产 Cloudflare Tunnel，Caddy 不与主线并行；
3. **域名注册路径：**采用“已有域名或任意正规注册商”的通用流程，不绑定单一厂商；
4. **DNSSEC：**纳入主线的安全迁移步骤，覆盖更换 nameserver 前的检查和激活后的恢复；
5. **Caddy：**只放在附录，提供最小、可独立验证的传统反向代理对照路径。

以下编辑口径作为上述决策的实施默认值；若样章验证发现不适合零基础读者，再提交 Owner
调整，不在写作过程中静默改变：

- 阿里云或腾讯云只用于说明中国注册商的实名与 nameserver 位置差异，不写第二套购买教程；
- 读者可以购买一个普通域名，也可以使用自己已有域名下不承载生产业务的子域名；
- Cloudflare 账户 2FA 放入“开始之前”的强制检查；
- 主线只公开无敏感数据的第三册教学页，不把 HTTPS 当作应用登录保护；
- Cloudflare Access 在安全章解释适用边界，不进入第一版配置步骤；
- 第五册为每个应用使用独立子域名和独立 Tunnel route；
- 书名和封面不承诺固定完成分钟数，因为 nameserver 激活与证书签发等待不可控。

## 10. 与系列前后册的衔接点

### 从第一册接收

- VPS 地区、Ubuntu 版本、CPU 架构与管理员账户；
- 公网 IPv4 与 SSH 登录能力；
- 云防火墙当前规则；
- 账户和凭证存放位置；
- 服务器计费与销毁边界。

第四册不重新教授购买、支付、首次 SSH 或公网 IP 概念，只提供返回第一册的链接。

### 与第二册共存

- 不修改 3X-UI / Xray 配置；
- 不公开第二册面板、订阅或节点敏感信息；
- 不占用或关闭第二册现有端口；
- Cloudflare Tunnel 只路由明确的 HTTP 教学服务；
- 不能暗示普通 Cloudflare HTTP 代理可以替代第二册网络方案。

### 从第三册接收

- 项目目录：`$HOME/docker-labs/compose-web`；
- Compose project：`book03-compose-demo`；
- service：`web`；
- 本机源站：`http://127.0.0.1:8080`；
- 公网暴露：否；
- 镜像、配置、日志、备份与恢复记录；
- `sudo docker compose ps` 和 `curl --fail --show-error http://127.0.0.1:8080` 的成功证据。

如果第三册服务未运行，第四册应链接回第三册排错章，而不是通过改 Tunnel 路由掩盖故障。

### 向第五册交付

建议第四册向 Open WebUI 册交付：

- 一个由读者控制并正常续费的域名；
- 一个 Active 的 Cloudflare zone；
- 一条可以解释的权威 DNS 链路；
- 一个可维护的生产 Tunnel 与服务器 connector；
- 已验证的 `app.example.com → 127.0.0.1:8080` 教学路由；
- HTTPS 与分层排错能力；
- 一套“每个应用独立子域名、独立路由、独立鉴权判断”的命名原则；
- 不含 token 的域名与 Tunnel 交接卡。

第五册可以替换源站服务或新增 `openwebui.example.com`，但不应要求读者重新学习域名所有权
和 nameserver。

## 11. 技术事实校订清单

校订基线日期：2026-08-11。正式写作与每个 RC 前必须重新查看官方资料。

### 域名与注册

- [ ] 域名候选是否可注册、首年价、续费价、税费和赎回费用；
- [ ] 注册商支持的中国大陆付款方式与风控要求；
- [ ] 注册联系信息、邮箱验证、自动续费、转移锁和隐私服务的当前规则；
- [ ] Cloudflare Registrar 是否支持目标后缀、付款方式和读者地区；
- [ ] Cloudflare Registrar 当前仍要求使用 Cloudflare nameserver；
- [ ] 国际化域名（IDN）支持边界；
- [ ] 域名注册与中国大陆 ICP 备案、域名实名之间的边界表述。

### Cloudflare DNS

- [ ] Free/Pro 完整设置的当前前提和 onboarding 步骤；
- [ ] nameserver 激活通常时限与 Pending 排错方法；
- [ ] 更换 nameserver 前 DNSSEC/DS 记录的官方建议；
- [ ] DNS 扫描不会保证导入全部记录的警告；
- [ ] Proxied 支持的记录类型、端口和流量类型；
- [ ] Proxied 与 DNS only 返回地址和源站暴露差异；
- [ ] Proxied 记录 TTL 当前是否固定为 Auto，以及其当前值；
- [ ] Universal SSL 的默认启用、签发时限和主机名覆盖范围；
- [ ] `app.example.com` 是否属于默认 Universal SSL 覆盖范围；
- [ ] 邮件记录、MX 和邮件主机名的代理限制。

### Cloudflare Tunnel

- [ ] Tunnel 与 connector 的当前产品命名和控制台路径；
- [ ] 生产 Tunnel 与 Quick Tunnel 的当前功能边界；
- [ ] Free 方案是否仍可创建本册所需的 Tunnel 和 published application；
- [ ] Ubuntu 24.04 amd64 官方 `cloudflared` 安装方式；
- [ ] 系统服务安装、启动、状态、日志、重启和卸载命令；
- [ ] 安装 token 的权限、轮换和泄露处置方式；
- [ ] Public hostname / published application 路由字段；
- [ ] `http://127.0.0.1:8080` 作为本地 service URL 的支持状态；
- [ ] connector 健康状态、Tunnel 常见错误码与日志字段；
- [ ] 删除 route、停止 connector、删除 Tunnel 的顺序和影响。

### HTTPS 与传统反向代理

- [ ] 浏览器到 Cloudflare、Cloudflare Tunnel 到 `cloudflared`、`cloudflared` 到本机 HTTP 的准确表述；
- [ ] Universal SSL 只在 Proxied 主机名上呈现的当前规则；
- [ ] Full (strict) 的源站证书要求和 526 条件；
- [ ] Origin CA 证书不受普通浏览器直接信任的警告；
- [ ] Caddy 官方 Ubuntu 安装方式；
- [ ] Caddy 自动 HTTPS 对公网 80/443、DNS 和可达性的当前要求；
- [ ] 最小 `reverse_proxy localhost:8080` 语法；
- [ ] Caddy 与 Cloudflare 组合时真实客户端 IP、trusted proxies 和源站绕过风险。

### 中国大陆与产品限制

- [ ] Cloudflare China Network 的订阅、ICP 与企业要求；
- [ ] 普通 Free 方案不得表述为中国大陆境内加速；
- [ ] Cloudflare 当前受代理支持的 HTTP/HTTPS 端口；
- [ ] Free 方案上传大小等可能影响后续 AI 应用的限制；
- [ ] Cloudflare 服务状态、地区可用性和第三方网络依赖的准确免责声明；
- [ ] 外部事实、命令和界面均标注校订日期。

### 当前官方来源基线

| 主题 | 官方来源 |
| --- | --- |
| Cloudflare 完整 DNS 设置 | [Set up a full zone](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) |
| DNS 记录创建 | [Create DNS records](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/) |
| DNS 记录类型 | [DNS record types](https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/) |
| TTL | [Time to Live (TTL)](https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/) |
| Proxied 与 DNS only | [Proxy status](https://developers.cloudflare.com/dns/proxy-status/) |
| Pending nameservers | [Pending nameserver updates](https://developers.cloudflare.com/dns/zone-setups/troubleshooting/pending-nameservers/) |
| Universal SSL | [Enable Universal SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/enable-universal-ssl/) |
| Full (strict) | [Full (strict) encryption mode](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/) |
| Origin CA | [Cloudflare Origin CA](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/) |
| 代理支持端口 | [Network ports](https://developers.cloudflare.com/fundamentals/reference/network-ports/) |
| Cloudflare Tunnel | [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/) |
| Tunnel 设置 | [Set up Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/setup/) |
| Tunnel 路由 | [Routing with Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/routing/) |
| Published applications | [Published applications](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/) |
| Quick Tunnel 限制 | [TryCloudflare](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/) |
| Cloudflare Registrar | [Cloudflare Registrar](https://developers.cloudflare.com/registrar/) |
| 注册新域名 | [Register a new domain](https://developers.cloudflare.com/registrar/get-started/register-domain/) |
| Cloudflare China Network | [China Network](https://developers.cloudflare.com/china-network/) |
| 中国网络开通条件 | [Get started with China Network](https://developers.cloudflare.com/china-network/get-started/) |
| 默认缓存与上传限制 | [Default cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/) |
| Caddy 官方安装 | [Install Caddy](https://caddyserver.com/docs/install) |
| Caddy HTTPS 入门 | [HTTPS quick start](https://caddyserver.com/docs/quick-starts/https) |
| Caddy 反向代理 | [`reverse_proxy` directive](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy) |
| 域名注册人基础 | [ICANN Information for Domain Name Registrants](https://www.icann.org/registrants) |

## 12. 内容风险清单

| 风险 | 可能后果 | 写作与实现约束 |
| --- | --- | --- |
| 更换 nameserver 前漏记录 | 邮箱、网站或验证服务中断 | 强制导出/抄录并逐项复核，不把自动扫描当备份 |
| DNSSEC/DS 顺序错误 | 域名在全球无法解析 | 迁移前单独检查，引用官方顺序并提供回退 |
| 域名拼写或注册对象错误 | 费用不可退或品牌风险 | 付款前逐字符确认，不使用真实品牌示例 |
| 首年低价掩盖续费成本 | 到期时被迫放弃或产生高费用 | 同时检查续费、赎回、税费与自动续费 |
| 注册邮箱或 2FA 丢失 | 无法续费、迁移或恢复域名 | 建立恢复码与第二联系方式流程，但不写入交接卡 |
| 暴露真实域名、IP 或 token | 账户、Tunnel 或源站被滥用 | 只用保留示例；自动检查敏感模式 |
| 安装 token 进入 Shell 历史 | connector 凭证泄露 | 教学命令展示占位符，解释轮换和清理边界 |
| 直接开放公网 8080 | 绕过 Cloudflare 或增加攻击面 | 主线保持 `127.0.0.1:8080`，云防火墙不新增全网 8080 |
| 把 Proxied 当作隐藏源站保证 | 历史记录或其他服务仍泄露 IP | 用“减少直接暴露”而非“永久隐藏”表述 |
| 把 HTTPS 当作应用鉴权 | 敏感应用对所有人公开 | 明确教学页无敏感内容；Access/应用登录单独处理 |
| 使用 Flexible 模式 | 边缘到源站未按预期加密、重定向混乱 | 不作为主线；传统路径只推荐 Full (strict) |
| Universal SSL 尚未签发 | 临时证书警告或无法访问 | 说明等待状态与 15 分钟至 24 小时窗口，RC 前复核 |
| 使用 Quick Tunnel 交付 | 地址不稳定、限制不适合正式使用 | 只解释临时测试边界，不作为完成证据 |
| Tunnel 在线但源站故障 | 用户误删 DNS 或重建 Tunnel | 第 11 章要求先本机 `curl` 和 Compose 状态 |
| Tunnel 成为单点依赖 | connector 停止后服务下线 | 交接服务状态、日志、重启与回退；不夸大高可用 |
| 缓存动态或私密内容 | 显示旧内容或泄露响应 | 教学页默认不配置自定义缓存；说明后续应用需单独评估 |
| 上传大小或长连接限制 | 后续 AI 应用部分功能失败 | 在第五册前复核产品限制，不在本册承诺任意应用兼容 |
| Free 与 China Network 混淆 | 对中国大陆访问质量作出错误承诺 | 明确 China Network 是独立企业产品并要求 ICP |
| 注册商/Cloudflare UI 变化 | 读者找不到字段 | 仿真强调信息结构；标校订日期和官方入口 |
| Caddy 与 Tunnel 同时启用 | 路由、端口和证书责任混乱 | 附录明确是替代路径，不要求与主线并行执行 |
| 现有第二册服务被修改 | 代理节点或管理面板中断 | 端口清点，禁止修改 3X-UI / Xray 入站和防火墙规则 |
| 删除 zone、Tunnel 或 DNS | 服务立刻下线且恢复困难 | 删除前说明影响对象，优先使用可逆的禁用/停止步骤 |
| 真实生产域名用于练习 | 业务、邮件或声誉受损 | 推荐无现有业务的域名或独立子域名，设置停止条件 |
| 过度承诺“30 分钟” | nameserver/证书等待使读者误判失败 | 只统计可操作时间，明确外部激活等待不受控制 |

## 13. 策划阶段交付与后续顺序

### 本阶段已完成

- 建立第四册目标读者、阅读前提、学习结果和内容边界；
- 给出 15 个内容单元的章节提案；
- 为每章定义做什么、为什么、成功状态、失败判断和安全边界；
- 列出仿真界面、时效性分类、事实校订清单和风险；
- 明确与第一至第三册以及第五册的衔接；
- 提出需要作者确认的 12 个决策；
- 采用官方资料建立 2026-08-11 的事实基线。

### 下一实施阶段

已完成：

- 更新 `src/data/books.ts` 中第四册书籍注册信息，并保持 `drafting / 0.0.0`；
- 建立 `docs/qa/04-cloudflare/` 的内容进度、样章与事实校订台账；
- 建立“开始之前”、第 8 章和最复杂的第 11 章三篇 draft 样章；
- 验证开发预览、手机端、无 JavaScript、打印样式和 production 草稿排除。
- 三篇样章与第 1—5 章第一批 draft 已获 Owner 确认；
- 第 6—7、9—10 章第二批 draft 已建立，第 8、11 章已完成跨章连续性复核；
- 第二批已通过官方事实、命令语法、内容、生产草稿排除、响应式、深色、无 JavaScript 和打印检查。

后续步骤：

1. 经作者确认第二批后，完成第 12 章、附录和资料来源；
2. 内容完成后再启用搜索、打印、完成状态和公开路由；
3. 建立独立测试域名与可销毁 Tunnel 做实机校订；
4. 完成跨浏览器、搜索、PDF、无障碍、部署和发布候选验收。

核心规格已获确认，但 draft 写作阶段仍不购买域名、不修改真实 nameserver、不创建真实
Cloudflare Tunnel，也不改变前三册的 URL、正文、搜索、打印或交互行为。
