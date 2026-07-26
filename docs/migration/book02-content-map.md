# 第二册迁移台账

校订日期：2026-07-25

本台账以 `source/book02-v1.html` 为内容基准。每次迁移必须更新“迁移状态”、
“文字修改”和“原因”。正文不要求逐字符一致，但任何删减、合并或重写都必须显式记录。

状态定义：

- 未迁移：只登记目标，尚未写入正式内容。
- 已迁移：正文和对应组件已经写入目标文件。
- 已核对：已与原型逐段复核。

| 原型锚点或区块 | 区块名称 | 目标章节文件 | 目标组件 | 迁移状态 | 文字修改 | 原因 | 校验结果 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `#cover` | 第二册封面 | 正式封面页 / 整册打印页 | `BookCover` | 已核对 | 有替换和新增 | 工程化后将“完整 HTML v1.0”改为“在线版”，并从内容集合显示精确到日的校订日期；按 Milestone 3 验收补充“适合谁、完成收获、阅读准备、开始阅读、整册打印”。原型书名、副标题、技术路径与册号均保留 | 核心文案核对通过 |
| `#intro` | 开始之前 | `00-introduction.mdx` | MDX、`LearningGoals`、`Callout` | 已核对 | 否 | — | 正文对照通过 |
| `#ch1` | 第 1 章章首 | `01-after-vps.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `#ch1-map` | 完整工作链路 | `01-after-vps.mdx` | `FlowDiagram`、`ConceptList`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文对照通过 |
| `#ch2` | 第 2 章章首 | `02-login-server.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `#ch2-ssh` | SSH 与 Terminal | `02-login-server.mdx` | `FlowDiagram`、`ComparisonTable`、`Callout` | 已核对 | 否 | — | 正文对照通过 |
| `#ch2-login` | 第一次登录 | `02-login-server.mdx` | `PlatformTabs`、`InstructionStep`、`TerminalMock`、`CodeBlock`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文与命令对照通过 |
| `#ch3` | 第 3 章章首 | `03-understand-3x-ui.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `#ch3-panel` | 3X-UI、Xray 与节点 | `03-understand-3x-ui.mdx` | `InfoGrid`、`MockWindow`、`MockSidebar`、`MockStatusBadge`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文对照通过 |
| `#ch4` | 第 4 章章首 | `04-install-3x-ui.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `#ch4-install` | 执行安装 | `04-install-3x-ui.mdx` | `CodeBlock`、`TerminalMock`、`Callout` | 已核对 | 否 | — | 正文与命令对照通过 |
| `#ch4-login` | 登录面板 | `04-install-3x-ui.mdx` | `MockWindow`、`MockField`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文与命令对照通过 |
| `#ch5` | 第 5 章章首 | `05-create-reality-node.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `#ch5-fields` | Reality 字段 | `05-create-reality-node.mdx` | `MockWindow`、`MockField`、`MockToolbar`、`ComparisonTable`、`Callout` | 已核对 | 否 | — | 正文与命令对照通过 |
| `#ch5-save` | 保存与检查监听 | `05-create-reality-node.mdx` | `CodeBlock`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文与命令对照通过 |
| `#ch6` | 第 6 章章首 | `06-subscription.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `ch6-body` | 订阅正文（紧随 `#ch6`） | `06-subscription.mdx` | `FlowDiagram`、`MockWindow`、`MockField`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文对照通过 |
| `#ch7` | 第 7 章章首 | `07-clash-verge-rev.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `#ch7-import` | Clash 下载与导入 | `07-clash-verge-rev.mdx` | `PlatformTabs`、`InstructionStep`、`MockWindow`、`MockToolbar`、`Callout` | 已核对 | 否 | — | 正文对照通过 |
| `#ch7-modes` | Rule、Global、Direct 与 TUN | `07-clash-verge-rev.mdx` | `ComparisonTable`、`MockWindow`、`MockStatusBadge`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文对照通过 |
| `#ch8` | 第 8 章章首 | `08-shadowrocket.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `ch8-body` | Shadowrocket 导入正文（紧随 `#ch8`） | `08-shadowrocket.mdx` | `MockWindow`、`MockField`、`MockToolbar`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文对照通过 |
| `#ch9` | 第 9 章章首 | `09-verify-connection.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `ch9-body` | 四层验证法（紧随 `#ch9`） | `09-verify-connection.mdx` | `InfoGrid`、`CodeBlock`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文与命令对照通过 |
| `#ch10` | 第 10 章章首 | `10-daily-use.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `ch10-body` | 多设备与日常使用正文（紧随 `#ch10`） | `10-daily-use.mdx` | `MockWindow`、`MockToolbar`、`InfoGrid`、`ChapterChecklist` | 已核对 | 否 | — | 正文对照通过 |
| `#ch11` | 第 11 章章首 | `11-troubleshooting.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `ch11-body` | 故障排查正文（紧随 `#ch11`） | `11-troubleshooting.mdx` | `FlowDiagram`、`TroubleshootingItem`、`Callout`、`ChapterChecklist` | 已核对 | 否 | — | 正文对照通过 |
| `#ch12` | 第 12 章章首 | `12-security-maintenance.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `ch12-body` | 安全与维护正文（紧随 `#ch12`） | `12-security-maintenance.mdx` | `InfoGrid`、`CodeBlock`、`Callout`、`ChapterChecklist`、`BookCompletion` | 已核对 | 否 | — | 正文与命令对照通过 |
| `#appendix` | 附录章首 | `13-appendix.mdx` | `ChapterHeader` | 已核对 | 否 | — | 正文对照通过 |
| `appendix-body` | 命令速查与术语（紧随 `#appendix`） | `13-appendix.mdx` | `ComparisonTable`、`Glossary` | 已核对 | 否 | — | 正文与术语对照通过 |
| `#sources` | 版本说明与官方资料 | `14-sources.mdx` | 资料列表、`Callout` | 已核对 | 否 | — | 正文与链接对照通过 |

## Milestone 3 说明

原型文件未被修改，正式构建也不会导入或读取该文件。封面按本阶段验收项补充了阅读说明
和两个入口；因工程形态已经从单文件原型变为在线书，将版本标签替换为“在线版”，校订
日期改由内容集合提供。其余书名、副标题、技术路径和册号均保留。15 个内容单元已经在
构建后与原型执行去空白正文对照；代码命令另行逐值对照。

## Milestone 2 结构调整记录

本阶段没有删减、合并、重写或主动润色正文。以下变化只涉及页面结构：

| 原文位置 | 调整内容 | 调整类型 | 文字是否变化 | 原因 |
| --- | --- | --- | --- | --- |
| `#intro > h2`、`#ch1 > h2`、`#ch2 > h2` | 页面主标题由章节路由统一通过 `ChapterHeader` 输出为 `h1` | 结构调整 | 否 | 每个独立 URL 需要唯一一级标题 |
| `#ch1-map .next` | “下一章 / 登录你的第一台服务器 / →”移入 `ChapterNavigation` | 结构调整 | 否 | 统一上一页/下一章导航；避免正文与导航耦合 |
| `#ch2-login .tabs` | 无 JavaScript 时并列显示 Mac 与 Windows；启用 JavaScript 后才折叠为标签 | 结构调整 | 否 | 渐进增强，确保脚本关闭后两套内容仍可阅读 |

构建后的内容完整性检查会移除纯交互按钮、流程箭头和上述导航结构，再将三个已迁移内容单元与原型进行去空白正文对照。该检查与原型数量基线同时保留。
