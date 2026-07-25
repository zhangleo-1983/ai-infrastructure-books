# 工程架构

校订日期：2026-07-25

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

稳定 URL 由书号、英文书名和章节序号组成：

```text
/books/02-overseas-network/
/books/02-overseas-network/start/
/books/02-overseas-network/01-after-vps/
/books/02-overseas-network/02-login-server/
```

`BASE_PATH` 用于 GitHub Pages 子路径部署；业务组件不得自行拼接部署前缀。

## 渐进增强

主题切换、复制、目录抽屉、搜索和本地完成状态属于增强功能。关闭 JavaScript
后，标题、正文、链接、代码和两种平台的操作说明仍须可阅读。

第二章的平台差异使用原生静态面板：HTML 默认同时输出 Mac 和 Windows 正文，客户端
脚本成功运行后才启用标签切换。打印时两套正文强制同时显示。

## 里程碑

当前完成 Milestone 2：浅层核心组件，以及“开始之前”、第 1 章和第 2 章的试迁移。
第 3 章及后续内容未经项目 Owner 确认不得迁移。
