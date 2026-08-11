# 《一篇文章掌握 Docker：从容器到 Compose》Release Candidate 说明

版本：`book03-v1.0.0-rc.1`

校订日期：2026-08-11

状态：本地发布候选验收通过；候选版本标识为 `book03-v1.0.0-rc.1`

## 本次候选版本包含

- “开始之前”、第 1—12 章、附录和资料来源，共 15 个内容单元；
- 系列级封面、完整目录、章节导航、12 章完成状态和整册打印页；
- Ubuntu 24.04 LTS amd64、Docker 官方 APT 软件源、Docker Engine、Compose plugin；
- 镜像、容器、生命周期、端口、volume、bind mount、配置、Compose、故障排查、备份和交接主线；
- HTML/CSS 教学仿真终端、流程图和状态界面，不使用真实软件截图；
- Pagefind 中文静态搜索、三态主题、阅读进度、复制反馈和本地完成状态；
- 不依赖 JavaScript 的正文、目录和打印内容；
- 隔离 VPS 的连续命令校订和不含敏感凭证的实测台账。

稳定 URL：

```text
/books/03-docker/
/books/03-docker/start/
/books/03-docker/01-why-docker/
...
/books/03-docker/12-handoff/
/books/03-docker/appendix/
/books/03-docker/sources/
/books/03-docker/print/
```

## 内容与实机校订

- 15 个内容单元均使用显式 `order`、稳定 `slug` 和 `draft: false`；
- 完成率只计算第 1—12 章，开始之前、附录和资料来源不计入；
- 第 3—12 章已在隔离的 Ubuntu 24.04 LTS amd64 VPS 连续执行；
- 实测 Docker Engine 29.7.2、Compose plugin 5.4.0 和 `nginx:1.30.4-alpine`；
- 验证范围包括官方 APT、Docker Hub、生命周期、回环端口、SSH 隧道、volume、bind mount、
  Compose、故障注入、备份恢复、日志限制、精确清理和交接卡；
- 没有开放公网 8080，没有执行 prune、`down -v`、批量删除或 Docker daemon 全局改写；
- 实测公网 IP、SSH 私钥、账户和支付信息没有写入仓库。

详细证据见 `vps-validation.md`。

## Production、搜索与 URL

- Production build 生成 54 个 HTML：3 个封面、45 个内容页和 3 个打印页等系列页面；
- Pagefind 1.5.2 索引 45 个正文页，第三册占 15 页；封面和打印页不入索引；
- 25 个第三册中文/技术词样本中，24 个在前五条结果内命中预期章节；
- “端口映射”连续中文短语返回空结果，是已记录的 Pagefind zh-CN 分词边界；
  “127.0.0.1”或“SSH 隧道”可正常命中同一章；
- 所有样本均未出现 `/print/`，章节根链接和正文锚点均使用正式 URL；
- 根路径和 `/ai-books/` 子路径构建均通过；子路径构建检查了 1,549 个内部链接；
- 配置 `SITE_URL` 后 canonical、Open Graph URL、robots sitemap 地址和 sitemap 均包含正确 base path；
- 打印页保持 `noindex,follow`。

搜索详情见 `search-samples.md`。

## 跨浏览器、响应式与无障碍

- 全套 Playwright 共 96 项：48 项执行通过，48 项按显式浏览器职责预期跳过；
- Chromium、Firefox、WebKit 均实际打开第三册封面、Compose 章、章节导航和整册打印页；
- 三个浏览器均验证 JavaScript 关闭后目录、正文、命令和打印内容可读；
- Chromium 检查 375 × 667、390 × 844、768 × 1024、1280 × 800、1440 × 900；
- 五种视口均无页面级横向溢出，手机目录、代码、表格、流程图和仿真终端可用；
- 系统深色模式、`prefers-reduced-motion` 和打印浅色样式通过；
- 第三册封面、安装章、Compose 章、故障排查章和打印页未发现 axe WCAG A/AA 自动化违规；
- 第一、二册的关键路径、搜索、打印、无 JavaScript 和共享交互保持通过。

