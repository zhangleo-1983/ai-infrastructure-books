# 工程架构

校订日期：2026-07-27

## 技术边界

本项目使用 Astro、TypeScript、MDX 和静态站点生成。正文页面在构建时输出为
HTML，不依赖客户端 JavaScript 才能阅读。

第一阶段不引入：

- React、Vue 等客户端框架
- 状态管理库
- 后端服务
- 用户系统
- 远程字体或必须联网加载的图片
- 与单一部署平台绑定的适配器

## 内容与组件

章节正文存放在 `src/content/books/<book-id>/`。每个章节使用一个 MDX
文件，普通段落保持 Markdown 可读；只有提示框、代码块、流程图和仿真界面使用
显式组件。

每个文件通过 frontmatter 显式记录书册、顺序、稳定 slug、标题、章节类型、校订日期和
草稿状态。URL 使用 `slug`，不依赖文件系统排序。

仿真界面采用浅层组合：

- 可以共享窗口、侧栏、字段、状态和操作栏等基础组件。
- 不使用复杂配置 JSON 描述整张界面。
- 单次使用且结构特殊的界面允许保留为专用 Astro 组件。

## 路由

稳定 URL 由书籍注册表的 `slug` 和章节 frontmatter 的 `slug` 组成：

```text
/books/[book]/
/books/[book]/[chapter]/
/books/[book]/print/
```

`src/data/books.ts` 保存书籍级配置，章节标题、顺序和 slug 仍只保存在 MDX。
只有可阅读且具有内容的书籍生成静态页面，计划书籍不生成空白入口。第二册现有 URL
保持不变。

`BASE_PATH` 用于 GitHub Pages 子路径部署；业务组件不得自行拼接部署前缀。

## 渐进增强

主题切换、复制、目录抽屉、搜索和本地完成状态属于增强功能。关闭 JavaScript
后，标题、正文、链接、代码和两种平台的操作说明仍须可阅读。

第二章的平台差异使用原生静态面板：HTML 默认同时输出 Mac 和 Windows 正文，客户端
脚本成功运行后才启用标签切换。打印时两套正文强制同时显示。

## 客户端脚本边界

交互按职责拆分为 `theme.ts`、`search.ts`、`reading-progress.ts`、
`chapter-status.ts`、`copy.ts` 和 `mobile-toc.ts`。公共存储键与时长常量集中在
`constants.ts`，不使用前端框架或全局状态库。

Pagefind 只索引章节页中带 `data-pagefind-body` 的正文。打印页、404、封面目录和站点导航
不会进入索引。搜索资源只有在用户打开搜索后才动态加载。

## SEO 与部署

`SITE_URL` 是可选的公开站点地址；配置后生成 canonical、Open Graph URL、robots
sitemap 声明和 sitemap 文件。`BASE_PATH` 负责 GitHub Pages 项目子路径，所有站内链接
必须经过 `sitePath()`，客户端状态只使用书号与章节 slug，不依赖部署路径。

章节输出 `TechArticle` 或 `Article` JSON-LD，书籍封面输出 `Book` JSON-LD。整册打印页
使用 `noindex,follow`，避免与章节页形成重复索引。

## 当前状态

Milestone 1—5 已完成；系列级注册表、通用封面、章节、完成率和打印路由已经建立。
第一册与第二册均已接入公开 Release Candidate。第二册继续作为跨浏览器、打印 PDF、
可访问性和原型正文的严格回归基线；第一册采用无原型内容基线、教学仿真与时效性事实
台账。

更完整的多册边界见 `docs/series-architecture.md`。
