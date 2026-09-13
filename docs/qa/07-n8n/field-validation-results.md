# 第七册实机校订结果台账

日期：2026-09-12。G1.2 已创建并启动专用实例；G2 已通过可靠 SSH 终端完成固定版本 Compose 部署并启动 n8n。真实凭证不写入仓库。

## 闸门总表

| 闸门 | 状态 | 证据 | 恢复基线/遗留 |
| --- | --- | --- | --- |
| G1 盘点与专用环境 | 部分通过 | G1.1—G1.3 已有 Vultr、主机、Docker/Compose、SSH 与存储证据；G1.4 connector 未执行 | 保留实例继续 G2 |
| G2 回环部署 | 通过 | `docker compose config` 通过；`n8n-n8n-1` 使用 `docker.n8n.io/n8nio/n8n:1.123.4`，`/healthz` 返回 `{\"status\":\"ok\"}`；日志迁移完成且无致命错误；`docker compose restart` 后健康接口仍返回 ok；卷 `n8n_n8n_data` 存在；端口仅映射 `127.0.0.1:5678` | 进入 G3；SSH 本地转发已建立 |
| G3 管理员与持久设置 | 通过（基础项） | 初始化完成后进入 `home/workflows`，显示首位用户 `liang`；n8n 重启后工作流仍可访问且卷仍存在；时区已写入 `.env` | 退出重登动作未形成独立证据；继续 G4 |
| G4 低风险工作流 | 通过 | 已建立 `手动触发 → Edit Fields → If` 流程，输入为合成报名文字；保存后执行成功，画布显示各节点 `1 item`，通知为 `Workflow executed successfully` | 保留工作流进入 G5；不创建真实第三方凭证 |
| G5 HTTPS 与 Webhook | 通过（受保护入口） | Cloudflare Tunnel `book07-n8n-lab` Healthy；`https://n8n-lab.bitbeats.cn/` 在 Access 配置前 HTTP 200，配置后无会话 HTTP 302 到 Cloudflare Access；策略 `Book07 owner email` 仅允许本人邮箱；本地生产 Webhook `POST /webhook/book07-probe-9c3f2a` 合成请求返回 `{"status":"accepted-synthetic"}` HTTP 200 | 未创建第三方凭证；Webhook 路径使用教学专用随机段；清理已执行 |
| G6 故障与恢复 | 通过 | 停止 n8n 时 `/healthz` 按预期失败；重新启动后恢复 `{"status":"ok"}`；错误 Webhook 返回 404 | 已恢复基线；未做真实业务故障注入 |
| G7 备份与隔离恢复 | 通过（基础项） | 备份 Compose、`.env`、SQLite 数据库并记录 SHA256；固定镜像 `1.123.4` 拉取前后 digest 相同；重启后健康检查通过；数据库曾从受控副本恢复并重新激活 Webhook | 未进行跨 VPS 异地恢复；备份已在 G8 清理 |
| G8 清理与费用收口 | 通过 | 已删除 Cloudflare Access 应用、Tunnel、DNS route；VPS 上卸载 cloudflared、删除 Compose/volume/备份、移除 Codex 临时 SSH key；Vultr 实例列表确认 `No Instances`；公网主机名清理后返回 530 | 本轮临时资源与凭证已收口；根 zone、nameserver、DNSSEC 保留 |

## G1 只读记录

| 步骤 | 状态 | 实际结果/证据 | 费用 | 恢复/遗留 |
| --- | --- | --- | --- | --- |
| G1.1 账户、报价、域名与 Tunnel 基线 | 通过（部分） | 2026-09-11；G1.1-R01—R04 | Vultr 账户会话有效，余额/待结算/带宽、东京候选报价、Cloudflare 无 connector、单条既有 CNAME、NS 与 DNSSEC 成功状态均已记录；教学子域尚待选择，部署参数尚待锁定 | 暂不创建资源 |
| G1.2 创建 VPS、核主机指纹与 SSH | 通过 | 2026-09-11；Vultr 实例 ID `8e3632a3-dca1-4914-9801-791091c11945`；东京；公网 IPv4 `202.182.125.158`；Debian 13；1 vCPU/2 GB/50 GB NVMe；root；SSH key `book06-dify-lab`；防火墙 `book01-ssh-validation`；状态已启动；noVNC root 登录成功；内核 `6.12.107+deb13-amd64` | 控制台登录已完成；保留实例继续 G1.3 |
| G1.3 安装 Docker/Compose、核入站与存储 | 通过（基础项） | `apt-get update` 完成；Docker `26.1.5+dfsg1-9+deb13u1`；Docker Compose `2.26.1-4`；`systemctl is-active docker` 为 `active`；根盘 `/dev/vda2` 47G、已用 7.5G、可用 37G（17%） | Debian 仓库安装；AF_VSOCK systemd 提示不影响服务；n8n Compose 尚未部署 |
| G1.4 创建无 route connector（如适用） | 未执行 | — | 待核对 | — |

## 费用与请求账

| 对象/请求 | 次数或时长 | 预计/实际费用 | 证据 | 状态 |
| --- | ---: | ---: | --- | --- |
| VPS-A | 已创建，销毁待安全验证 | `$14.40/mo`（页面含自动备份，当前收费 `$0.03`） | Vultr 实例详情页 | 待 SSH 登录后决定清理窗口 |
| Tunnel-A | 1 个，已删除 | 待核对 | — | 未执行 |
| CRED-A | 0（默认） | 0 | — | 未创建 |

## 未覆盖范围

跨主机、跨架构、跨版本迁移，高并发、真实第三方业务写入、真实客户数据、匿名管理端、未授权凭证、自动扩容和付费插件不属于本轮默认范围。

## 当前暂停节点

2026-09-12：noVNC 自动键盘通道仍不可靠，但已改用本机 SSH 完成 `/opt/n8n` 下固定版本 Compose 部署。n8n 容器已启动并回环监听；G2 健康、日志、重启和卷复核已通过；G3 初始化和 G4 低风险工作流已有证据。G5 受保护 HTTPS、Access 与 Webhook、G6 故障恢复、G7 备份更新复核均已完成；G8 已完成，Vultr 实例列表确认无实例，公网主机名清理后不可用。
