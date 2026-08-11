# 新增第三册时的操作说明

校订日期：2026-07-28

本文件最初用于第三册的工程准备，现在保留为历史执行说明。第三册的内容规格与章节
大纲见 `docs/planning/book03-content-spec.md`；“开始之前”、第 1—12 章、附录和资料来源
均已完成并进入 `1.0.0-rc.1` 发布候选；本文件不再作为当前门禁状态来源。

系列级通用流程已经整理到 `docs/new-book-workflow.md`；后续实机校订和发布准备应优先
遵循该文件、`docs/series-architecture.md` 和 `docs/qa/03-docker/`。以下条目保留为
第三册的历史规划提示。

1. 在 `src/data/books.ts` 确认第三册书号、稳定 slug、标题和状态。
2. 在 `src/content/books/<book-id>/` 建立内容目录与带显式 `order` 的 MDX。
3. 复用内容 collection schema；如需新章节类型，先评估对目录、完成率、打印和 SEO 的
   影响。
4. 建立书册数据适配层，不复制第二册已迁移章节的核心元数据。
5. 建立封面与打印路由，目录必须从内容集合生成。
6. 仅在内容确实需要时增加浅层组件；不要建立大型仿真 JSON 系统。
7. 建立该册的迁移台账、内容完整性基线、固定 URL 和搜索样本。
8. 明确定义哪些章节计入完成率，以及 localStorage 中使用的稳定书号和 slug。
9. 验证 root 与子路径构建、Pagefind 去重、打印 PDF、三浏览器和固定视口。
10. 更新 README、architecture、设计系统与部署文档。

不得从第二册复制 UUID、订阅 URL、私钥、账号密码等任何示例凭证。
