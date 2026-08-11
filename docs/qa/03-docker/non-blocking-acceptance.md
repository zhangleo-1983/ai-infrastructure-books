# 第三册非阻塞验收记录

验收日期：2026-07-30<br>
验收对象：本地草稿路由<br>
结论：通过，可继续进入实机命令校订准备；不等于发布候选通过

## 本次覆盖范围

本次只检查不依赖真实 VPS 的项目：

- 第三册封面、15 个内容单元和章节导航；
- 第 9 章复杂 Compose 页面；
- 375 × 667、390 × 844、768 × 1024、1280 × 800、1440 × 900；
- Chromium、Firefox、WebKit 的代表路径；
- 命令复制成功与失败反馈；
- JavaScript 关闭后的目录、正文、命令和打印内容；
- system 深色模式与 `prefers-reduced-motion`；
- 整册打印页面结构与打印媒体样式；
- 代表页面 WCAG A/AA 自动扫描；
- production、Pagefind 与公开路由隔离。

以下项目不在本次结论中：

- 第 3—12 章命令在真实 Ubuntu VPS 上的连续执行；
- 第三册进入 production 后的实际 Pagefind 中文结果；
- Chromium 或 macOS 系统链路生成的最终 PDF 文件；
- 第三册 RC 和正式发布。

## 自动化结果

第三册草稿 E2E 的运行方式：

```text
E2E_BASE_URL=http://127.0.0.1:4322/ E2E_BOOK03_DRAFT=1 \
  npx playwright test tests/e2e/book03-release.spec.ts
```

结果：

- 14 项通过；
- 16 项按设计跳过；
- 0 项失败。

跳过项只是在 Firefox、WebKit 中不重复 Chromium 专属的剪贴板注入、五视口矩阵、媒体模拟和
axe 扫描。三个浏览器均实际通过封面—Compose 章—导航—打印入口的代表路径，也均通过
JavaScript 关闭后的正文与打印内容检查。

本记录执行时，默认 `npm run test:e2e` 不会打开第三册草稿路由；当时的草稿验收文件后来随
第三册进入发布候选而更名为 `book03-release.spec.ts`。原草稿门禁只有在
`E2E_BOOK03_DRAFT=1` 时运行，避免绕过 production 发布门禁。

## 响应式与视觉边界

第 9 章在五种视口下的页面级横向溢出均不超过 1px：

| 视口 | 结果 |
| --- | --- |
| 375 × 667 | 通过 |
| 390 × 844 | 通过 |
| 768 × 1024 | 通过 |
| 1280 × 800 | 通过 |
| 1440 × 900 | 通过 |

代码块、终端和表格保持在正文宽度内；手机与平板目录可打开，Escape 可以关闭。系统深色
模式使用媒体查询生效，`--color-bg` 切换为深色 token；reduced-motion 下阅读进度动画
时长为零。

## JavaScript 关闭

Chromium、Firefox、WebKit 均确认：

- 第 9 章主标题和正文存在；
- 原生目录保持展开并可点击；
- 24 个代码块仍可阅读；
- 复制按钮隐藏，但命令文本可以手动选择；
- 整册打印路由包含全部 15 个内容单元；
- 打印正文不依赖 JavaScript。

## 打印与无障碍

本地打印路由确认：

- 15 个内容单元按 order 输出；
- `main` 中只有一个 `h1`；
- 页面级横向溢出为 0；
- 深色系统设置下，打印媒体仍使用白色纸张背景；
- 打印按钮在打印媒体中隐藏；
- 静态检查项显示为文本方框，不作为可点击表单控件；
- 页面不存在无标签 checkbox。

Chromium 对封面、第 3、9、10 章和整册打印页执行 WCAG A/AA 自动扫描，结果为 0 项违规。
最终 PDF 页数、分页和文件大小仍需在进入 RC 后单独记录。

## 验收中修复的问题

1. 第 11、12 章向 `ChapterChecklist` 传入了组件不支持的 `items`，且没有传入稳定的
   `chapterId`。已为组件增加浅层的多项清单支持，并补上
   `book03-chapter-11`、`book03-chapter-12`。
2. 附录和资料来源的静态方框使用 Markdown task list，会生成无标签的 disabled checkbox。
   已改为普通列表中的文本方框 `□`；文字和顺序没有变化。
3. Astro 开发工具栏的 Shadow DOM 含有额外标题，草稿测试的全局 `h1` 选择器会误报。
   测试改为只检查 `main h1`，不修改页面正文。
4. system 深色模式由 CSS 媒体查询实现，不要求写入 `data-theme="dark"`。测试改为核对
   `data-theme-mode="system"`、媒体查询和实际设计 token。

## 当时保留的门禁与后续状态

- 本记录执行时第三册所有 MDX 为 `draft: true`，书籍状态为 `drafting`；2026-08-11 已转为 `1.0.0-rc.1`；
- production 和 Pagefind 在本记录执行时关闭，现已进入 RC 验收；
- 实机命令校订已于 2026-08-11 单独完成，详见 `vps-validation.md`；实际搜索结果和最终 PDF 仍未完成；
- 不得把本记录解释为第三册 RC 已通过。
