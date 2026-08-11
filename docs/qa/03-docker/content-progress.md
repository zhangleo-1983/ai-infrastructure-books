# 第三册正文进度

校订日期：2026-08-11

## 当前阶段

三个样章已经由项目 Owner 确认，正式章节第 1—12 章、附录和资料来源均已完成；第 3—12 章已在隔离
Ubuntu 24.04 amd64 VPS 连续实测。第三册当前进入 `1.0.0-rc.1` 发布候选，production、Pagefind、
完成状态和公开打印路由均已启用；中文搜索、A4 PDF、跨浏览器、无障碍和子路径部署模拟
已经留下实际验收记录。

## 内容单元

| Order | 类型 | Slug | 标题 | 写作状态 | 技术校订 | 实机验证 |
| ---: | --- | --- | --- | --- | --- | --- |
| 0 | introduction | `start` | 开始之前：先确认这台服务器适合练习 | 已完成 | 2026-07-28 | 2026-08-11 只读基线通过 |
| 1 | chapter | `01-why-docker` | Docker 到底解决什么问题？ | 已完成 | 2026-07-28 | 不需要 Docker |
| 2 | chapter | `02-image-and-container` | 镜像、容器、仓库和标签是什么？ | 已完成 | 2026-07-28 | 不需要 Docker |
| 3 | chapter | `03-install-docker` | 从官方软件源安装 Docker Engine | 已完成 | 2026-08-11 | 通过；修正 Compose 版本口径与临时容器清理 |
| 4 | chapter | `04-first-container` | 运行第一个容器，看懂 `docker run` | 已完成 | 2026-08-11 | 通过 |
| 5 | chapter | `05-container-lifecycle` | 启动、停止和删除：容器的生命周期 | 已完成 | 2026-08-11 | 通过 |
| 6 | chapter | `06-publish-ports` | 端口映射：容器怎样被访问？ | 已完成 | 2026-08-11 | 本机、SSH 隧道与公网不可达边界均通过 |
| 7 | chapter | `07-persist-data` | 数据放在哪里：volume 与目录映射 | 已完成 | 2026-08-11 | 通过；补充应用启动就绪边界 |
| 8 | chapter | `08-config-and-secrets` | 配置、环境变量与敏感信息 | 已完成 | 2026-08-11 | 通过 |
| 9 | chapter | `09-docker-compose` | 用 Compose 管理一套服务 | 已完成 | 2026-08-11 | 通过；Compose plugin 实测为 5.4.0 |
| 10 | chapter | `10-troubleshooting` | 看状态、读日志、定位常见故障 | 已完成 | 2026-08-11 | HTTP 403 故障注入与无重启恢复通过 |
| 11 | chapter | `11-update-backup-cleanup` | 更新、备份、恢复与安全清理 | 已完成 | 2026-08-11 | 通过；恢复请求加入有限就绪重试 |
| 12 | chapter | `12-handoff` | 整理 Compose 项目，进入下一册 | 已完成 | 2026-08-11 | 交接卡与最终对象清单通过 |
| 13 | appendix | `appendix` | 附录：命令地图、检查清单与术语表 | 已完成 | 2026-07-28 | 不适用 |
| 14 | sources | `sources` | 资料来源与校订记录 | 已完成 | 2026-07-28 | 不适用 |

## 第一批正文说明

本批完成第 1、2、4、5 章：

- 第 1 章不要求执行 Docker 命令，先建立 VPS、Engine、CLI、daemon、镜像和容器关系；
- 第 2 章拆解完整镜像引用、tag、digest、layer、多平台与来源审查；
- 第 4 章使用具名 `book03-hello` 展开 `docker run` 的完整链路；
- 第 5 章使用不发布端口的 `nginx:1.30.4-alpine` 演练生命周期；
- 所有容器删除操作先按固定名称核对，不使用 `rm -f` 或 prune；
- 第 5 章结束时练习容器已删除，镜像保留供第 6—9 章使用。

## 第二批正文说明

本批完成第 6、7、8 章：

- 第 6 章只把 Nginx 绑定到 `127.0.0.1:8080`，使用 SSH 本地端口转发从读者电脑查看；
- 第 6 章不提供云防火墙或 UFW 的开放命令，明确记录 Docker 发布规则可能绕开 UFW 常规判断；
- 第 7 章使用 `book03-web-data` 验证删除容器 A、创建容器 B 后数据仍然存在；
- 第 7 章使用 `$HOME/docker-labs/bind-web` 和 `readonly` 验证主机文件即时更新；
- 第 7 章保留 named volume 与主机目录，供第 9、11 章的项目和备份模型继续使用；
- 第 8 章只使用 `BOOK03_MODE=practice` 等普通示例值，不写入任何真实秘密；
- 第 8 章通过 `docker inspect` 证明环境变量可见，并区分 `.env`、`env_file` 与 Compose secret；
- 三章均不提供公网开放、volume prune、system prune、`down -v` 或敏感凭证命令。

第 6—8 章涉及公网暴露和数据删除边界，必须继续保留逐步成功状态、失败判断和安全停点。

## 第三批正文说明

本批完成第 10、11、12 章：

- 第 10 章使用“主机 → daemon → Compose 配置 → 容器 → 挂载 → 端口 → 请求”
  的固定顺序收集证据，不把 restart 当成通用诊断；
- 第 10 章通过暂时移动 `site/index.html` 注入可恢复故障，并在本章结束前恢复页面；
- 第 11 章先备份项目和教学 volume，再恢复到新 volume 实际请求，之后才进入更新与清理；
- 第 11 章区分 `compose pull` 与 `compose up`，记录更新前镜像 ID / digest；
- 第 11 章只为当前 service 配置 `local` 日志驱动及 `10m × 3` 限制，不改 daemon 全局设置；
- 第 11 章仅精确删除已备份并验证恢复的教学 volume，不提供批量 prune 或 `down -v`；
- 第 12 章整理 `HANDOFF.md`，覆盖项目、镜像、端口、挂载、备份、维护入口与已知边界；
- 交接卡只记录敏感信息的位置和负责人，不记录 IP、密码、私钥、token、UUID 或订阅 URL；
- 主 Compose service 保持运行并只监听 `127.0.0.1:8080`，没有新增公网入口。

## 第四批正文说明

本批完成附录和资料来源：

- 附录按 Docker Engine、镜像、容器、存储和 Compose 对象整理常用命令；
- 附录覆盖 run / Compose 对照、端口检查、存储选择、更新清单、危险命令、排错树、
  交接字段、Docker Desktop / Dockerfile 最小认读和 32 个术语；
- 危险命令只在表格中用于识别，不提供 `CodeBlock` 或复制按钮；
- 资料来源按安装、概念、网络、存储、Compose、安全、日志和维护分类；
- 外部技术链接只使用 Docker 与 Ubuntu 官方域名；
- 资料来源明确区分官方文档校订、隔离 VPS 实机验证和发布候选状态；
- `npm run check:content:book03` 固定校验 15 个内容单元和安全边界。

## RC 之后的建议

第三册 15 个内容单元、隔离 VPS 命令链和 RC 验收已经完成。下一批不再扩大命令范围，应：

1. 保持第 6 章回环地址与 SSH 隧道主线，不增加公网 8080 演示；
2. 由作者审阅本轮最小正文修正、`vps-validation.md` 与 `release-candidate.md`；
3. 确认是否接受 Pagefind 对“端口映射”连续中文短语的已知分词边界；
4. 若接受本轮结果，再单独授权 Git 提交、版本标签和部署；
5. 正式版发布前邀请少量零基础读者试读，不在 RC 阶段继续增加主要功能。
