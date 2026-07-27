# 静态部署

校订日期：2026-07-26

项目输出纯静态文件，无后端与外部运行时依赖。推荐 Node.js 22.12 及以上。

## 环境变量

```bash
SITE_URL=https://books.example.com
BASE_PATH=/
```

`SITE_URL` 是真实公开站点地址。未确定域名时不要填写虚假地址；本地仍可构建，但不会
生成 canonical 与 sitemap。`BASE_PATH` 用于 GitHub Pages 项目站点，例如
`/ai-infrastructure-books/`。

## GitHub Pages

项目站点的典型构建变量：

```bash
SITE_URL=https://<owner>.github.io
BASE_PATH=/ai-infrastructure-books/
npm ci
npm run build
```

将 `dist/` 作为 Pages artifact。不要把 `SITE_URL` 写成包含同一子路径的值，否则可能
重复 base。正式启用工作流和发布仍需项目 Owner 明确授权。

当前第一册 RC 已由项目 Owner 授权使用以下目标：

```text
Repository: https://github.com/zhangleo-1983/ai-infrastructure-books
Site: https://zhangleo-1983.github.io/ai-infrastructure-books/
SITE_URL=https://zhangleo-1983.github.io
BASE_PATH=/ai-infrastructure-books/
```

`.github/workflows/pages.yml` 使用 GitHub Pages 官方 Actions 构建并发布 `dist/`。
`main` 是唯一自动触发生产部署的分支；其他分支只运行 CI，不发布到正式站点。

## Cloudflare Pages 与 Vercel

- Build command：`npm run build`
- Output directory：`dist`
- Node.js：22.12+
- 根域部署使用 `BASE_PATH=/`

## 发布前检查

```bash
npm ci
npm run check:all
npm audit
```

子路径模拟还应检查 `/pagefind/`、深层章节刷新、404、favicon、robots、sitemap、
print 路由和 canonical。完成状态使用书号和 slug，不受 base path 变化影响。
