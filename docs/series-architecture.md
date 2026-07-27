# 系列级工程架构

校订日期：2026-07-27

## 目标

同一套 Astro、MDX、组件、搜索、完成状态和打印能力服务整个
《AI 基础设施从零开始》系列。新增书籍时不复制第二册的路由、目录、SEO 或打印逻辑。

第二册仍是当前严格回归基线。系列抽象不得改变其稳定 URL、正文、Pagefind 索引、完成
状态 key 和打印内容顺序。

## 三类数据来源

### 书籍注册表

`src/data/books.ts` 是书籍级信息的唯一来源。每本书登记：

- 稳定 `id`、书号和 URL `slug`
- 书名、副标题、简介、状态、版本和校订日期
- 封面摘要
- 完成率规则
- 搜索范围
- 打印范围

`id` 用于 Content Collection 关联和 localStorage，发布后不得修改。`slug` 用于 URL，
发布后同样视为稳定标识。二者当前可以相同，但职责不同。

注册表不保存章节标题、章节 slug、章节顺序或章节号。

### Content Collection

章节元数据来自 `src/content/books/<book-id>/*.mdx` 的 frontmatter。所有书籍共用
`src/content.config.ts` schema，通过 `book`、`order`、`slug` 和 `chapterType` 识别。

Content Collection 内部 ID 使用“书籍目录 + 文件名”生成，不使用全系列可能重复的公开
`slug`。因此不同书籍都可以使用 `start`、`appendix` 或 `sources`，公开 URL 仍只由书籍
slug 与章节 frontmatter slug 决定。

内容目录规划为：

```text
src/content/books/
├── 01-first-vps/
├── 02-overseas-network/
├── 03-docker/
├── 04-cloudflare/
├── 05-open-webui/
├── 06-dify/
├── 07-n8n/
└── 08-supabase/
```

第一册与第二册目录已经建立。其余目录不会在内容规划开始前批量创建。

### 书籍专属资产

原型、迁移台账、搜索样本、仿真界面和严格内容基线可以按书籍保留。它们不进入通用
注册表，也不要求每本书采用相同的迁移策略。

## 通用路由

以下静态页面都由书籍注册表和 Content Collection 生成：

```text
/books/[book]/
/books/[book]/[chapter]/
/books/[book]/print/
```

只有状态为 `release-candidate` 或 `published`、且具有非草稿内容的书籍生成正式入口。
计划中的书籍只显示在书目规划中，不生成空白封面或章节页面。

章节 slug `print` 是保留值，不得使用。

## 完成状态

注册表的 `completion.eligibleChapterTypes` 决定哪些内容计入完成率。默认只计算
`chapter`，不计算 introduction、appendix 和 sources。

浏览器继续使用：

```text
ai-infrastructure-books:reading-state:v1
```

数据仍按稳定书籍 id 和章节 slug 存放。第二册 id 保持
`02-overseas-network`，已有用户状态无需迁移。

## 搜索

注册表的 `search.enabled` 和 `search.indexedChapterTypes` 决定哪些章节输出
`data-pagefind-body`。Pagefind 仍在 production build 后统一生成静态索引。

封面、目录、打印页和 404 不进入索引。第一册与第二册当前各有 15 个正文索引页；
第二册严格回归继续单独锁定其 15 个入口。

## 打印

注册表的 `print` 配置决定是否生成打印页、包含哪些章节类型以及是否 noindex。通用打印
路由按显式 `order` 输出封面、目录和正文，允许 MDX 使用书籍专属组件。

打印正文不依赖 JavaScript，交互控件通过统一打印样式排除。

## 检查分层

```text
系列级检查
├── 注册表字段与唯一性
├── 内容目录与注册表关联
├── frontmatter 完整性
├── slug 和 order 唯一性
├── order 连续性
├── 保留路由
└── 敏感凭证与复制单一来源边界

第一册内容检查
├── 15 个内容单元与显式顺序
├── 正文区块、提示框和仿真界面基线
├── 命令单一来源
├── 购买交付与第二册衔接
└── 敏感数据与时效性边界

第二册严格检查
├── HTML 原型数量基线
├── 迁移台账
├── 逐章正文与命令
├── 目录顺序
├── 15 个搜索正文页
└── 15 个打印内容单元
```

没有 HTML 原型的新书使用系列级检查和该书自行定义的内容基线；第一册即采用此策略。

## 组件边界

以下内容适合共享：

- Layout、目录、章节导航、完成状态和打印结构
- Callout、CodeBlock、FlowDiagram 等正文组件
- MockWindow、MockField、MockToolbar 等浅层仿真基础

以下内容可以书籍专属：

- 只出现一次的复杂仿真界面
- 与某一本书技术方案绑定的字段关系
- 原型迁移适配和严格文字对照

不要为了复用率把正文或仿真界面转换成大型配置 JSON。
