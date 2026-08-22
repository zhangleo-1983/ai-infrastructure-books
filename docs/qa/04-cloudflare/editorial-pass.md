# 第四册 RC 前正文二校记录

建立日期：2026-08-22

本台账记录完整草稿获 Owner 确认后、RC 实机校订前的定向正文补充。目标是补齐已由官方文档确认、但尚未充分进入正文的操作边界；不借二校重写已经确认的章节。

## 本轮结论

Cloudflare 当前 Routing 文档把 published application route、DNS 记录和 Tunnel 描述为有关联但可分别存在的对象：

- Dashboard 创建 route 时会自动建立相关 DNS 记录；
- DNS 记录与 Tunnel 拥有独立生命周期；
- Tunnel 停止不会自动删除 DNS；
- DNS 仍指向不可用 Tunnel 时，访问者可能看到 `1016`；
- `1016` 也有其他源站 DNS 根因，不能仅凭错误码断定是 Tunnel 停止。

## 文字修改台账

| 原位置 | 修改内容 | 修改类型 | 修改原因 | 原有主线是否变化 |
| --- | --- | --- | --- | --- |
| 第 8 章“确认 DNS 记录是路由的一部分” | 增加 DNS、published application route、connector 三对象对照表，以及 Tunnel 停止后 DNS 不自动删除的说明 | 技术事实补充 | 让读者知道 DNS 可解析不等于 Tunnel 可用 | 否 |
| 第 8 章“常见失败先怎样判断” | 增加 1016 的第一判断和禁止动作 | 故障排查补充 | 给第 11 章完整排错建立前置线索 | 否 |
| 第 11 章“四种典型现象怎样区分” | 增加 Error 1016 专项，包含含义、先查什么、成功状态和禁止动作 | 技术事实与结构补充 | 原正文已覆盖 NXDOMAIN、1033、502，但没有独立解释 1016 | 否 |
| 第 12 章“临时下线只移除公开入口” | 修改 DNS 核对节点，明确停止 Tunnel 不会自动删除 DNS，route 删除结果以确认框和 Records 为准 | 安全边界补充 | 防止临时下线后遗留不可用 DNS，或误删整个 zone | 否 |
| 资料来源 | 新增 Routing 与 Error 1016 官方页面，更新事实表日期和结论 | 来源补充 | 让读者与作者能复查定义 | 否 |

## 未修改内容

- 书名、章节标题、顺序、slug 和完成率规则；
- Cloudflare Tunnel 主线与 Caddy 附录边界；
- 域名、nameserver、DNSSEC、Universal SSL、Access 和缓存章节主线；
- 第一至第三册全部 MDX；
- 第四册除第 8、11、12 章与资料来源以外的 MDX 正文。

## 仍需实机确认

- 当前 Dashboard 删除 published application route 时的确认文案；
- 删除 route 后关联 DNS 记录的实际保留或删除结果；
- 停止 connector、停止 Tunnel 与删除 Tunnel 三种动作分别呈现的外部错误；
- `1016` 出现时 Dashboard、DNS Records、Tunnel 状态与浏览器证据的对应关系。

这些项目继续属于 G5—G8。没有实机证据前，正文保留“检查实际结果”的表述，不把一次控制台行为写成永久规则。

## 本轮验证

- `npm ci`：成功，632 个依赖包审计为 0 个漏洞；
- `npm run typecheck`：82 个文件，0 error、0 warning、0 hint；
- `npm run lint`：通过；
- `npm run test`：12 个测试文件、146 项测试通过；
- `npm run build`：54 个生产 HTML 页面成功，第四册仍被草稿边界排除；
- Pagefind：仍索引第一至第三册的 45 个正文页面；
- 全系列内容检查：通过；第四册专用检查 9 项通过；
- 内部链接：54 个 HTML 页面、1,549 个链接通过；
- 375px、768px、1440px：第 8 章新增三对象表没有造成页面级横向溢出；
- JavaScript 关闭：第 11 章 1016 标题与完整排错内容可读；
- 打印媒体：第 8 章无页面级横向溢出，复制按钮不进入打印正文。
