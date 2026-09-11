# G5：受保护 HTTPS 实机记录

执行日期：2026-09-11。沿用 Owner 的 G1—G8 全程授权；保持既有 DNS、身份提供方和根 zone 不变。
真实对象仅存受控映射，本文使用代号。

## G5-R01：访问保护准备

- G4 在 18:43 完成 6 请求/1129 tokens/<0.01 元核账，原应用本地发布第 1 版，命名“练习版1”。
- 新建唯一 Allow 策略，Include 使用本人完整邮箱一项；没有 Everyone、邮箱域规则或 Bypass。
- 既有身份方式只有 Cloudflare。本轮补加 One-time PIN，原身份方式保留；本应用仅选择 One-time PIN，接受所有身份方式关闭，客户端身份登录关闭。
- 当前应用和策略的时长菜单都没有 1 小时，选择实际可用的 30 minutes；这是正文建议与现场界面差异。
- 全主机名、空路径、唯一策略已在提交前核对。18:49 前后提交应用创建；保存后持久性、源站 JWT、route 与实际拒绝仍待核验，不能据此标记 G5 通过。

## G5-R02：HTTPS 环境切换

- Access 创建后重新打开：整个目标主机名、空路径、唯一 Allow 策略、仅 One-time PIN、应用 30 分钟均持久。
- 其他设置中的应用 AUD 已读取并存于受控映射。OPTIONS 绕过源站关闭，未配置跨源放行。
- 变更前以独占创建方式保存 .env.before-https；两文件权限 600。逐行核对只改变九项公开 URL/WS/CORS，其他全部变量和两项内部 api:5001 地址保持。
- 以原项目和两份 Compose 文件执行 config -q、up -d --pull never，成功结束。初始化退出 0、15 常驻服务运行；重建初期 API 为 starting、setup 暂时 502，随后健康检查全部恢复，setup 返回 200。
- 实际唯一发布端口仍为 nginx 127.0.0.1:8088 → 80。没有模型调用、下载新镜像、重建数据或增加公网端口。

## G5-R03：route 和匿名访问

- 唯一路由已保存，整个教学主机名、无路径限制，HTTP → 127.0.0.1:8088；在保存前启用“强制 Access JSON Web Token (JWT) 验证”并选中本应用。
- cloudflared 实际收到的新配置经解析核对：required=true，teamName 与组织相同，audTag 与 ACCESS-A 完全一致；不是只根据界面开关判断。
- 无 Cookie/token 的独立 curl：GET 控制台 /apps、GET 本轮真实发布 Web App、POST /v1/workflows/run、POST /api/workflows/run、GET 本轮报名 TXT 对应的 /files/<FILE-A>/file-preview，全部 HTTP/2 302，Location 为本组织 Access 登录。POST 仅合成输入，不带 Dify 凭证；没有跟随重定向或新增模型运行。
- 文件 ID 从本轮文档与 upload_file 关联取得，路径与固定版本控制器核对。仅证明真实文件路由被 Access 拦截，不声称匿名请求可获得有效的文件签名或已验证文件内容下载。
- VPS 上独立 DNS 解析返回 Cloudflare 公网 IPv4/IPv6；HTTPS curl 返回 302、证书校验结果 0。本机 Clash TUN DNS 返回合成地址，不作为公网 DNS 证据。原 staging CNAME 和根 NS 与基线一致。
- Chrome 打开真实 Web App 后只有 One-time PIN 登录表单；已单次向本人邮箱请求登录码，等待本人在浏览器完成登录。非白名单身份和实际手机蜂窝仍未覆盖。

## G5-R04：本人电脑访问与单次生成

- Owner 回复“电脑完成登录”。19:10 Chrome HTTPS 控制台显示既有本人工作区、原应用与导入检查副本，刷新后可用；没有初始化或新建账号。
- 打开原发布应用，只使用 Run Once。19:11:10 提交一次“报名截止是什么时候？”（REQ-07），服务端记录 app-run / succeeded / 6 步 / 266 tokens / 4.883 秒。
- 页面返回“报名截止于活动前 2 天；截止后不接受补报名。人数达到上限时，即使还未到截止日，也会停止报名。”；来源 R01/C02/R03，未补充不存在的日期或名额承诺。
- Nginx 实际日志记录 POST /api/workflows/run 200；固定 1.17.1 的 web/service/share.ts 使用 ssePost 和 response_mode=streaming，对应服务端控制器 streaming=True。结合页面六节点完成与输出，确认本次 SSE 应用链路可用；没有声称逐字渲染已录屏。
- HTTPS 编排界面可打开，八节点、已发布状态保持；Nginx 实际 /socket.io/ 升级记录 101，协作 WS 与应用 SSE 分开记证据。
- 调用前专用 key 再核仍为 6 次/1129 tokens/<0.01 元；本次后已发 7 次，预计合计 1395 tokens，提供方延迟更新待核。手机真实蜂窝结果仍待 Owner，不用桌面视口冒充。

## G5-R05：真实手机与 G5 结论

Owner 随后明确回复“手机验证通过”，对应先前要求关闭 Wi-Fi、蜂窝登录、原题单次运行并查看来源。
服务端新增且仅新增一条 app-run：19:12:55 / succeeded / 6 步 / 270 tokens / 1.211 秒（REQ-08）。
因此本人电脑和真实手机均通过，G5 主线通过；非白名单第二身份仍为环境未覆盖，文件内容下载未另测。
截至本次已发送 8 次，剩 4 次；266+270 加前六次 1129，预期提供方累计 1665 tokens，等待延迟入账期间不追加生成。

## G5 最终用量核对

19:24 提供方专用 key 筛选确认电脑和手机调用均已入账：累计 8 次、1665 tokens、少于 0.01 元。G5 正向验证通过，余 4 次实际提供方请求额度；文件正向下载和第二个非白名单身份仍按上述边界列未覆盖。
