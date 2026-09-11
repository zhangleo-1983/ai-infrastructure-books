# 第六册 G2—G3 部署记录

执行日期：2026-09-11，Asia/Shanghai。沿用 Owner 的 G1—G8 全程授权与费用上限。
当前 G2、G3 通过；未调用模型，未创建公开入口。

| 证据 | 实际结果 |
| --- | --- |
| G2-R01 | 官方 tag 1.17.1，提交 8387590ace4a094de812b7847fc6a4c3a27cd52b。首次运行 prepare-env.py 因官方自带 volumes 被拒绝；确认其中仅五份 Git 跟踪配置后，修复为严格路径与 SHA-256 白名单。未删除随附文件。修复后生成 .env 600；第二次运行拒绝旧 .env，未改变秘密 |
| G2-R02 | 实际合并配置通过 check-config.py：16 项服务，仅 nginx 127.0.0.1:8088→80。插件无主机调试映射。所有挂载已输出核对，包含两个 Agent 命名卷。镜像 pull 成功，12 个不同镜像的 ID、RepoTags、RepoDigests、架构存受控 IMAGE-MAP-A |
| G2-R03 | init_permissions 退出 0；其余 15 项常驻运行，已配置的健康检查均 healthy，全部 RestartCount=0、OOMKilled=false。首次 API 启动期间出现 502，待进程就绪后 setup 正常，不将启动中的页面状态记为通过。根盘约 121 GiB 可用；仅代表此时空载余量 |
| G2-R04 | SSH 转发安装页 HTTP 200；初始化前 setup=not_started。主机仅回环 8088 监听，管理网络 HTTP 80/443/8088/8089/5001/5003 均 curl 28 / HTTP 000。独立 Check-Host API 对 8088、5003、5001、8089 分别选取两处节点，八个结果均 Connection timed out；原始请求映射存受控 PROBES-A |
| G3-R01 | Owner 本人完成密码设置并回复“已初始化”，浏览器进入工作区。成员列表与数据库独立核对均仅一个 Owner。独立客户端错误密码 POST /console/api/login 返回 401 authentication_failed；再次 POST /console/api/setup 返回 403。首次登录负向试验因未做该版本 Base64 字段编码而被拒绝，只算格式错误；按官方控制器格式重测后得到 Invalid email or password |
| G3-R02 | Integrations → Permissions：安装和管理由 Everyone 改为 Admins，调试由 Everyone 改为 No one。Auto-update 由 Latest 改为 Disabled 并保存。运行中的插件容器 FORCE_VERIFYING_SIGNATURE=true、PLUGIN_PPROF_ENABLED=false |
| G3-R03 | 保留原 .env、所有绑定目录与命名卷执行 up -d --force-recreate --pull never。重建后 .env SHA-256 一致、数据库仍为一个 Owner；全栈恢复健康，权限 Admins / No one 与自动更新 Disabled 仍在；Owner 重新登录并回复确认，浏览器核对本人的工作区 |

多地探测依据 [Check-Host 官方 API 说明](https://check-host.net/about/api)。只探测本轮专用主机的四个端口，未携带应用凭证。
最初 urllib 请求被第三方探测服务拒绝，不算端口证据；使用其文档中的 curl/JSON 请求成功后才记录结果。
网页检索工具无法解析带端口的目标，也不算源站拒绝证据。未启用 IPv6，IPv6 负向测试不适用。

准备脚本修复的回归覆盖：官方随附配置允许；旧环境、新增空目录、改变/缺失配置、符号链接拒绝；秘密配对与 600 权限保留。
本轮 Python 21 项通过，npm run check 通过（类型、lint、175 单测、88 页构建、75 页搜索、内容校验及 2604 内链）。
正文第 3 章仅补充这项实测差异；书籍仍为 draft，不改变发布状态。
