# 第一册技术事实校订记录

校订日期：2026-07-28

状态：公开 Release Candidate；官方文档校订、自动回归和真实账户部署前核验已完成，
付费实例与跨册端到端验证保留为可选持续 QA

## 已核对

| 事实 | 当前结论 | 官方来源 | 下次复核 |
| --- | --- | --- | --- |
| 主线产品类型 | Vultr Cloud Compute 提供 Shared CPU 部署路径 | [Vultr provisioning](https://docs.vultr.com/products/compute/instances/cloud-compute/provisioning) | 编写创建实例章前 |
| 管理员类型 | 默认凭证与 Limited User / sudo 均有官方路径 | [Vultr provisioning](https://docs.vultr.com/products/compute/instances/cloud-compute/provisioning) | 编写认证章前 |
| 密码与密钥 | Vultr 官方 SSH 文档同时提供密码和指定私钥登录方式 | [Vultr OpenSSH](https://docs.vultr.com/products/compute/instances/cloud-compute/connection/openssh) | 编写首次登录章前 |
| 支付方式 | 官方当前列出银行卡、PayPal 和 Alipay 等方式；2026-07-28 的真实中国账户部署前核验可见 Credit Card、PayPal、Crypto 和 Alipay，银行卡品牌区域包含 UnionPay；促销、地区和账户状态仍可能影响实际可用方式 | [Vultr payment method](https://docs.vultr.com/support/platform/billing/why-do-i-need-to-enter-a-payment-method)、[Vultr payment methods](https://docs.vultr.com/support/platform/billing/what-payment-methods-do-you-accept) | 每次发布前 |
| Ubuntu 版本 | Ubuntu 24.04 LTS 仍在标准安全维护期 | [Ubuntu release cycle](https://ubuntu.com/about/release-cycle) | 每次发布前 |
| 3X-UI 架构 | 官方仓库当前列出 amd64 与 arm64；第一版选择 amd64 减少分支 | [3X-UI](https://github.com/MHSanaei/3x-ui) | 第二册兼容性回归前 |
| 停止实例后的计费 | Vultr 停止实例后仍计费；Destroy 才释放该实例资源并永久删除数据 | [Vultr stopped instances](https://docs.vultr.com/support/platform/billing/are-stopped-instances-still-billed-on-vultr) | 编写账单章及每次发布前 |
| 自动备份费用 | Vultr 自动备份属于附加持续费用；第一版首次创建时不默认启用 | [Vultr automatic backups](https://docs.vultr.com/support/platform/billing/how-much-does-it-cost-to-enable-automatic-backups) | 编写创建与账单章前 |
| Lightsail 公网地址 | Lightsail 实例具有公网 IPv4；默认动态公网 IPv4 在停止并重新启动后可能变化，长期固定地址需绑定 Static IP | [AWS Lightsail static IP](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-static-ip-addresses-in-amazon-lightsail.html) | 编写备选附录及每次发布前 |
| 阿里云公网 IPv4 | ECS 公网 IPv4 的分配与计费需在创建页明确核对，不能把私网地址当作公网地址 | [阿里云 ECS 公网 IPv4](https://help.aliyun.com/zh/ecs/user-guide/public-ip-address) | 编写备选附录前 |
| 阿里云安全组 | 安全组是云端虚拟防火墙；TCP 22 对 `0.0.0.0/0` 开放会允许任意公网来源尝试 SSH | [阿里云 ECS 安全组](https://help.aliyun.com/zh/ecs/user-guide/start-using-security-groups) | 编写备选附录及安全章前 |
| Vultr 地区选择 | 创建实例时按地点选择部署；正式选择还应结合状态页与 Looking Glass 网络测试 | [Vultr provisioning](https://docs.vultr.com/products/compute/instances/cloud-compute/provisioning)、[Vultr status](https://status.vultr.com/)、[Vultr migration practices](https://docs.vultr.com/public/doc-assets/pdfs/article/best-practices-when-migrating-to-vultr.pdf) | 编写创建实例章及每次发布前 |
| Vultr 账户密码 | 当前最低要求为至少 10 个字符，并包含大写、小写字母和数字；正文建议使用密码管理器生成更长的唯一密码 | [Vultr password requirements](https://docs.vultr.com/support/platform/authentication/what-are-the-password-requirements-for-a-vultr-account) | 每次发布前 |
| Vultr 两因素认证 | 当前支持 TOTP 与 FIDO2/WebAuthn；官方建议预先生成 Emergency Backup Codes；2026-07-28 的真实账户部署前核验已确认 Authenticator Application 可启用 | [Vultr 2FA](https://docs.vultr.com/support/platform/authentication/what-is-two-factor-authentication) | 每次发布前 |
| 中国用户支付主线 | 官方当前列出 Alipay、银行卡、PayPal 和 UnionPay 等方式；实际可用性仍取决于账户与地区 | [Vultr payment methods](https://docs.vultr.com/support/platform/billing/what-payment-methods-do-you-accept)、[Make account payments](https://docs.vultr.com/platform/billing/make-account-payments) | 使用测试账户编写第 9 章前 |
| 预授权、美元账单与税务地区 | 添加银行卡后可能出现由发卡行释放的小额临时验证授权，它不等于服务器费用；账单以 USD 出具；税务地区参考账单地址与主要支付方式 | [Credit-card authorization](https://docs.vultr.com/support/platform/billing/why-is-there-a-small-charge-after-adding-credit-card)、[Vultr billing FAQ](https://docs.vultr.com/platform/billing/faq)、[Tax location](https://docs.vultr.com/support/platform/billing/how-is-my-tax-location-determined) | 编写第 9 章及每次发布前 |
| ED25519 密钥 | Vultr 官方安全文档提供 `ssh-keygen -t ed25519` 路径，并要求私钥留在本地、部署时选择公钥 | [Vultr security practices](https://docs.vultr.com/platform/security-best-practices/vultr-cloud-instances) | Windows/macOS 实测后 |
| Windows OpenSSH | Windows 10/11 的官方 OpenSSH 工具包含 `ssh-keygen`，支持 ED25519 | [Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement) | Windows 代表环境实测后 |
| Vultr SSH Key 上传 | 当前账户控制台支持保存 OpenSSH 公钥，并在新实例部署时选择 | [Vultr add SSH keys](https://docs.vultr.com/products/orchestration/ssh-keys/add-ssh-keys) | 使用测试账户编写第 8 章前 |
| Vultr 默认服务器密码 | 官方当前说明实例随机生成 `root` 或 `linuxuser` 密码，可在控制台查看；不会通过普通邮件发送 | [Lost SSH key](https://docs.vultr.com/support/products/compute/i-lost-the-ssh-key-for-my-vultr-compute-instance)、[Root password email](https://docs.vultr.com/support/products/compute/i-did-not-get-an-email-of-my-vultr-compute-instance-root-password) | 完成两种认证实例实测后 |
| 创建页面核心字段 | 官方流程包含 Shared CPU、Location、Plan、Operating System、SSH Keys、Firewall Group、Public IPv4、Automatic Backups 和 Limited User Login；2026-07-28 的真实账户核验发现 Beta 与旧版页面的字段、默认值和套餐可用性展示并不完全一致 | [Vultr provisioning](https://docs.vultr.com/products/compute/instances/cloud-compute/provisioning) | 每次发布前 |
| Public IPv4 默认值 | 当前官方流程中 Public IP 实例默认启用 Public IPv4；IPv6 启用后仍可取消 IPv4 形成 IPv6-only | [Vultr provisioning](https://docs.vultr.com/products/compute/instances/cloud-compute/provisioning) | 每次发布前 |
| Vultr Firewall | Firewall Rule 可按 IPv4、TCP、来源地址和端口过滤流量；第一册只配置 TCP 22。2026-07-28 的真实账户界面没有 “My IP” 快捷项，应使用 Custom 填写当前公网 IPv4 的 `/32`，SSH 预设会固定端口 22 | [Vultr firewall rules](https://docs.vultr.com/products/network/firewall-groups/management/rules)、[Provision firewall group](https://docs.vultr.com/products/network/firewall-groups/provisioning)、[Link firewall group](https://docs.vultr.com/products/network/firewall-groups/management/link) | 每次发布前 |
| 服务器计费起点 | 服务器在 Deploy 后开始按小时计费，最小计费单位为一小时；仅编辑或关闭未提交的创建草稿不会创建服务器 | [Vultr server billing](https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers) | 每次发布前 |
| 自动备份费率 | 当前按实例基础小时或月度价格增加 20%，并按实例计费情况折算 | [Vultr automatic backups](https://docs.vultr.com/support/platform/billing/how-much-does-it-cost-to-enable-automatic-backups) | 第 9 章发布前及每次发布前 |
| 快照独立计费 | 当前按快照存储量计费；快照可在实例销毁后继续存在 | [Vultr snapshot charges](https://docs.vultr.com/support/platform/billing/does-vultr-charge-for-stored-snapshots) | 每次发布前 |
| 带宽超额 | 超出套餐配额后当前按 GB 产生费用；Bandwidth Usage 页面提供当前及之前周期的出站传输统计 | [Vultr bandwidth overage](https://docs.vultr.com/support/platform/billing/what-is-the-bandwidth-overage-rate) | 每次发布前 |
| 意外账单排查 | Billing History 和 PDF/CSV 发票用于核对活动资源、小时用量、带宽超额及税费 | [Vultr unexpected charges](https://docs.vultr.com/support/platform/billing/why-do-i-see-an-unexpected-charge-on-my-invoice) | 使用测试账户完成首张账单后 |
| 实例开通状态 | 实例进入 Running 后才能继续核对公网地址与登录凭证；处理中或错误状态不应直接进入 SSH 步骤 | [Vultr instance management](https://docs.vultr.com/products/compute/instances/cloud-compute/management) | 使用测试账户核对控制台状态文案 |
| 实例公网 IPv4 | 普通实例公网 IPv4 在实例存在期间保持关联，但不等同于可独立迁移的 Reserved IP；实例删除后该地址不会继续归用户控制 | [Vultr instance IP address](https://docs.vultr.com/support/products/compute/how-do-i-get-a-vultr-compute-instance-dedicated-ip-address) | 每次发布前 |
| 密码查看与邮件边界 | 实例 root 密码不通过普通邮件发送，应从实例 Overview 页面查看；密码与私钥均不得写入仓库或工单 | [Vultr root password email](https://docs.vultr.com/support/products/compute/i-did-not-get-an-email-of-my-vultr-compute-instance-root-password) | 使用密码实例实测后 |
| 丢失 SSH 私钥 | 平台不会保管用户本地私钥；丢失后应使用控制台恢复路径，不能从服务器下载原私钥 | [Vultr lost SSH key](https://docs.vultr.com/support/products/compute/i-lost-the-ssh-key-for-my-vultr-compute-instance) | 使用密钥实例实测后 |
| 重装风险 | Reinstall 会清除实例文件系统与数据，不能作为购买或连接异常的常规重试操作 | [Vultr reinstall](https://docs.vultr.com/products/compute/instances/cloud-compute/management/reinstall-instance) | 每次发布前 |
| SSH 连接前置条件 | 应先确认实例运行、TCP 22 可达、用户名和认证材料正确；网络超时与认证拒绝需要分支排查 | [Vultr SSH troubleshooting](https://docs.vultr.com/support/products/compute/how-to-troubleshoot-ssh-connectivity-issues) | Windows/macOS 与两种认证方式实测后 |
| Windows OpenSSH 客户端 | Windows 10/11 可使用系统 OpenSSH Client；正文使用终端命令，不依赖第三方 SSH 客户端 | [Microsoft OpenSSH](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse) | Windows 代表环境实测后 |
| Ubuntu 首次 SSH 登录 | OpenSSH 使用主机密钥验证服务器身份；首次连接确认指纹后写入本机已知主机记录 | [Ubuntu OpenSSH](https://ubuntu.com/server/docs/how-to/security/openssh-server/) | 两台测试实例交叉核对指纹提示 |
| 支付失败处理 | 银行卡被拒可能来自账户信息、发卡行或风控；不应连续重复付款或重复创建实例，应先核对状态与账单再联系官方支持 | [Vultr declined card](https://docs.vultr.com/support/platform/billing/why-was-my-credit-card-declined)、[Vultr unpaid invoice](https://docs.vultr.com/support/platform/billing/what-if-im-unable-to-pay-my-invoice) | 使用测试账户完成异常分支记录 |
| Lightsail Static IP | 默认动态公网 IPv4 在停止并重新启动实例后可能变化；需要稳定地址时应创建并绑定同 Region 的 Static IP | [AWS Lightsail Static IP](https://docs.aws.amazon.com/lightsail/latest/userguide/lightsail-create-static-ip.html) | 编写或发布备选附录前 |
| Lightsail SSH Key | 默认密钥、自定义密钥和上传公钥的私钥保存规则不同；自定义私钥只能在创建时下载 | [AWS Lightsail SSH keys](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-ssh-in-amazon-lightsail.html) | 使用测试账户创建备选实例后 |
| Lightsail 默认防火墙 | Linux 基础实例可能预置面向公网的 SSH 与 HTTP 规则；附录要求限制 SSH 来源并删除当前用途不需要的公开规则 | [AWS Lightsail firewall](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-firewall-and-port-mappings-in-amazon-lightsail.html) | 使用测试账户核对 Ubuntu 模板后 |
| 阿里云 ECS 登录凭证 | Linux 默认用户通常为 `root`，选择普通用户时可为 `ecs-user`；平台不保存可查看的默认实例密码 | [阿里云 ECS 登录凭证](https://help.aliyun.com/zh/ecs/user-guide/instance-logon-credential-management) | 使用中国站测试账户创建备选实例后 |
| 阿里云固定公网 IP 回收 | 创建时需显式分配公网 IPv4；带宽改为 0 Mbps、节省停机或释放实例等情形可能回收固定公网 IP | [阿里云 ECS 公网 IPv4](https://help.aliyun.com/zh/ecs/user-guide/public-ip-address)、[停止实例](https://help.aliyun.com/zh/ecs/user-guide/stop-an-instance) | 每次发布备选附录前 |
| 阿里云释放实例 | 释放会删除相关实例数据并回收固定公网 IP；独立云盘、EIP 或快照可能继续存在和计费 | [阿里云释放实例](https://help.aliyun.com/zh/ecs/user-guide/release-an-instance) | 使用测试账户验证删除流程后 |

## 真实账户部署前核验与可选持续实测

2026-07-28 已使用真实中国账户完成从控制台、2FA、银行卡验证到 Deploy 前最终摘要的
核验，没有创建付费实例。正文继续使用教学仿真、条件化表达、校订日期和官方来源；
实例创建、SSH、第二册端到端和销毁流程保留为可选持续 QA，不阻止当前版本公开阅读。

其中“中国大陆网络访问”只表示尚未覆盖对应运营商和网络环境，不表示已经观察到
地域封锁或普通浏览器 403。只有真实测试或稳定的读者反馈显示注册、控制台、支付或
实例管理无法使用时，才把它升级为发布阻塞问题。

- [x] 当前中国大陆浏览器会话能够访问 Vultr 控制台；未记录运营商和网络类型；
- [x] 使用真实账户核对当前 Alipay、银行卡和 PayPal 分支；
- [x] 使用真实账户确认 2FA 已启用；唯一密码、邮箱验证与恢复码未在本轮重复核验；
- [ ] 核对额外身份验证或人工审核的实际提示；
- [x] 核对东京地区当前可选 Shared CPU 套餐，并记录 Beta 与旧版页面差异；
- [ ] 使用中国大陆家庭宽带和至少一种移动网络实测东京、洛杉矶 Looking Glass；
- [x] 核对候选套餐的 vCPU、RAM、磁盘、流量、独立公网 IPv4 和价格；
- [x] 核对 Ubuntu 24.04 LTS x64 镜像；默认用户名仍按官方资料维护；
- [ ] 分别使用密码和 ED25519 密钥部署测试实例；
- [ ] 在 Windows 与 macOS 分别生成 ED25519 密钥并核对默认文件路径；
- [x] 核对创建页面的 SSH Key、Public IPv4、Automatic Backups 和 Deploy 摘要；Limited User Login 未作为本轮主线；
- [x] 核对云防火墙 TCP 22 与 Custom 来源 IPv4 `/32` 分支；
- [x] 核对 Deploy 最终摘要中的小时价、月度参考价、币种、Public IPv4 和全部附加项；
- [ ] 只提交一次测试 Deploy，并确认 Billing History 只出现一个实例；
- [x] 在创建草稿中核对 Automatic Backups Off；快照、Bandwidth Usage 和发票入口保留为可选复核；
- [ ] 核对实例从 Pending 到 Running 的实际状态文案，以及 Overview 中 IP、系统、地区和凭证字段；
- [ ] 分别核对密码实例与 SSH Key 实例的凭证展示边界；
- [ ] 在 Windows 和 macOS 完成密钥、密码两条首次 SSH 登录路径；
- [ ] 核对首次主机指纹提示、`whoami`、`sudo whoami`、`exit` 与 known_hosts 修复分支；
- [ ] 核对超时、拒绝连接、认证失败和主机密钥变化四类错误的实际终端文案；
- [ ] 核对 View Console、Restart、Stop、Reinstall 和 Destroy 的实际入口与确认提示；
- [x] 第二册开始之前、第 2 章、第 4 章、第 11 章、附录和来源已完成密码/SSH 私钥双路径内容校订；
- [ ] 使用真实 Vultr 实例验证第二册的 Windows/macOS 密钥重新登录、密码重新登录和错误分支；
- [ ] 使用 AWS 测试账户核对 Ubuntu 模板、Static IP、Key Pair 和默认 Firewall 规则；
- [ ] 使用阿里云中国站测试账户核对境外地域、公网 IPv4、登录用户、安全组与节省停机分支；
- [x] 公开 RC 前逐条检查资料来源页外部链接和最后校订日期；49 个唯一链接中
      48 个自动返回 200；Vultr Status 曾拒绝非浏览器自动请求并返回 403，但官方页面
      仍可通过正常 Web 请求读取。该结果只记录为自动链接检查边界，不代表中国大陆
      家庭宽带访问会返回 403，也不构成当前 RC 的发布阻塞；
- [ ] 销毁测试实例，并检查账单和其他独立资源。

以上试走不得使用个人真实凭证写入仓库。价格、实例 ID、真实 IP、密码、私钥、支付
记录和身份验证资料只能记录为脱敏结论。未勾选的付费实例相关项目是持续维护机会，
不是当前发布阻塞项。
