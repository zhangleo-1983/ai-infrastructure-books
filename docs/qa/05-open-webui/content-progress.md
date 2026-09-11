# 第五册内容进度

更新时间：2026-09-11

当前阶段：15 个内容单元已进入 `release-candidate / 1.0.0-rc.1`；实机 G1—G8 已通过，临时资源已清理；RC 综合验收与发布执行中

## 内容单元台账

| Order | 类型 | slug | 标题 | 当前状态 | production / 搜索 / 正式打印 |
| ---: | --- | --- | --- | --- | --- |
| 0 | introduction | `start` | 开始之前：先确认服务器、模型账户与费用边界 | RC | 已纳入 |
| 1 | chapter | `01-two-request-paths` | 一个聊天框背后有哪两条请求路径？ | RC | 已纳入 |
| 2 | chapter | `02-choose-model-provider` | 先选模型来源，再决定服务器规格 | RC | 已纳入 |
| 3 | chapter | `03-plan-deployment` | 规划端口、数据、版本与回退点 | RC | 已纳入 |
| 4 | chapter | `04-deploy-open-webui` | 用 Docker Compose 启动 Open WebUI | RC | 已纳入 |
| 5 | chapter | `05-bootstrap-admin` | 创建首位管理员，公开前先收紧注册 | RC | 已纳入 |
| 6 | chapter | `06-connect-model-provider` | 接入第一个 OpenAI-compatible 模型 | RC | 已纳入 |
| 7 | chapter | `07-publish-with-tunnel` | 用独立子域名发布 AI 对话入口 | RC | 已纳入 |
| 8 | chapter | `08-first-conversation` | 完成第一次真实对话并核对完整路径 | RC | 已纳入 |
| 9 | chapter | `09-users-and-privacy` | 管理用户、聊天记录、附件与隐私边界 | RC | 已纳入 |
| 10 | chapter | `10-backup-and-update` | 备份、更新、验证与恢复 | RC | 已纳入 |
| 11 | chapter | `11-troubleshooting` | 页面能开但模型不回答：逐层排查 | RC | 已纳入 |
| 12 | chapter | `12-maintenance-handoff` | 巡检、撤销、下线与下一册交接 | RC | 已纳入 |
| 13 | appendix | `appendix` | 附录：环境变量、命令、错误地图与 Ollama 路径图 | RC | 已纳入 |
| 14 | sources | `sources` | 资料来源与校订记录 | RC | 已纳入 |

## 当前完整性判断

- 计划与已建立内容单元：15 / 15；全部 `draft: false`；
- 发布候选内容单元：15；
- 计入完成率的正式章节：第 1—12 章，共 12 篇；
- production、Pagefind 与正式打印：15 个第五册内容单元已启用；全站为 88 个 HTML、75 个 Pagefind 内容页和 5 个打印页；
- 实机：G1—G8 全部通过；固定版本、回环源站、认证、单模型、公开路径、故障恢复、备份恢复和永久清理均有脱敏证据；
- 模型：最终 2 次合成请求、97 tokens、费用低于 0.01 元；专用 key 已撤销，没有充值或订阅；
- 真实模型调用：G4—G5 各执行一次固定合成短提示；
- 费用：第五册 VPS 已永久销毁，临时计算不再持续计费；Cloudflare 保持 Free；已发生小时费 / 税费账单行可能延迟出现；
- 清理：route、自动 DNS、连接、key、容器、network、两个 volume、Secret、备份、connector、Tunnel、临时防火墙规则和 VPS 均已删除；根 zone、nameserver 与 DNSSEC 保留；
- RC 自动验收：172 项单元测试、88 个 HTML、75 个 Pagefind 内容页、2604 条内部链接、156 个 Playwright 用例（76 通过、80 按条件跳过）、20 个第五册搜索样本、无障碍与四项 Lighthouse 100 分；
- PDF：A4、133 页、约 4.8 MiB，133 页均完成渲染复核；
- 当前剩余：提交、GitHub Pages 部署和线上冒烟验证。
