# Milestone 5 发布候选验收记录

验收日期：2026-07-26

## 结论

第二册建议标记为 release candidate。正文未在本阶段改写；内容完整性脚本仍确认 15 个
内容单元与原型逐章正文、命令和顺序一致。

## 浏览器与视口

- Playwright 1.62.0：Chromium 151、Firefox 153、WebKit 26.5 关键路径通过。
- 固定视口：375×667、390×844、768×1024、1280×800、1440×900 无页面级横向溢出。
- 关闭 JavaScript：正文、目录、Windows/macOS、代码和故障排查可读。
- axe WCAG A/AA：第二章及封面、第 5 章、第 11 章、打印页无自动化违规。

## 搜索

16 个样本中 15 个在首批结果命中预期内容，均不包含 print 页。“私钥”是已知
Pagefind `zh-cn` 边界，详见 `book02-search-samples.md`。

## 打印与 PDF

- Chromium A4 PDF：35 页，2,749,289 字节。
- Poppler 渲染 35 页后未发现空白异常页、正文截断、横向溢出、深色背景或网页控件。
- WebKit print media：15 个内容单元、Windows/macOS 面板均可见，宽度 794/794，
  页头与打印工具栏隐藏，背景为白色。
- Chromium 生成的 PDF 未带 tagged PDF 语义，这是当前浏览器导出链路的已知边界。

## 性能

第 5 章手机 Lighthouse：Performance / Accessibility / Best Practices / SEO 均为 100；
FCP 0.9s、LCP 0.9s、TBT 0ms、CLS 0.017。第二册封面桌面四项均为 100。

第 5 章首屏传输约 20,397 字节；项目客户端 JavaScript 为 12,115 字节原始、
4,729 字节 gzip。`_astro` CSS 为 17,227 字节原始、4,239 字节 gzip。Pagefind 目录
总计 614,117 字节，只有打开搜索后才加载；首个查询观察到主脚本与 worker 合计约
25,577 字节传输。

## 部署模拟

使用 `BASE_PATH=/ai-infrastructure-books/` 与测试 `SITE_URL` 完成 GitHub Pages
项目子路径模拟。章节、Pagefind、print、favicon、robots、sitemap、深层 404、
canonical 和本地完成状态路径独立性通过。未创建远程仓库、未推送、未正式发布。

后续状态更新（2026-07-27）：第二册已经提交并标记
`book02-v1.0.0-rc.1`，当前由 `main` 发布到公开 GitHub Pages。上述“未正式发布”
保留为 Milestone 5 验收当时的历史状态。

## 已知问题

1. Pagefind 对仅出现在仿真字段中的“私钥”无结果。
2. Chromium PDF 不带 tagged PDF 语义。
3. 当前使用 GitHub Pages 项目子路径；自定义域名以及 Cloudflare Pages / Vercel
   迁移已经明确暂缓。
