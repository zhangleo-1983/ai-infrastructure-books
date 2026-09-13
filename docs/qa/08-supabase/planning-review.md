# 把数据接进应用：Supabase 从数据库到认证：规划与样章记录

状态：选读路线 draft；云端实机验证待完成，欢迎读者按 runbook 自主验证并共建。

## 读者结果
面向零基础用户理解表、行、策略、认证和对象存储，并完成一个受控的练习应用数据层。

## 学习主线
Postgres、表与关系、Row Level Security、认证、对象存储

## 章节规划

1. `01-what-supabase-does`：**Supabase 在应用中负责什么**。分清数据库、认证、存储和 API 的边界。
2. `02-plan-project-and-cost`：**先规划项目、区域与费用**。用合成资料和低风险设置规划练习项目。
3. `03-create-project`：**创建项目并确认连接边界**。创建练习项目，记录项目 URL、区域和停止条件。
4. `04-model-first-table`：**建立第一张表**。把报名资料设计成可解释的字段和行。
5. `05-relations-and-queries`：**理解关系与查询**。用主键、外键和筛选读取关联数据。
6. `06-row-level-security`：**用 RLS 保护每一行**。理解行级安全策略及其失败表现。
7. `07-auth-users`：**建立认证与用户身份**。区分登录身份、用户资料和服务角色。
8. `08-connect-frontend`：**让前端安全读取数据**。使用公开 anon key 的边界与环境变量。
9. `09-storage-files`：**使用 Storage 保存文件**。建立桶、路径和下载权限的最小方案。
10. `10-edge-functions-webhooks`：**理解函数与 Webhook**。识别何时需要服务端函数及签名校验。
11. `11-backup-and-migrations`：**备份、迁移与恢复**。把 schema、数据和密钥分开记录。
12. `12-maintenance-retirement`：**维护、排错与退役**。建立日志、费用检查和删除项目清单。

## 实机与发布闸门
文本完成后再建立 G1—G8 实机 runbook；在实机、生产构建、搜索、打印和线上冒烟全部通过前，保持 `draft: true`。


## 路线说明

本册保留为原第八册选读内容，不属于新的第六至第十册主线；云端 Supabase 项目创建受 Free 配额限制，实机结果以 `docs/qa/08-supabase/field-validation-results.md` 为准。
