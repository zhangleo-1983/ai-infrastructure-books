import type { SearchQualitySample } from "./book03-search-samples";

/**
 * 第五册发布候选的中文搜索质量样本。
 *
 * 查询覆盖双请求路径、部署、认证、模型、公开入口、隐私、备份、
 * 排错、维护和 Ollama 附录，由 production Pagefind 索引实际验证。
 */
export const book05SearchSamples: SearchQualitySample[] = [
  { query: "一个聊天框背后有哪两条请求路径", expectedSlugs: ["01-two-request-paths"] },
  { query: "最坏可接受支出", expectedSlugs: ["02-choose-model-provider"] },
  { query: "WEBUI_SECRET_KEY", expectedSlugs: ["03-plan-deployment", "04-deploy-open-webui"] },
  { query: "127.0.0.1:3000:8080", expectedSlugs: ["03-plan-deployment", "04-deploy-open-webui"] },
  { query: "首位管理员", expectedSlugs: ["05-bootstrap-admin"] },
  { query: "Model IDs Filter", expectedSlugs: ["06-connect-model-provider"] },
  { query: "deepseek-flash", expectedSlugs: ["06-connect-model-provider", "sources"] },
  { query: "CORS_ALLOW_ORIGIN", expectedSlugs: ["07-publish-with-tunnel", "11-troubleshooting", "appendix"] },
  { query: "Secure Cookie", expectedSlugs: ["07-publish-with-tunnel"] },
  { query: "两条低敏感固定问题", expectedSlugs: ["08-first-conversation"] },
  { query: "pending", expectedSlugs: ["05-bootstrap-admin", "09-users-and-privacy"] },
  { query: "Public sharing", expectedSlugs: ["09-users-and-privacy"] },
  { query: "一致的 volume 时间点", expectedSlugs: ["10-backup-and-update"] },
  { query: "数据库迁移", expectedSlugs: ["10-backup-and-update"] },
  { query: "Cloudflare Error 1033", expectedSlugs: ["11-troubleshooting"] },
  { query: "容器中的 localhost", expectedSlugs: ["11-troubleshooting"] },
  { query: "永久退役", expectedSlugs: ["12-maintenance-handoff"] },
  { query: "host.docker.internal", expectedSlugs: ["appendix"] },
  { query: "Open WebUI License", expectedSlugs: ["start", "sources"] },
  { query: "一用户一把", expectedSlugs: ["12-maintenance-handoff", "sources"] },
];
