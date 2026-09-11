# 第五册 `1.0.0-rc.1` 综合验收

校订日期：2026-09-11

当前结论：发布候选已通过本地综合验收，等待提交、GitHub Pages 部署与线上冒烟确认。

## 范围

- “开始之前”、第 1—12 章、附录与资料来源，共 15 个内容单元；
- `draft: false`，书籍状态 `release-candidate`，版本 `1.0.0-rc.1`；
- production、Pagefind、完成状态与整册打印全部启用；
- G1—G8 实机与永久清理结果以 `field-validation-results.md` 为准。

## 自动检查

| 检查 | 结果 |
| --- | --- |
| Astro typecheck | 90 个文件，0 errors、0 warnings、0 hints |
| ESLint | 通过 |
| Vitest | 13 个测试文件，172 项通过 |
| production build | 88 个 HTML 页面 |
| Pagefind | 75 个内容页；第一至第五册各 15 页 |
| 内容检查 | 系列、第一至第五册专用检查全部通过 |
| 内部链接 | 88 个 HTML、2604 条内部链接通过 |
| release readiness | 5 本可阅读书、75 个内容页、5 个打印页、唯一 title / h1、结构化数据、打印 noindex 与安全外链通过 |
| 依赖审计 | `npm audit` 为 0 vulnerabilities |
| diff | `git diff --check` 通过 |

RC 切换时发现并修复了两类结构问题：整册打印中四次复用路径图造成重复 ID；6 个章节完成清单仍使用旧属性名或缺少章节键。修复后 release readiness 与完整回归通过。

## 浏览器、响应式与无障碍

- Playwright 共收集 156 个用例；76 项执行并通过，80 项按测试中的浏览器条件跳过；
- Chromium、Firefox、WebKit 均通过第五册封面、15 项目录、正文导航、打印入口和无 JavaScript 排错正文；
- Chromium 在 375 × 667、390 × 844、768 × 1024、1280 × 800、1440 × 900 五档宽度无页面级横向溢出；
- 深色模式、`prefers-reduced-motion` 与打印浅色样式通过；
- 第五册代表页面的 WCAG A / AA 自动扫描为 0 项违规；全站语义与搜索弹层键盘关闭在三引擎通过；
- 20 / 20 个第五册中文搜索样本命中预期章节，打印页没有进入结果。

## 性能

对第 7 章 production 预览运行 Lighthouse：Performance、Accessibility、Best Practices、SEO 均为 100；FCP 1.1 秒、LCP 1.1 秒、CLS 0.003、TBT 0 毫秒。该结果是本机单次样本，不承诺所有设备或网络相同。

## 打印与 PDF

- 整册打印页为 `noindex,follow`，包含 15 个内容单元且没有重复 ID；
- 生成 `book05-v1.0.0-rc.1.pdf`：A4、133 页、约 4.8 MiB、PDF 1.4、未加密、无 JavaScript、无 OpenAction；
- 文本可提取约 104059 个字符；
- 133 页全部渲染为 PNG，无空白页；分四张接触表逐页检查，并以原始分辨率抽查封面、route 仿真、凭证表与资料来源末页；
- 未发现文字裁切、横向溢出、黑块、表格破损或不可读字形。

## GitHub Pages 子路径

使用 `SITE_URL=https://zhangleo-1983.github.io` 与 `BASE_PATH=/ai-infrastructure-books/` 重新构建；88 个 HTML、75 个 Pagefind 内容页、2604 条内部链接、canonical、sitemap 与 release readiness 全部通过。

## 安全与剩余边界

- 仓库只使用 `<LAB_DOMAIN>`、`<LAB_IPV4>` 等占位符；敏感模式扫描随提交前检查复核；
- 429、上游 timeout、普通用户与分享 UI、跨版本 migration、管理员密码与 Secret 轮换、Ollama 实机仍是明确未覆盖项；
- G8 已清空第五册临时外部对象。根 zone、nameserver、DNSSEC 与域名续费责任按范围保留；
- 线上发布状态只有在 GitHub Pages workflow 成功且公开 URL 冒烟通过后才能改为“已发布”。
