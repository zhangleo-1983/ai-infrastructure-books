# 内容编写指南

校订日期：2026-07-26

## 创建新章节

在 `src/content/books/<book-id>/` 新建一个 MDX 文件。文件名用于维护时辨认，正式 URL
由 frontmatter 的 `book` 与 `slug` 决定。复制同类型章节作为起点，但必须逐项检查
元数据，不得复制真实凭证。

```yaml
---
book: "02-overseas-network"
order: 15
slug: "stable-english-slug"
title: "页面主标题"
shortTitle: "目录短标题"
description: "用于页头、搜索摘要和 SEO 的一句话说明。"
chapterType: "chapter"
updatedAt: "2026-07-26"
sourceAnchor: "ch13"
chapterNumber: 13
duration: "预计 10 分钟"
labels:
  - "实操章节"
completionId: "book02-chapter-13"
draft: true
---
```

`chapterType` 可使用 `introduction`、`chapter`、`appendix`、`sources`。排序只看显式
`order`；不要依赖文件名。`slug` 发布后应视为稳定标识，因为 URL 和本地完成状态都依赖
它。技术命令、版本或外部事实复核后更新 `updatedAt`。

## 常用正文组件

提示框保持正文可读：

```mdx
<Callout type="warning" title="先确认风险">
  说明要做什么、为什么、成功状态和失败判断。
</Callout>
```

命令只写一次，组件用同一个值显示并复制：

```mdx
<CodeBlock
  label="Ubuntu，校订于 2026-07"
  code="apt update && apt install -y curl"
/>
```

不要另写一个“复制值”。多行命令可以把字符串放在 MDX 顶部的普通常量中，再传给
`CodeBlock`。

仿真界面优先用浅层组件直接表达信息结构：

```mdx
<MockWindow title="示例面板">
  <MockToolbar slot="toolbar">
    <MockStatusBadge>运行中</MockStatusBadge>
  </MockToolbar>
  <MockField label="端口">443</MockField>
</MockWindow>
```

界面只使用一次且结构特殊时可以写专用 Astro 组件。不要把整张界面转换成大型 JSON
配置，也不要声称仿真界面是软件当前版本的像素级截图。

## 校订与完整性

正文迁移或校订时同步更新 `docs/migration/book02-content-map.md`，记录原型位置、目标
文件、组件、是否修改文字及原因。运行：

```bash
npm run build
npm run check:content
npm run check:links
```

`check:content` 会对照原型数量、台账、15 个内容单元正文、命令和整册打印顺序。数量
通过不能替代人工逐段复核。

## 禁止写入仓库

- 真实 IP、密码、UUID、订阅 URL、私钥、Cookie 或访问令牌；
- 共享 Apple ID、破解软件、非官方安装包或绕过平台规则的方法；
- 未确认版权的截图、字体或图片；
- 把用户输入直接拼入 HTML 或脚本的代码；
- 未注明校订日期的易变命令、版本结论或外部事实。

IP 示例应使用 RFC 5737 文档保留网段，例如 `203.0.113.10`，并在正文明确说明不可照抄。
