# 静态搜索

校订日期：2026-07-26

搜索使用 Pagefind，在 `npm run build` 的第二步从 `dist/` 生成静态索引。开发服务器不会
生成索引；验证搜索必须使用：

```bash
npm run build
npm run preview
```

只有章节页中带 `data-pagefind-body` 的正文进入索引。整册打印页、404、封面目录、站点
导航与完成控件被排除，避免重复内容。结果显示书名、章节/小节标题和匹配摘要，并可用
方向键与 Enter 打开。摘要只保留 Pagefind 的文字和 `mark` 高亮，不直接注入返回的
HTML。

Pagefind 的 `zh-cn` 模式不支持 stemming。当前 16 个固定样本中，15 个能在首批结果
命中预期内容；“私钥”仅出现在仿真字段说明时没有结果。这个边界记录在
`docs/qa/book02-search-samples.md`，不为它引入后端搜索服务。
