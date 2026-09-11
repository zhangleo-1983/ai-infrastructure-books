# 第五册第 1—5 章第一批 draft 记录

授权日期：2026-08-23

状态：五篇 draft 已建立并通过自动、生产排除与浏览器验证；等待 Owner 复核

## Owner 授权与批次边界

Owner 已确认三篇代表性样章，并明确授权继续第 1—5 章第一批 draft。本批只完成：

- 第 1 章：浏览器访问路径与模型请求路径；
- 第 2 章：远程 OpenAI-compatible API 与本地模型的选择边界；
- 第 3 章：Compose project、固定版本、回环端口、volume、Secret 与回退规划；
- 第 4 章：固定 `v0.11.0` 的 Compose 部署步骤与安全回退；
- 第 5 章：SSH 本地转发、首位管理员、注册关闭与唯一用户验收。

本批不创建第 7—10、12 章、附录或资料来源，不进入 production、Pagefind、正式完成状态或正式打印。

## 外部操作边界

本批只写仓库 draft，没有执行以下操作：

- 没有拉取 Open WebUI 镜像、创建容器或 named volume；
- 没有创建管理员、用户、API key 或模型连接；
- 没有创建 Cloudflare route、DNS 记录或公开端口；
- 没有调用真实模型、购买额度、扩容 VPS、开通快照或付费备份；
- 没有记录真实域名、IP、邮箱、密码、Cookie、Secret、API key、Tunnel token 或资源 ID。

## 官方事实一校

2026-08-23 已从 Open WebUI 官方文档与官方 GitHub 核对：

- 最新非预发布 release 为 `v0.11.0`，发布于 2026-07-27；
- `main`、`latest` 与 `dev` 是滚动标签，固定 `vX.Y.Z` 适合可复现部署；
- 标准镜像服务端口为 8080，持久数据目录为 `/app/backend/data`；
- v0.11.0 官方 Dockerfile 提供 `/health` 容器健康检查；
- `WEBUI_AUTH` 默认 `True`；
- 首位注册用户成为管理员，随后 signup 自动关闭；
- 如果重新开放 signup，新用户默认角色为 `pending`；
- `ENABLE_SIGNUP` 与 `DEFAULT_USER_ROLE` 是 ConfigVar，界面保存值会持久化；
- 密码复杂度默认不强制，bcrypt 输入上限为 72 字节；
- `WEBUI_SECRET_KEY` 变化会使现有登录会话失效。

Quick Start 与 Hardening 对单实例自动生成 Secret 的持久化表述不完全一致，因此 draft 显式生成并持续保存 Secret，
同时把容器重建后的会话与数据行为保留为 RC 实机验收项。

## 成功合同

第一批验收必须证明：

- 8 篇第五册内容单元均保持 `draft: true`；
- 第五册注册表继续为 `drafting / 0.0.0`，搜索和正式打印关闭；
- production build 与 Pagefind 不包含第五册；
- 5 篇新 draft 都包含做什么、为什么、成功状态、失败判断、安全或费用边界；
- Compose 固定 `v0.11.0`、`127.0.0.1:3000:8080` 与 named volume；
- 不把 `docker compose down -v` 描述为普通回退；
- 首位管理员完成前不允许公开 route 或公网 3000；
- 375、768、1440 宽度、深色、无 JavaScript 与草稿打印保持可读；
- 仓库敏感模式扫描为 0。

## 检查结果

- `npm run check`：通过；Astro 0 errors / warnings / hints，ESLint 通过；
- Vitest：13 个测试文件、160 项测试通过，第五册专用测试 10 项；
- 内嵌 Compose YAML：解析通过，project、`127.0.0.1:3000:8080` 与 named volume 均符合合同；
- production：71 页，未生成第五册；Pagefind：60 页，未索引第五册；
- 内部链接：71 个 HTML、2075 个链接通过；
- `npm run check:release`：通过；`npm audit`：0 vulnerabilities；
- 375、768、1440：第 1—5 章 15 组与草稿打印页 3 组均无页面级横向溢出；
- 1440 深色模式：第 5 章与管理员仿真可读；浏览器控制台无 error / warning；
- JavaScript 边界：服务器原始 HTML 含五章共 67 个正文区块；
- 草稿打印页包含本批五章并保持 `noindex,follow`；正式 A4 PDF 留到 RC；
- 敏感模式扫描为 0；IP 只包含回环与通配监听教学地址；
- `git diff --check`：通过。

检查完成后必须停下等待 Owner 确认，不连续进入下一批。
