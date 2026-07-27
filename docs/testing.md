# 测试说明

校订日期：2026-07-27

## 分层检查

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run check:content:series
npm run check:content:book01
npm run check:content:book02
npm run check:content
npm run check:links
npm run check:release
npm run test:e2e
npm run check:all
```

Vitest 覆盖书籍注册表、系列内容结构、新书脚手架和纯交互逻辑。系列内容检查适用于
所有书籍；第一册独立检查固定内容单元、正文区块、提示框、仿真界面、命令和安全边界；
第二册内容完整性脚本继续逐章对照原型正文与命令。
发布准备脚本检查 H1、唯一标题、重复 ID、结构化数据、打印 noindex、外链属性和示例
凭证边界。Playwright projects 覆盖 Chromium、Firefox、WebKit，并分别保留两册的
公开封面、代表章节、搜索、完成状态、复制、无 JavaScript、响应式、打印和可访问性路径。

`npm run test:e2e` 会先 production build，再以 preview 提供静态站点，因此不依赖远程
服务。首次运行需要提前执行：

```bash
npx playwright install chromium firefox webkit
```

## 人工验收

固定视口为 375×667、390×844、768×1024、1280×800、1440×900。检查浅色、深色、
system、键盘、reduced motion、关闭 JavaScript 和打印预览。不要把自动化零告警当作
人工键盘、阅读顺序与分页检查的替代品。
