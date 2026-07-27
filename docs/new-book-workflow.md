# 新书工作流程

校订日期：2026-07-27

## 1. 先规划，不先生成正文

开始一本新书前先确认：

- 目标读者和默认知识水平
- 这本书解决的核心问题
- 技术路线和安全边界
- introduction、正式章节、附录和资料来源的规划
- 哪些章节计入完成率
- 是否具有需要逐字对照的原型

不要先创建十几个空 MDX 文件。

## 2. 登记书籍

在 `src/data/books.ts` 中填写：

- `id`、`number`、`slug`
- 标题、副标题和简介
- `status`、`version`、`updatedAt`
- 封面摘要
- completion、search 和 print 配置

新书最初保持 `planned`。开始写作后可以改为 `drafting`；完成发布验收后才进入
`release-candidate` 或 `published`。

章节标题、章节 slug 和顺序不得写入注册表。

## 3. 使用脚手架

仅创建目录和 QA 台账：

```bash
npm run book:new -- --id 01-first-vps
```

需要起始草稿模板时显式指定：

```bash
npm run book:new -- --id 01-first-vps --with-introduction
npm run book:new -- --id 01-first-vps --with-introduction --with-chapter
```

脚本不会修改注册表，不会生成正式正文，也不会覆盖已有内容目录或 QA 目录。

## 4. 新增章节

每个章节一个 MDX，frontmatter 至少包含：

```yaml
---
book: "01-first-vps"
order: 0
slug: "start"
title: "开始之前"
shortTitle: "开始之前"
description: "用于页面、搜索和 SEO 的说明。"
chapterType: "introduction"
updatedAt: "2026-07-27"
draft: true
---
```

`order` 从 0 开始且连续，不能依赖文件名排序。正式章节增加 `chapterNumber`。
`slug` 不得使用 `print`，发布后不得随意修改。

## 5. 选择组件

先复用通用正文组件和浅层 mock-ui 组件。如果一个界面只在本书出现一次，可以在
`src/components/books/<book-id>/` 建立专用 Astro 组件。

书籍专属组件可以使用通用 Token 和 MockWindow，但不得依赖其他书籍的正文或敏感
示例值。

## 6. 建立本书检查

所有书籍必须通过：

```bash
npm run build
npm run check:content:series
npm run check:links
```

如果存在 HTML 原型、迁移台账或固定命令基线，再增加本书专属检查。第二册的
`check:content:book02` 是示例，但不应直接复制后只替换书名。

## 7. 验证搜索和打印

将 `search.enabled` 和 `print.enabled` 打开前，先确认：

- 搜索样本能进入正确章节
- 打印页内容类型和顺序正确
- 书籍专属组件在 A4 与无 JavaScript 环境下可读
- print 页面 noindex
- 没有与章节 slug 冲突

## 8. 避免影响其他书籍

- 不修改其他书籍的 MDX
- 不改变已经发布的 id、slug 和 order
- 通用组件改动必须运行第二册 E2E 与打印回归
- 内容校订与工程抽象分开提交
- 对全系列配置的修改必须检查根路径和部署子路径
