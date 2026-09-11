# G6：单项故障与恢复

2026-09-11。沿用 Owner 全程授权，在电脑和手机 G5 正向验证完成后执行；不扩大请求数和费用。

## G6-R01：错误路由

- 基线：唯一受保护 route 指向 HTTP 127.0.0.1:8088，本地 setup 200；18088 无监听。
- 19:14 只将 route 服务改为 127.0.0.1:18088，主机名、路径和 JWT 设置保持。
- 本人已授权浏览器刷新实际 Web App，19:14:48 显示 Cloudflare Bad gateway / Error code 502，Browser 和 Cloudflare Working、Host Error。
- 同时通过 SSH 读取本地 /console/api/setup 仍为 200，故障位于路由到源站连接，而非 Dify 停机。
- 随即把服务恢复为 127.0.0.1:8088；本人浏览器刷新恢复运行表单；19:24 SSH 复核本地 setup 200、匿名 /apps 302，connector 实际配置仍是 8088、required=true、原 team 与 AUD。未调用模型。

## G6-R02：错误模型配置

- 另建未发布的“故障演练－错误模型”副本，仅更改 DSL 应用名称、说明与模型名；原发布应用未修改。
- 19:18:59 对合成报名问题执行一次。Dify 显示 `Model book06-invalid-model-for-drill not exist.`，0 步、0 tokens；数据库没有该副本的 workflow_runs。
- 这是本地模型存在性校验拒绝，不是 DeepSeek HTTP 错误响应。19:24 提供方专用 key 筛选仍为 8 次 / 1665 tokens / 少于 0.01 元。台账单列一次本地失败尝试，不加到实际提供方请求。
- 模型已恢复 deepseek-flash，max_tokens=256、temperature=0.7、thinking=false、重试关闭。19:24 Checklist 显示 All issues are resolved，自动保存且未发布；不再运行此副本。
- 429、提供方超时及实际 HTTP 错误未覆盖；不靠压力测试制造故障。

## G6-R03：复用变量类型与空结果证据

按 runbook G6.4 复用 [G4](g4-model-workflow.md) 的实际故障和恢复记录：缓存编辑器拒绝类型不符的 `[]`，重置后条件单步接受数组并选择空分支；另用真实未命中问题证明五步、0 tokens、无 LLM。不能把缓存编辑器错误称为模型错误，也不能用注入空数组替代真实检索。最终原应用八节点七边、输出变量和提示模板均由保存图与成功轨迹核对。

## G6-R04：API、worker 和插件服务

19:24 撤下本轮唯一公开 route，保留 Access；控制台显示无已发布路由，connector 实际 ingress 仅剩 http_status:404。

- 19:25:01 API stop：exit 0，本地 setup 502；start 后 health=healthy、setup 200、OOM=false。
- 19:25:45 worker stop：exit 0，setup 仍为 200；start 后 running，OOM=false。
- 19:25:53 plugin_daemon stop：exit 0，setup 仍为 200；start 后 running，OOM=false。
- 顺序执行，每次恢复后才进行下一项。数据库、Secret 和卷未修改；恢复后 1 个管理员、3 个应用、3 份 completed/enabled 文档、12 个 enabled 分段、0 个运行中的 workflow。
- worker/插件暂停只验证服务状态和控制台不随之整体离线，未制造索引或模型任务。因此 G6.3 的具体任务失败轨迹记环境未覆盖，不能声称后台任务端到端故障测试通过。

G6 已执行项均恢复；G6.3 任务层、429 和超时保留明确未覆盖。临时入口继续关闭，进入 G7 冷备份窗口。
