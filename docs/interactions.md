# 交互状态与本地数据

校订日期：2026-07-26

## localStorage

项目只保存两类数据：

- `ai-infrastructure-books:theme:v1`：字符串 `system`、`light` 或 `dark`；
- `ai-infrastructure-books:reading-state:v1`：带版本号、按书号组织的已完成章节 slug。

不保存搜索词，不收集分析数据，不跨设备同步。清除方式是在浏览器站点设置中删除本地
存储，或在开发者工具执行：

```js
localStorage.removeItem("ai-infrastructure-books:theme:v1");
localStorage.removeItem("ai-infrastructure-books:reading-state:v1");
```

完成率只计算第二册第 1—12 章；“开始之前”、附录和资料来源不计入。完整规则见
`docs/interaction/book02-completion-rules.md`。

## 渐进增强

关闭 JavaScript 后，正文、目录、代码、Windows/macOS 两套说明、故障排查和打印内容
仍然可读。主题选择、搜索、复制反馈、阅读进度和完成状态属于增强功能。复制失败时命令
仍可手动选择；手机目录使用原生 `details/summary`，不会锁定页面滚动。