## 打印与 PDF

- Chromium 按 A4 纵向生成 `book03-v1.0.0-rc.1.pdf`；
- 最终 177 页，6,218,769 字节，PDF 1.4，无加密、无内嵌 JavaScript；
- 封面、目录、开始之前、第 1—12 章、附录和资料来源完整；
- 无空白页、文字越界、横向溢出、深色背景误入或网页按钮/侧栏误入；
- 代码块、表格、提示框、流程图与教学仿真界面保持浅色可读；
- 超长 `HANDOFF.md` 模板允许在打印时跨页，避免产生只剩标题的异常稀疏页；
- 全部 177 页完成低分辨率缩略图总览，封面、目录、章节起始、长代码和末页另做高分辨率抽查。

PDF 是本地忽略产物，位于 `output/pdf/`，不随源代码自动提交。

## 性能与资源

测试页面：`/books/03-docker/09-docker-compose/`<br>
浏览器与环境：本机 headless Chromium，production preview

- Lighthouse：Performance 100、Accessibility 100、Best Practices 100、SEO 100；
- FCP 1.1 s、LCP 1.1 s、TBT 0 ms、CLS 0.003、Speed Index 1.6 s；
- 首次页面传输约 28 KiB，共 4 个请求；
- 页面加载的共享 JavaScript 原始大小 12,356 字节，共享 CSS 原始大小 12,685 字节；
- 全部 Pagefind 资源约 978,255 字节，其中 JavaScript 约 441,271 字节，搜索打开时按需加载；
- 无外部字体、图片、分析脚本或第三方运行时请求。

Lighthouse JSON 是本地忽略产物，位于 `output/lighthouse/`。

## 安全与隐私

- `npm audit` 为 0 个已知漏洞；
- 发布准备检查未在 `src` 中发现真实 UUID 或非文档保留 IPv4；
- 仓库不包含真实 VPS IP、密码、SSH 私钥、订阅 URL、Reality 私钥或支付凭证；
- localStorage 只用于主题与学习完成状态，不收集搜索词，不含分析脚本；
- 外部新窗口链接统一使用 `noopener noreferrer`；
- 页面不执行用户输入，搜索摘要由 Pagefind 静态索引和文本 DOM 安全渲染；
- 实机仍在运行并可能持续计费，是否保留或销毁属于账户运维决定，不由本次代码验收自动处理。

## 当前已知边界

- Pagefind 1.5.2 对“端口映射”连续中文短语返回空结果；替代词可以命中；
- Lighthouse 是单机实验室结果，不代表所有中国地区网络的真实加载速度；
- Docker、Ubuntu、镜像标签和厂商网络会变化，下一 RC 仍需抽样复核；
- PDF 分页可能因浏览器版本和系统字体略有变化，但正文不得丢失或重叠；
- 目标读者试读尚未开始，零基础理解障碍仍需要真实反馈验证。

这些边界不阻塞 `rc.1`，但不得把发布候选表述为正式版。

## 发布建议

项目 Owner 已接受上述搜索分词边界和本轮最小打印修正，并授权形成
`book03-v1.0.0-rc.1`。实际提交、标签与部署状态由 Git 记录和静态站点确认。

进入正式版前建议：

1. 邀请少量目标读者完成“安装 → 第一个容器 → 端口 → volume → Compose → 备份”路径；
2. 记录读者在哪些术语、成功状态或失败判断处停住；
3. 正式域名和托管平台确定后，再做一次真实部署 smoke test；
4. 发布前重新运行 `npm ci`、`npm audit`、`npm run check:all` 和 `git diff --check`；
5. 决定测试 VPS 是否保留；若不再使用，应在云控制台销毁实例并确认停止计费。
