# 第四册 RC 实机交接卡

校验日期：2026-08-23

状态：G1—G8 与阶段 1—9 已通过；教学环境已永久退役并完成费用闭环

本卡只记录可复核的对象、命令和责任边界。真实域名、公网 IP、nameserver、DS、账户、
实例 ID、Tunnel ID、connector ID、SSH 密钥和 token 不进入本卡；G8 已删除不再需要的
route、DNS、connector、Tunnel、临时实例与本机实验凭证。

## 最终退役状态

- Cloudflare zone：Free / Active，DNSSEC 公共验证正常；
- `app.<LAB_DOMAIN>` published route 与关联 DNS：已删除；
- `caddy.<LAB_DOMAIN>` 与教学 TXT：已删除；
- `<TUNNEL_NAME>` 与 connector：已删除；
- 临时 VPS：已 Destroy，Compute 列表为空，不再持续按小时消耗；
- 自动备份未启用，Block Storage、Snapshots、Reserved IPs 与 Load Balancers 均为空；
- 既有早期校订防火墙组：已解绑，当前不计费，因不是本次新建对象而保留；
- 本机实验 SSH 私钥、公钥、临时主机地址与独立 known-hosts 文件：已永久删除；
- 域名续费责任、Cloudflare Free zone、nameserver 与 DNSSEC：继续保留。

## 只读巡检顺序

后续只需要在受控控制台与 HTTPS 公共解析器中确认：

1. Cloudflare zone 仍为 Free / Active，DS、DNSKEY 与验证成功标志正常；
2. `app`、`caddy` 与教学 TXT 均无答案；
3. Tunnel 列表无本次教学 Tunnel，DNS Records 无本次教学记录；
4. Vultr Compute、Backups、Block Storage、Snapshots、Reserved IPs 与 Load Balancers 均为空；
5. 账单没有新的持续实例或附加资源消耗；域名续费是独立的年度责任。

## 历史故障证据

G6 本机实测中，停止源站、错误端口和停止 connector 都返回 502；route 删除会联动删除
关联 CNAME，重建后自动 DNS 与 HTTPS 恢复。完整时间线、恢复条件与错误码边界保存在
`field-validation-results.md`，不再为已经退役的实例提供恢复命令。

## G8 完成边界

- G7 已完成：临时 `caddy.<LAB_DOMAIN>`、Caddy 公共配置、UFW 与 Vultr TCP 80/443 规则均已删除；Vultr 防火墙组只保留既有 SSH 规则与默认丢弃规则；
- G8 已完成：`app` route、教学 DNS、connector、Tunnel、临时 VPS 与本机实验凭证均已永久删除；
- Compute、备份、快照、Reserved IP、Block Storage、负载均衡和账单入口均已复核；
- 根 zone 与 DNSSEC 默认保留；迁离 Cloudflare 需要新的 Owner 决策和正确的 DS / NS 顺序；
- 域名是年度资产，VPS 销毁不会停止域名续费责任。

## 敏感信息检查

- 不在仓库、聊天、日志摘录或截图中记录真实域名、IP、账户、ID、密钥或 token；
- Shell history 中不得出现 Tunnel token；
- 日志摘录只保存状态、错误类型、版本和必要时间；
- 未脱敏截图只用于当前受控核对，不复制到仓库；
- 不再需要的受控临时文件和 SSH 材料已永久删除，仓库敏感值精确扫描为 0。
