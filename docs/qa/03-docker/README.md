# 03-docker QA 台账

本目录用于记录第三册的内容完整性、技术事实、样章、搜索、打印与发布验收。

- [x] 书籍注册表已进入 `release-candidate`，版本为 `1.0.0-rc.1`
- [x] 书名、章节规划与完成率规则已确认
- [x] 首个样章确定为第 9 章 Compose
- [x] 第 9 章样章已完成，作者同意继续编写
- [x] 第 3 章安装样章已完成
- [x] “开始之前”样章已完成
- [x] 三个样章通过作者集中审阅
- [x] 第一批正文第 1、2、4、5 章已完成
- [x] 第二批正文第 6—8 章已完成
- [x] 第三批正文第 10—12 章已完成
- [x] 附录与资料来源已完成
- [x] 内容完整性策略已确认
- [x] 本地非阻塞验收已完成
- [x] 第 3—12 章命令链与主要技术事实已在隔离 VPS 校订
- [x] production、Pagefind、完成状态和打印路由已启用
- [x] 搜索预期样本与 production Pagefind 实际结果已验收（见 `search-samples.md`）
- [x] 打印与 PDF 已验收
- [x] 发布候选检查已完成（见 `release-candidate.md`）

当前已创建“开始之前”、第 1—12 章、附录与资料来源，共 15 个内容单元。全部内容单元为
`draft: false`，书籍注册表状态为 `release-candidate`；production build 会生成第三册封面、
15 个正文页和整册打印页，Pagefind 只索引 15 个正文页。

`tests/unit/book03-content.test.ts` 固定检查 15 个内容单元、显式 order、12 个完成项、
附录范围、官方来源域名、安全命令边界和发布候选状态。`tests/unit/book03-qa.test.ts`
检查实机台账覆盖范围、跨章状态和中文搜索实际结果。

详见 `sample-chapters.md`。

正文批次与实机验证状态见 `content-progress.md`。

实机验证结果见 `vps-validation.md`；搜索样本和 production Pagefind 实际结果见
`search-samples.md`；完整 RC 结果见 `release-candidate.md`。

响应式、跨浏览器、无 JavaScript、打印媒体和无障碍的早期草稿验收历史见
`non-blocking-acceptance.md`，当前发布候选结果以 `release-candidate.md` 为准。
