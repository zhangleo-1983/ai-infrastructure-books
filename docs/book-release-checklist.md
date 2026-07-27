# 单册发布检查清单

校订日期：2026-07-27

## 内容冻结

- [ ] 章节顺序、标题和稳定 slug 已确认
- [ ] 所有正式章节、附录和资料来源完整
- [ ] 技术命令与外部事实已注明校订日期
- [ ] 安全提醒、成功状态和失败判断没有缺失
- [ ] 内容台账或本书内容基线已完成

## 注册表与版本

- [ ] 书籍 id、书号和 URL slug 已冻结
- [ ] `updatedAt` 已更新
- [ ] completion、search 和 print 规则已确认
- [ ] RC 版本使用 `X.Y.Z-rc.N`
- [ ] 正式发布前才将状态改为 `published`

## 功能与静态输出

- [ ] 封面、目录、章节导航和打印入口正确
- [ ] 搜索结果只包含需要索引的内容
- [ ] 完成状态刷新后保留
- [ ] JavaScript 关闭后正文和目录可读
- [ ] A4 打印无截断、重叠和页面级横向溢出
- [ ] root 与 `BASE_PATH` 子路径构建均通过

## SEO、安全与隐私

- [ ] title、description、canonical 和 Open Graph 正确
- [ ] 封面和章节结构化数据正确
- [ ] print 使用 noindex
- [ ] sitemap 与 robots 正确
- [ ] 没有真实 IP、密码、UUID、订阅 URL、私钥或 Cookie
- [ ] 不收集搜索词，不引入未批准的分析脚本

## 自动检查

```bash
npm ci
npm audit
npm run check:all
git diff --check
```

## 建立 RC

只有项目 Owner 确认后才执行提交、打标签、推送或部署。建议标签：

```text
bookNN-vX.Y.Z-rc.N
```

第二册示例：

```text
book02-v1.0.0-rc.1
```

第一册当前建议标签：

```text
book01-v1.0.0-rc.1
```

RC 标签应指向已通过全部检查且工作区干净的提交。修复发布产物后应建立新的提交，并
确认标签最终指向该提交。
