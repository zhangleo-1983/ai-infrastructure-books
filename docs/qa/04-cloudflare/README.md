# 第四册 QA 目录

书籍：《让服务拥有域名：从 DNS 到 Cloudflare HTTPS》

书籍 ID：`04-cloudflare`

当前阶段：15 个内容单元已进入 `1.0.0-rc.1`；RC 实机校订 G1—G8、综合检查、正式打印、PDF、Git 标签、GitHub CI、Pages 部署和线上冒烟均已通过

本目录用于维护第四册独立的内容进度、样章审阅和技术事实校订。第四册没有单文件 HTML
原型，因此不使用第二册的逐段原型对照策略；它采用内容单元、frontmatter、命令、官方
来源、安全边界和人工审阅相结合的校验方式。

## 当前文件

- `content-progress.md`：15 个计划内容单元及当前迁移/写作状态；
- `sample-chapters.md`：三篇样章为什么被选中、验证什么、需要作者审阅什么；
- `first-batch.md`：第 1—5 章范围、事实边界、自动与浏览器检查结果；
- `second-batch.md`：第 6—10 章范围、跨章复核、事实边界与验证结果；
- `final-batch.md`：第 12 章、附录、资料来源、全书连续性与最终草稿验证；
- `fact-check.md`：Cloudflare、DNS、Tunnel、HTTPS 和 Caddy 的时效性事实台账。
- `field-validation-runbook.md`：隔离域名、临时 VPS、Tunnel 主线、Caddy 对照、操作闸门和清理闭环；
- `field-validation-results.md`：实机执行的脱敏结果台账；G1—G8 与阶段 1—9 已通过；
- `field-validation-handoff.md`：G8 后的脱敏退役状态、保留对象与费用闭环交接卡；
- `search-samples.md`：20 个中文/技术词 Pagefind 搜索质量样本与已知分词边界；
- `release-candidate.md`：第四册 production、跨浏览器、PDF、性能、安全与发布验收说明。

## 当前公开边界

- 书籍注册状态为 `release-candidate`，版本为 `1.0.0-rc.1`；
- 十五个内容单元 frontmatter 均为 `draft: false`；
- production build 生成第四册封面、15 个内容页和整册打印页；
- Pagefind 收录 15 个第四册正文页，完成状态只计算第 1—12 章；
- 正式打印已启用，A4 PDF 已完成 125 页全量渲染和代表页复核；
- 复用 Owner 已确认的空闲域名，不在仓库记录真实值；nameserver 与 DNSSEC 继续保留在 Cloudflare Free；教学 TXT、`app` / `caddy` DNS、published route、connector、Tunnel 与临时 VPS 已永久删除，计费附加资源均为空；
- 不记录真实域名、IP、账户、token、邮箱或凭证。

## 发布候选检查

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run check:content
npm run check:links
npm run check:release
npm run test:e2e
npm audit
git diff --check
```

进入下一 RC 或正式版前仍需要：

- 正文是否足够适合第一次接触 DNS 的读者；
- Tunnel 路由仿真是否清楚表达主机名与本机服务的关系；
- 第 11 章的分层排错是否比随机重启更容易执行；
- 手机端、无 JavaScript 和打印版是否仍可完整阅读；
- [x] 第三方注册商中的独立空闲域名已完成 NS / DNSSEC 校订且无业务；
- [x] 临时 VPS、Tunnel、公开 route、Caddy 对照和费用闭环均已完成；
- [x] 执行全过程只回填脱敏证据，真实域名、IP、UUID、token 与账户信息未进入仓库；
- 发布前重新运行根路径与 GitHub Pages 子路径检查；
- 下一 RC 复核控制台名称、官方命令、证书与错误边界的时效性；
- 邀请目标读者验证零基础理解路径。
