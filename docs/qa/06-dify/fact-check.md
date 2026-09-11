# 第六册事实校订

校订日期：2026-09-11。以下为官方网页/固定版本源码阅读结论，均不代表外部实机通过。
官方站点滚动更新；实际 UI、API 与模型兼容须在所选版本重新确认。完整初核矩阵见内容规格 F01—F13。

| 主题 | 官方依据 | 样章采用的表述 | 后续证据 |
| --- | --- | --- | --- |
| 版本和服务栈 | [1.17.1](https://github.com/langgenius/dify/releases/tag/1.17.1)、[Compose](https://raw.githubusercontent.com/langgenius/dify/1.17.1/docker/docker-compose.yaml) | 候选版本；多服务；官方部分基础镜像滚动、插件调试口需要收紧 | G2 摘要、端口、挂载、初始化/常驻状态 |
| 最低资源 | [部署要求](https://docs.dify.ai/en/self-host/deploy/quick-start/docker-compose) | 官方 2 核/4 GiB、Compose 2.24.0+；4/8/80 是作者预算建议 | 资源测量与预算；使用 !override 时需 2.24.4+ |
| 索引 | [索引方法](https://docs.dify.ai/en/self-host/use-dify/knowledge/create-knowledge/setting-indexing-methods) | 经济模式关键词查找，不使用该索引过程的 Embedding；不代表问答免费 | 中文命中与改写差异、实际用量 |
| 模型与集成 | [模型提供方](https://docs.dify.ai/en/self-host/use-dify/workspace/model-providers) | Dify 和远程模型分开；配置验证可能产生请求；集成来源需核验 | 插件版本/来源、DeepSeek 模型/参数、账单与重试 |
| 检索变量 | [Knowledge Retrieval](https://docs.dify.ai/en/self-host/use-dify/nodes/knowledge-retrieval) | Workflow 选自定义 question；result 传入 LLM Context 并在提示词引用 | 当前中文字段、数组类型、片段标题/content |
| 条件 | [If-Else](https://docs.dify.ai/en/self-host/use-dify/nodes/ifelse) | IF result 为空走固定模板，ELSE 才进模型；不保留原直达线 | 数组空判断与真实未命中零生成请求 |
| 模板与来源 | [Template](https://docs.dify.ai/en/self-host/use-dify/nodes/template) | Jinja2 排列实际 title/content，不由模型编来源；来源是候选而非正确性保证 | 本地合成 Jinja2 渲染仅验证语法；Dify 实际类型另验 |
| 输出 | [Output](https://docs.dify.ai/en/self-host/use-dify/nodes/output) | 空分支 notice；有结果 answer/references；多个 Output 不会自动中止并行路径 | 本版发布 web app 的字段呈现 |
| 节点测试 | [Single Node](https://docs.dify.ai/en/self-host/use-dify/debug/step-run) | 可编辑缓存变量单测；注入 [] 与真实检索空结果分开记录 | 两类证据分别验收；不确定 UI 时停 |
| 应用访问 | [Web app settings](https://docs.dify.ai/en/self-host/use-dify/publish/webapp/web-app-settings) | 默认公开；控制台登录与 web app 范围不同 | 控制台、应用、运行 API、文件的允许/拒绝证据 |
| 公网与内部 URL | [环境变量](https://docs.dify.ai/en/self-host/deploy/configuration/environments)、[1.17.1 模板](https://raw.githubusercontent.com/langgenius/dify/1.17.1/docker/.env.example) | 同一 HTTPS 主机名；SERVER_CONSOLE_API_URL/INTERNAL_FILES_URL 保留内部 api:5001；socket 使用 wss | Cookie/CORS/文件/实际 SSE/WS；不能为内部取文件取消 Access |
| 环境变更 | [Compose up](https://docs.docker.com/reference/cli/docker/compose/up/) | 同项目同差异文件 config -q 后 up -d；restart 不当成加载新环境 | 第 3 章配置、回环端口与失败回退实测 |
| Access 顺序 | [接入指南](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/) | 全主机名先保存精确身份 Allow，之后建立 route；没有规则即停止 | G5 全路径负向与本人正向 |
| 邮箱验证码 | [One-time PIN](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) | 新组织未必默认启用 OTP；未允许地址可能显示已发但不发信 | 本人和第二个受控身份；没收到不等于验证通过 |
| 源站验证 | [Origin parameters](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/origin-parameters/) | Protect with Access 校验 JWT，Team/AUD 对应本应用；无设置不保存 route | 当前控制台字段与源站校验结果 |
| 许可 | [固定版 LICENSE](https://raw.githubusercontent.com/langgenius/dify/1.17.1/LICENSE) | 保留品牌、不做多租户代运营，不把许可简化为无附加条件 Apache 2.0 | 用途变化时另行核对完整原文 |

## 作者教学选择

单用户、仅合成 TXT、单次 Workflow、单生成节点、关闭额外模型任务与重试、候选来源单列、
回环 8088、独立主机名、Access 1 小时会话与四类费用核对均为本书取舍，不冒充平台默认值。
第 9 章具体目录和差异文件已由第 3 章承接；本地静态合并通过，尚无实际部署。

## 未覆盖

G1—G8 全部未执行：资源/部署、唯一管理员、模型集成、经济索引中文效果、真实空结果、全路径身份
边界、手机外网、故障注入、完整多存储恢复、跨版本升级和费用清理均无第六册实机证据。
浏览器 QA 只操作本地书籍页面，没有操作 Dify 或 Cloudflare 后台，也不继承前册实测结论。

## P3 第一批新增核对（2026-09-11）

| 主题 | 官方依据与结论 | 本批处理 / 尚待验证 |
| --- | --- | --- |
| 完整服务与端口 | [1.17.1 Compose](https://raw.githubusercontent.com/langgenius/dify/1.17.1/docker/docker-compose.yaml) 与 [.env.example](https://raw.githubusercontent.com/langgenius/dify/1.17.1/docker/.env.example) | 本地 Compose 5.1.2 解析；固定 weaviate,postgresql,collaboration 共 16 服务；!override 后只有 nginx 回环 8088；没有拉取或启动 |
| 配套秘密 | 同上，应用/worker、Redis URL、Weaviate 允许 key、sandbox、插件与 Agent 的字段引用 | 原文件保留；公开 Python 代码内部生成、600 权限、先校验再创建；旧配置/数据/悬空链接拒绝。未验证运行时认证 |
| 镜像与版本 | [1.17.1 release](https://github.com/langgenius/dify/releases/tag/1.17.1) | 本章仅全新安装；部分基础镜像滚动。已测 digest 尚未冻结，这是 G2 与正式发布前的缺口；不能声称完全可复现 |
| 初始化 | [固定版 setup.py](https://raw.githubusercontent.com/langgenius/dify/1.17.1/api/controllers/console/setup.py) | 无 INIT_PASSWORD 时仍必须保护首次入口；只经 SSH 创建唯一 Owner；既有未知管理员不得重置绕过 |
| 集成权限 | [Integrations](https://docs.dify.ai/en/self-host/use-dify/workspace/plugins) | 管理员安装、无人调试、自动更新关闭；官方签名保留；实机 UI 与实际保存结果未覆盖 |
| DeepSeek 名称 | [当前模型页](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/) 与 [插件 manifest](https://github.com/langgenius/dify-official-plugins/blob/main/models/deepseek/manifest.yaml) | 文档推荐 deepseek-flash；当前源码 manifest 0.0.23、预定义 deepseek-v4-flash；官方称旧名转 V4.1 Flash 同价。源码 main 是校订日快照，并非已安装包身份 |
| 凭证校验与模型限制 | [provider](https://github.com/langgenius/dify-official-plugins/blob/main/models/deepseek/provider/deepseek.py) 与 [字段](https://github.com/langgenius/dify-official-plugins/blob/main/models/deepseek/provider/deepseek.yaml) | 校验调用预定义旧名，不受后续节点 256 输出预算控制；没有自定义模型入口假设；单模型是练习约束，不冒充提供方 allowlist |
| 非思考参数 | [官方思考模式](https://api-docs.deepseek.com/zh-cn/guides/thinking_mode/) 与 [插件模型参数](https://github.com/langgenius/dify-official-plugins/blob/main/models/deepseek/models/llm/deepseek-v4-flash.yaml) | 默认思考开启；节点关闭 thinking、max_tokens 256；隐藏思考文字不等于关闭；实际请求和用量留 G4 |
| 输入与保存 | [User Input](https://docs.dify.ai/en/self-host/use-dify/nodes/user-input) | question 必填短文本、200 字符为作者选择；前端与后端限制、纯空格测试仍待实机；保存草稿不混同发布 |
| 三份 TXT 与分段 | [本地导入](https://docs.dify.ai/en/self-host/use-dify/knowledge/create-knowledge/import-text-data/readme) 与 [分段](https://docs.dify.ai/en/self-host/use-dify/knowledge/create-knowledge/chunking-and-cleaning-text) | ready-to-use 手工文件导入；General、空行；1.17.1 实测将重叠 0 限制为 1，已校订为 500/1；无自动 Q&A/摘要；逐条保留 R/S/C 规则，不以片段数量代替复核 |
| 经济检索 | [索引](https://docs.dify.ai/en/self-host/use-dify/knowledge/create-knowledge/setting-indexing-methods) 与 [测试](https://docs.dify.ai/en/self-host/use-dify/knowledge/test-retrieval) | 每片段 10 关键词、Top K 3；四题直接看实际片段；测试设置只影响会话，回知识库保存；不承诺中文改写命中或资料外必空 |
| HTTPS 连续性 | [.env.example](https://raw.githubusercontent.com/langgenius/dify/1.17.1/docker/.env.example) | 第 3 章只允许 localhost 来源，第 9 章同步两项 CORS 至同一 HTTPS 主机名；内部 URL 留 api:5001，无匿名例外 |

官方技术资料共 34 个正文外链本次返回 200。可访问只证明链接当前有效；正文事实由上述文档与源码逐项复核，不能以 HTTP 200 代替事实或运行验证。

## P4 第二批新增核对（2026-09-11）

| 主题 | 官方依据与结论 | 本批处理 / 尚待验证 |
| --- | --- | --- |
| 运行与缓存 | [History and Logs](https://docs.dify.ai/en/self-host/use-dify/debug/history-and-logs) | 分开 Result、Detail、Tracing 与 Last run 缓存；E01—E06 保存实际节点路径、候选片段与提供方用量，不把页面估算当账单 |
| 文档变更 | [Maintain Knowledge Documents](https://docs.dify.ai/en/self-host/use-dify/knowledge/manage-knowledge/maintain-knowledge-documents) | 只在合成知识库禁用/重新启用指定文档，检索复核后恢复基线；不把禁用等同删除或安全撤回 |
| DSL 导出/导入 | [App Management](https://docs.dify.ai/en/self-host/use-dify/workspace/app-management) | 配置文件不含知识库全文与运行日志；检查 Secret 导出选项、提示词与内嵌地址；原件受控保存，公开脱敏件不保证可导入；新应用只验结构与依赖 |
| 发布与版本 | [Version Control](https://docs.dify.ai/en/self-host/use-dify/build/version-control)、[Workflow Web App](https://docs.dify.ai/en/self-host/use-dify/publish/webapp/workflow-webapp) | 只发布已验收原应用；Current Draft 与 Latest 区分；Restore 覆盖当前草稿，重新发布才改变发布版本；不覆盖知识库/数据库历史，暂不批量运行 |
| 排错分层 | [Docker Issues](https://docs.dify.ai/en/self-host/deploy/troubleshooting/docker-issues)、[Error Type](https://docs.dify.ai/en/self-host/use-dify/debug/error-type) | 页面壳、API、worker、存储、插件、模型与变量分别取证；有界日志本地查看，不使用清卷、清队列或重复模型请求作为通用修复 |
| LLM Context 类型 | [固定版单元测试](https://raw.githubusercontent.com/langgenius/dify/1.17.1/api/tests/unit_tests/core/workflow/nodes/llm/test_node.py) | Error Type 概述中的“只支持字符串”与固定版测试不一致；测试明确包含带 content/metadata 的知识片段数组与字符串。保留第 7 章 result → Context 主线，排查对象结构；只阅读了官方测试，未运行 Dify 测试或实机节点 |
| 提供方错误 | [DeepSeek 错误代码](https://api-docs.deepseek.com/zh-cn/quick_start/error_codes) | 区分 401 认证、402 余额、429 限流、500 服务内部错误、503 繁忙；先停重试、核对原始状态与用量，不凭 Dify 页面标签推定原因 |
| 冷备份 | [PostgreSQL 15 文件系统备份](https://www.postgresql.org/docs/15/backup-file.html)、[Dify 存储与迁移](https://docs.dify.ai/en/self-host/deploy/troubleshooting/storage-and-migration)、[固定 Compose](https://raw.githubusercontent.com/langgenius/dify/1.17.1/docker/docker-compose.yaml) | 停止写入并正常停全栈，完整 docker 目录加两个 Agent named volume 与四个 Squid 匿名卷（2026-09-11 实际容器盘点补入）；不能把 DSL 或单数据库副本叫完整备份；源服务异常退出先处理，不以哈希成功掩盖不一致 |
| 卷与隔离 | [Docker Volumes](https://docs.docker.com/engine/storage/volumes/)、[Compose Networks](https://docs.docker.com/reference/compose-file/networks/)、[Compose Create](https://docs.docker.com/reference/cli/docker/compose/create/) | 新目录、新项目、新卷，显式 nocopy，create 之后只向空卷解包；四个内部网络与实际成员双重核验；静态检查拒绝原目录、外部挂载、共享卷、公网端口、host gateway 与不隔离网络 |
| 镜像留存 | [Image Save](https://docs.docker.com/reference/cli/docker/image/save/)、[Image Load](https://docs.docker.com/reference/cli/docker/image/load/) | 从源容器记录实际 image ID 并保存镜像包，恢复覆盖文件使用 sha256 ID、pull never；不依赖滚动标签重新拉取；无真实镜像记录或恢复证据 |
| 恢复结论 | 上述固定配置、存储与网络文档 | 仅设计同一 VPS、同版本隔离恢复；源项目保持停止，恢复副本不开放出口或模型调用；页面可登录、旧数据可读写不证明远程凭证解密/生成可用，也不证明 VPS 丢失或跨版本恢复 |

本批十二篇正文共 50 个唯一官方链接返回 HTTP 200。静态配置测试使用临时生成的秘密与合成镜像 ID，
没有接触真实配置、拉取镜像或启动 Dify。隔离恢复脚本通过 20 项本地 Python 回归及四文件 Compose
合并检查，不能替代容器、任务队列、插件、索引和外连限制的实机验收。

## P5 第三批新增核对（2026-09-11）

| 主题 | 官方依据与结论 | 本批表述 / 未覆盖 |
| --- | --- | --- |
| 单应用网页停用 | [固定 Web App 卡片](https://raw.githubusercontent.com/langgenius/dify/1.17.1/web/app/components/app/access-point/built-in-access-points/web-app-card.tsx) 使用 siteEnable 与 enable_site | 可关闭原应用网页入口；不推导服务 API、管理员调试或在途请求全停；导航/保存/旧入口结果仍待实机 |
| 检查副本删除 | [应用管理](https://docs.dify.ai/en/self-host/use-dify/workspace/app-management) | 精确核对导入检查副本后删除；保留原应用与被引用知识库；DSL 不恢复全部日志，永久动作不用于临时暂停 |
| 会话撤销 | [Access Session Management](https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/session-management/) | 应用级 Revoke existing tokens 与身份规则分开，原 Allow 保留时可能重新认证；不做账户级全局撤销 |
| 暂停/移除 | [Compose stop](https://docs.docker.com/reference/cli/docker/compose/stop/)、[down](https://docs.docker.com/reference/cli/docker/compose/down/) | stop/start 复用容器；普通 down 保留目录与 named volume，不带 -v、--rmi、--remove-orphans；不是数据清空证明 |
| 计量 | [DeepSeek token usage](https://api-docs.deepseek.com/quick_start/token_usage/) | 不把字符等同 token；实际用量与最终账单独立核对，不为确认撤销主动补发模型请求 |
| 备选索引 | [索引方式](https://docs.dify.ai/en/self-host/use-dify/knowledge/create-knowledge/setting-indexing-methods) | High Quality 不可直接切回经济模式；保留原库和资料，另评估模型、费用与恢复，不提供未经确认的切换实操 |
| 附录配置表 | 逐行对照既有 prepare-env.py、compose.book06.yaml、compose.restore.yaml 及第 9 章 URL 字段 | 保留三环境与内部 api:5001 区别；初始 checker 只对应 localhost，不能直接判 HTTPS 后配置；本轮未改脚本或重复创建配置集成环境 |

本轮重新检查整册 59 个唯一官方链接，均 HTTP 200；前述 P2—P4 数字保留为各批历史结果。
新命令仅做 Shell 语法检查，未操作 systemd、Docker 运行对象、外部控制台或真实数据。
普通删除与实例销毁均不作物理擦除承诺；本章不提供账户通用的清空命令，也不把服务不可达当零费用。

## G2 实机差异校订（2026-09-11）

官方 1.17.1 / 8387590ace4a 的新 clone 自带 volumes 下五份配置，旧准备脚本将目录存在误判成旧数据。
已按官方随附文件的精确路径与 SHA-256 校验放行；不允许额外文件/目录、缺失、改变或符号链接，旧 .env 仍拒绝。
真实生成与启动成功，21 项 Python 回归通过；第 3 章补充此区别，未要求读者删除 volumes。
实际服务、独立网络和首次失败记录见 [部署记录](g2-g3-deployment.md)；不将 G2 通过扩大成整册验收通过。
