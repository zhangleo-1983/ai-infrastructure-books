# 第七册选题与整册内容规格

状态：策划草案，等待 Owner 确认书名、主线和三篇样章组合。

策划日期：2026-09-11。书籍 ID：`07-n8n`。当前注册表仍为 `planned / 0.0.0`，本文件不代表已开始生产写作或外部部署授权。

## 1. 定位与前册衔接

第五册讲自托管 AI 对话入口，第六册讲 Dify 工作流与知识库；第七册继续讲“跨工具自动化”，重点是触发器、节点、凭证、执行记录和失败恢复。本册不承诺替读者经营业务，也不把真实账号、付款、邮件群发或生产系统写入作为默认练习。

目标读者已经能管理 Ubuntu VPS、Docker、域名和受控 HTTPS 入口，但第一次接触 n8n。每个步骤必须标明是在电脑、VPS SSH 终端、n8n 管理界面还是第三方控制台完成，并写出目的、成功状态、失败判断和停止位置。

## 2. 推荐书名与案例

推荐书名：**《把重复工作连起来：n8n 自动化流程入门》**。

贯穿案例使用完全合成的“活动报名整理器”：手动触发或 Webhook 接收一条报名文本，经过字段清理、条件判断和结果分支，写入本地练习表格或返回结构化摘要。第一版只在本地或受控测试入口运行，不发送邮件、不写入真实 CRM、不调用真实客户数据。

备选书名：

1. 《n8n 从触发器到执行记录》：更偏工具结构，案例吸引力较弱。
2. 《让重复工作自动运行：n8n 自托管与维护》：覆盖运维，但容易承诺无人值守。

## 3. 推荐技术主线

- 官方 Docker / Docker Compose 自托管，固定实际 n8n 版本和镜像摘要；不写未经核验的一键脚本。
- 单用户、单工作区、单个低风险练习工作流；先手动执行，再讨论 Webhook。
- 数据库与凭证加密边界必须单独说明；`N8N_ENCRYPTION_KEY`、所有权和备份不能混为普通环境变量。
- 通过 Cloudflare Access 与 Tunnel 保护管理入口；Webhook 公开路径若需要，必须另设最小权限和签名校验，不能把登录保护误当作 webhook 保护。
- 默认使用内置节点；社区节点、Code 节点、Execute Command 和文件系统节点列为高风险扩展，不进入第一版主线。
- 执行记录、失败重试、并发和队列模式先解释概念；只有实机证据支持时才写具体性能或费用结论。

官方初核来源：n8n Docker / Docker Compose 部署文档、Workflows 与 Executions 文档、凭证与加密配置、Security Audit、Queue mode，以及 Sustainable Use License。正式写作前重新核对版本、环境变量和授权条款。

## 4. 15 个内容单元

| Order | 类型 | 建议 slug | 标题 |
| ---: | --- | --- | --- |
| 0 | introduction | `start` | 开始之前：先确认自动化边界与测试数据 |
| 1 | chapter | `01-what-is-n8n` | n8n 在自动化流程中负责什么 |
| 2 | chapter | `02-triggers-and-nodes` | 触发器、节点和数据怎样往下走 |
| 3 | chapter | `03-plan-self-hosting` | 规划版本、数据、凭证与费用 |
| 4 | chapter | `04-deploy-n8n` | 用官方 Compose 启动 n8n |
| 5 | chapter | `05-bootstrap-workspace` | 创建工作区并收紧访问 |
| 6 | chapter | `06-build-first-workflow` | 做一个手动触发的报名整理流程 |
| 7 | chapter | `07-transform-and-branch` | 清理字段并用条件节点分支 |
| 8 | chapter | `08-credentials-and-http` | 凭证、HTTP 请求与最小权限 |
| 9 | chapter | `09-webhook-safely` | 受控 Webhook：公开入口前先定义边界 |
| 10 | chapter | `10-executions-and-errors` | 从执行记录定位失败与重试 |
| 11 | chapter | `11-backup-update-restore` | 备份、更新和同版本恢复 |
| 12 | chapter | `12-maintenance-retirement` | 日常巡检、停用与费用清理 |
| 13 | appendix | `appendix` | 附录：节点、表达式、错误地图与风险清单 |
| 14 | sources | `sources` | 资料来源与版本校订记录 |

正式完成率只计第 1—12 章。每章都要说明成功状态、失败判断和下一步；不把“流程看起来执行成功”当作外部系统已写入的证据。

## 5. 三篇样章候选

1. `00-introduction.mdx`：验证零基础读者能否区分自动化、脚本和外部系统写入。
2. `06-build-first-workflow.mdx`：验证节点连线、输入输出和执行记录是否能讲清楚。
3. `09-webhook-safely.mdx`：验证公开 Webhook 与管理入口、签名、重放和最小权限边界。

样章确认前不创建正式内容目录，不切换书籍注册表状态，不启用 production、搜索或打印。

## 6. 风险与验收闸门

后续实机拟采用 G1—G8：资源与版本盘点、隔离部署、工作区初始化、最小工作流、受控 Webhook、故障恢复、备份恢复、专用资源清理。必须逐门记录版本、实际请求、费用、恢复和未覆盖项；不复用前册凭证或“已通过”结论。

重点未覆盖候选：社区节点供应链、Code/Execute Command 主机权限、第三方 OAuth 轮换、队列扩容、跨版本迁移、真实业务数据和高并发性能。任何进入正文主线的扩展都需要单独事实复核和 Owner 确认。
