export interface SearchQualitySample {
  query: string;
  expectedSlugs: string[];
  knownLimitation?: string;
}

/**
 * 第三册发布候选的中文搜索质量样本。
 *
 * 这份样本同时固定“读者会搜什么”与“应命中哪里”，由 production build
 * 生成的 Pagefind 索引执行实际验证。
 */
export const book03SearchSamples: SearchQualitySample[] = [
  { query: "Docker daemon", expectedSlugs: ["01-why-docker", "03-install-docker"] },
  { query: "镜像引用", expectedSlugs: ["02-image-and-container"] },
  { query: "Registry", expectedSlugs: ["02-image-and-container"] },
  { query: "digest", expectedSlugs: ["02-image-and-container", "11-update-backup-cleanup"] },
  { query: "APT 软件源", expectedSlugs: ["03-install-docker"] },
  { query: "hello-world", expectedSlugs: ["03-install-docker", "04-first-container"] },
  { query: "Exited", expectedSlugs: ["04-first-container", "05-container-lifecycle"] },
  { query: "restart policy", expectedSlugs: ["05-container-lifecycle"] },
  {
    query: "端口映射",
    expectedSlugs: ["06-publish-ports"],
    knownLimitation:
      "Pagefind 1.5.2 的 zh-CN 静态索引未返回这个连续中文短语；改搜“127.0.0.1”或“SSH 隧道”可命中第 6 章。",
  },
  { query: "127.0.0.1", expectedSlugs: ["06-publish-ports", "09-docker-compose"] },
  { query: "SSH 隧道", expectedSlugs: ["06-publish-ports"] },
  { query: "named volume", expectedSlugs: ["07-persist-data"] },
  { query: "bind mount", expectedSlugs: ["07-persist-data"] },
  { query: "环境变量", expectedSlugs: ["08-config-and-secrets"] },
  { query: "Compose secret", expectedSlugs: ["08-config-and-secrets"] },
  { query: "compose.yaml", expectedSlugs: ["09-docker-compose"] },
  { query: "config -q", expectedSlugs: ["09-docker-compose", "10-troubleshooting"] },
  { query: "Restarting", expectedSlugs: ["10-troubleshooting"] },
  { query: "故障注入", expectedSlugs: ["10-troubleshooting"] },
  { query: "恢复验证", expectedSlugs: ["11-update-backup-cleanup"] },
  { query: "local 日志", expectedSlugs: ["11-update-backup-cleanup"] },
  { query: "HANDOFF.md", expectedSlugs: ["12-handoff"] },
  { query: "交接卡", expectedSlugs: ["12-handoff"] },
  { query: "system prune", expectedSlugs: ["appendix"] },
  { query: "Docker Desktop", expectedSlugs: ["appendix"] },
];
