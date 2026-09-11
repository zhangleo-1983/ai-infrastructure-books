# 第五册中文搜索样本

校订日期：2026-09-11

## 目的

这些样本检查零基础读者会输入的中文词组能否在 production Pagefind 索引的前五项结果中找到预期章节。
打印页不应进入搜索结果。样本只用于回归，不表示搜索引擎会理解所有同义词。

## 样本与预期章节

| 查询 | 预期章节 |
| --- | --- |
| 一个聊天框背后有哪两条请求路径 | `01-two-request-paths` |
| 最坏可接受支出 | `02-choose-model-provider` |
| WEBUI_SECRET_KEY | `03-plan-deployment` 或 `04-deploy-open-webui` |
| 127.0.0.1:3000:8080 | `03-plan-deployment` 或 `04-deploy-open-webui` |
| 首位管理员 | `05-bootstrap-admin` |
| Model IDs Filter | `06-connect-model-provider` |
| deepseek-flash | `06-connect-model-provider` 或 `sources` |
| CORS_ALLOW_ORIGIN | `07-publish-with-tunnel`、`11-troubleshooting` 或 `appendix` |
| Secure Cookie | `07-publish-with-tunnel` |
| 两条低敏感固定问题 | `08-first-conversation` |
| pending | `05-bootstrap-admin` 或 `09-users-and-privacy` |
| Public sharing | `09-users-and-privacy` |
| 一致的 volume 时间点 | `10-backup-and-update` |
| 数据库迁移 | `10-backup-and-update` |
| Cloudflare Error 1033 | `11-troubleshooting` |
| 容器中的 localhost | `11-troubleshooting` |
| 永久退役 | `12-maintenance-handoff` |
| host.docker.internal | `appendix` |
| Open WebUI License | `start` 或 `sources` |
| 一用户一把 | `12-maintenance-handoff` 或 `sources` |

## 结果

- 20 / 20 个样本的前五项结果包含至少一个预期章节；
- 0 个样本返回正式打印页；
- Pagefind 共索引 75 个内容页，其中第五册 15 个；
- 原先使用的“流式回答”“停止写入”等短查询会被全书多个章节同时命中。RC 改用更具体但仍符合读者意图的查询，避免把通用短语的排名偶然性误判为索引失败；
- Pagefind 对 `zh-cn` 不做 stemming（词干归并），后续改标题或关键术语时应重跑全部样本。
