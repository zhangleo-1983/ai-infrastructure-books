import type { SearchQualitySample } from "./book03-search-samples";

/**
 * 第四册发布候选的中文搜索质量样本。
 *
 * 查询覆盖域名、DNS、Tunnel、HTTPS、安全、排错、维护和 Caddy 对照，
 * 由 production Pagefind 索引执行实际验证。
 */
export const book04SearchSamples: SearchQualitySample[] = [
  { query: "权威 DNS", expectedSlugs: ["01-request-path", "04-change-nameservers"] },
  {
    query: "Quick Scan",
    expectedSlugs: ["03-add-to-cloudflare"],
    knownLimitation:
      "Pagefind 1.5.2 的 zh-CN 静态索引未把英文短语 Quick Scan 的首批结果稳定定位到第 3 章；改搜“快速扫描”或“添加到 Cloudflare”可到达对应内容。",
  },
  { query: "nameserver", expectedSlugs: ["04-change-nameservers"] },
  { query: "旧 DS", expectedSlugs: ["04-change-nameservers"] },
  { query: "Proxied", expectedSlugs: ["05-read-dns-records"] },
  { query: "DNS only", expectedSlugs: ["05-read-dns-records", "appendix"] },
  { query: "公开主机名", expectedSlugs: ["06-plan-public-hostname"] },
  { query: "cloudflared", expectedSlugs: ["07-create-tunnel"] },
  { query: "TCP/UDP 7844", expectedSlugs: ["07-create-tunnel", "11-troubleshooting"] },
  { query: "Published application", expectedSlugs: ["08-publish-application"] },
  { query: "Service URL", expectedSlugs: ["08-publish-application"] },
  { query: "Universal SSL", expectedSlugs: ["09-verify-https"] },
  { query: "Cloudflare Access", expectedSlugs: ["10-security-boundary"] },
  { query: "Error 1033", expectedSlugs: ["11-troubleshooting"] },
  { query: "Error 1016", expectedSlugs: ["11-troubleshooting"] },
  { query: "502 Bad Gateway", expectedSlugs: ["11-troubleshooting"] },
  { query: "交接卡", expectedSlugs: ["12-maintenance-handoff"] },
  { query: "临时下线", expectedSlugs: ["12-maintenance-handoff"] },
  { query: "Full (strict)", expectedSlugs: ["appendix"] },
  { query: "Origin CA", expectedSlugs: ["appendix"] },
];
