import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getBookById, getReadableBooks } from "../../src/data/books";

const root = resolve(import.meta.dirname, "../..");
const contentDirectory = resolve(root, "src/content/books/04-cloudflare");
const qaDirectory = resolve(root, "docs/qa/04-cloudflare");

const expectedDrafts = [
  {
    file: "00-introduction.mdx",
    order: 0,
    slug: "start",
    chapterType: "introduction",
    updatedAt: "2026-08-11",
  },
  {
    file: "01-request-path.mdx",
    order: 1,
    slug: "01-request-path",
    chapterType: "chapter",
    updatedAt: "2026-08-12",
  },
  {
    file: "02-own-domain.mdx",
    order: 2,
    slug: "02-own-domain",
    chapterType: "chapter",
    updatedAt: "2026-08-12",
  },
  {
    file: "03-add-to-cloudflare.mdx",
    order: 3,
    slug: "03-add-to-cloudflare",
    chapterType: "chapter",
    updatedAt: "2026-08-12",
  },
  {
    file: "04-change-nameservers.mdx",
    order: 4,
    slug: "04-change-nameservers",
    chapterType: "chapter",
    updatedAt: "2026-08-12",
  },
  {
    file: "05-read-dns-records.mdx",
    order: 5,
    slug: "05-read-dns-records",
    chapterType: "chapter",
    updatedAt: "2026-08-12",
  },
  {
    file: "06-plan-public-hostname.mdx",
    order: 6,
    slug: "06-plan-public-hostname",
    chapterType: "chapter",
    updatedAt: "2026-08-12",
  },
  {
    file: "07-create-tunnel.mdx",
    order: 7,
    slug: "07-create-tunnel",
    chapterType: "chapter",
    updatedAt: "2026-08-23",
  },
  {
    file: "08-publish-application.mdx",
    order: 8,
    slug: "08-publish-application",
    chapterType: "chapter",
    updatedAt: "2026-08-22",
  },
  {
    file: "09-verify-https.mdx",
    order: 9,
    slug: "09-verify-https",
    chapterType: "chapter",
    updatedAt: "2026-08-12",
  },
  {
    file: "10-security-boundary.mdx",
    order: 10,
    slug: "10-security-boundary",
    chapterType: "chapter",
    updatedAt: "2026-08-12",
  },
  {
    file: "11-troubleshooting.mdx",
    order: 11,
    slug: "11-troubleshooting",
    chapterType: "chapter",
    updatedAt: "2026-08-22",
  },
  {
    file: "12-maintenance-handoff.mdx",
    order: 12,
    slug: "12-maintenance-handoff",
    chapterType: "chapter",
    updatedAt: "2026-08-22",
  },
  {
    file: "appendix.mdx",
    order: 13,
    slug: "appendix",
    chapterType: "appendix",
    updatedAt: "2026-08-12",
  },
  {
    file: "sources.mdx",
    order: 14,
    slug: "sources",
    chapterType: "sources",
    updatedAt: "2026-08-23",
  },
] as const;

function frontmatterValue(source: string, field: string): string | undefined {
  return source
    .match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");
}

describe("第四册发布候选内容", () => {
  it("进入 release-candidate、搜索与正式打印", () => {
    const book = getBookById("04-cloudflare");

    expect(book).toBeDefined();
    expect(book?.title).toBe(
      "让服务拥有域名：从 DNS 到 Cloudflare HTTPS",
    );
    expect(book?.status).toBe("release-candidate");
    expect(book?.version).toBe("1.0.0-rc.1");
    expect(book?.search.enabled).toBe(true);
    expect(book?.print.enabled).toBe(true);
    expect(getReadableBooks().map(({ id }) => id)).toContain(
      "04-cloudflare",
    );
  });

  it("完整建立开始之前、第 1—12 章、附录与资料来源发布内容", () => {
    const files = readdirSync(contentDirectory)
      .filter((file) => file.endsWith(".mdx"))
      .sort();

    expect(files).toEqual(expectedDrafts.map(({ file }) => file));

    for (const expected of expectedDrafts) {
      const source = readFileSync(
        resolve(contentDirectory, expected.file),
        "utf8",
      );

      expect(frontmatterValue(source, "book")).toBe("04-cloudflare");
      expect(Number(frontmatterValue(source, "order"))).toBe(expected.order);
      expect(frontmatterValue(source, "slug")).toBe(expected.slug);
      expect(frontmatterValue(source, "chapterType")).toBe(
        expected.chapterType,
      );
      expect(frontmatterValue(source, "updatedAt")).toBe(expected.updatedAt);
      expect(frontmatterValue(source, "draft")).toBe("false");
    }
  });

  it("保留单一来源命令与敏感信息边界", () => {
    const source = expectedDrafts
      .map(({ file }) => readFileSync(resolve(contentDirectory, file), "utf8"))
      .join("\n");

    expect(source).not.toContain("<CopyButton");
    expect(source).not.toMatch(/\\bcopyValue\\s*=/);
    expect(source).not.toMatch(
      /\\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\b/i,
    );
    expect(source).not.toMatch(/-----BEGIN .*PRIVATE KEY-----/);
    expect(source).not.toMatch(/\\b(?:token|password)\\s*[:=]\\s*["'][^<>{}]+["']/i);
    expect(source).toContain("http://127.0.0.1:8080");
    expect(source).toContain("app.example.com");
  });

  it("第 1—5 章覆盖已确认的请求、域名与 DNS 安全路径", () => {
    const requestPath = readFileSync(
      resolve(contentDirectory, "01-request-path.mdx"),
      "utf8",
    );
    const domain = readFileSync(
      resolve(contentDirectory, "02-own-domain.mdx"),
      "utf8",
    );
    const onboarding = readFileSync(
      resolve(contentDirectory, "03-add-to-cloudflare.mdx"),
      "utf8",
    );
    const nameservers = readFileSync(
      resolve(contentDirectory, "04-change-nameservers.mdx"),
      "utf8",
    );
    const records = readFileSync(
      resolve(contentDirectory, "05-read-dns-records.mdx"),
      "utf8",
    );

    expect(requestPath).toContain("浏览器 → Cloudflare");
    expect(requestPath).toContain("http://127.0.0.1:8080");
    expect(domain).toContain("当前续费价");
    expect(domain).toContain("不要使用虚假国家");
    expect(onboarding).toContain("快速扫描不是现有 DNS 的完整备份");
    expect(onboarding).toContain("Pending");
    expect(nameservers).toContain("先移除旧 DS");
    expect(nameservers).toContain("多个公共解析器");
    expect(nameservers).toContain("PlatformTabs");
    expect(records).toContain("Proxied");
    expect(records).toContain("DNS only");
    expect(records).toContain("不要在第 5 章抢先手工创建");
  });

  it("第 6—10 章覆盖公开边界、生产 Tunnel、HTTPS 与安全路径", () => {
    const planning = readFileSync(
      resolve(contentDirectory, "06-plan-public-hostname.mdx"),
      "utf8",
    );
    const tunnel = readFileSync(
      resolve(contentDirectory, "07-create-tunnel.mdx"),
      "utf8",
    );
    const route = readFileSync(
      resolve(contentDirectory, "08-publish-application.mdx"),
      "utf8",
    );
    const https = readFileSync(
      resolve(contentDirectory, "09-verify-https.mdx"),
      "utf8",
    );
    const security = readFileSync(
      resolve(contentDirectory, "10-security-boundary.mdx"),
      "utf8",
    );

    expect(planning).toContain("SSH、数据库、管理面板和第二册端口");
    expect(planning).toContain("不新增公网 TCP 8080");
    expect(tunnel).toContain("https://pkg.cloudflare.com/cloudflared noble main");
    expect(tunnel).toContain("read -rsp");
    expect(tunnel).toContain("TCP 或 UDP 7844");
    expect(tunnel).toContain("Healthy 不证明源站或 route 正常");
    expect(route).toContain("第 6 章设计卡");
    expect(route).toContain("第 9 章会继续核对 Universal SSL");
    expect(route).toContain("DNS 记录与 Tunnel 可以分别存在");
    expect(route).toContain("访问者可能看到 `1016`");
    expect(https).toContain("15 分钟至 24 小时");
    expect(https).toContain("BrowserHttpsMock");
    expect(security).toContain("Cloudflare Access");
    expect(security).toContain("默认不会缓存 HTML 或 JSON");
    expect(security).toContain("强制断开仍使用旧 token 的现有连接");
  });

  it("覆盖样章要求的安全与排错事实", () => {
    const start = readFileSync(
      resolve(contentDirectory, "00-introduction.mdx"),
      "utf8",
    );
    const route = readFileSync(
      resolve(contentDirectory, "08-publish-application.mdx"),
      "utf8",
    );
    const troubleshooting = readFileSync(
      resolve(contentDirectory, "11-troubleshooting.mdx"),
      "utf8",
    );

    expect(start).toContain("DNSSEC");
    expect(start).toContain("两因素认证（2FA）");
    expect(start).toContain("不要为了 Tunnel 开放公网 8080");

    expect(route).toContain("Published application");
    expect(route).toContain("HTTPS 不等于只有你能访问");
    expect(route).toContain("TunnelRouteMock");

    expect(troubleshooting).toContain("NXDOMAIN");
    expect(troubleshooting).toContain("Cloudflare Error 1033");
    expect(troubleshooting).toContain("Cloudflare Error 1016");
    expect(troubleshooting).toContain("502 Bad Gateway");
    expect(troubleshooting).toContain("不要先 restart");
    expect(troubleshooting).toContain("TCP/UDP 7844");
    expect(troubleshooting).toContain("第 9 章验证卡");
  });

  it("最后一批覆盖维护交接、Caddy 对照和资料校订边界", () => {
    const handoff = readFileSync(
      resolve(contentDirectory, "12-maintenance-handoff.mdx"),
      "utf8",
    );
    const appendix = readFileSync(
      resolve(contentDirectory, "appendix.mdx"),
      "utf8",
    );
    const sources = readFileSync(
      resolve(contentDirectory, "sources.mdx"),
      "utf8",
    );

    expect(handoff).toContain("Cloudflare zone 为 Active");
    expect(handoff).toContain("临时下线只移除公开入口");
    expect(handoff).toContain("不含秘密的交接卡");
    expect(handoff).toContain("sudo apt install --only-upgrade cloudflared");
    expect(handoff).toContain("12 / 12 章已核验");
    expect(handoff).toContain("不记录、不修改");

    expect(appendix).toContain("Caddy 是对照路径，不是主线的下一步");
    expect(appendix).toContain("reverse_proxy 127.0.0.1:8080");
    expect(appendix).toContain("Full (strict)");
    expect(appendix).toContain("不要把 Flexible 当作修复证书错误的方法");
    expect(appendix).toContain("浏览器通常不信任");

    expect(sources).toContain("当前事实与实机校订日期：**2026-08-23**");
    expect(sources).toContain("已完成脱敏端到端实机校订");
    expect(sources).toContain("https://developers.cloudflare.com/");
    expect(sources).toContain("https://caddyserver.com/docs/");
  });

  it("正式章节 completionId 使用 1—12 的稳定顺序", () => {
    const chapters = expectedDrafts.filter(
      ({ chapterType }) => chapterType === "chapter",
    );

    expect(chapters).toHaveLength(12);
    expect(chapters.map(({ order }) => order)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);

    for (const chapter of chapters) {
      const source = readFileSync(
        resolve(contentDirectory, chapter.file),
        "utf8",
      );

      expect(frontmatterValue(source, "completionId")).toBe(
        `book04-chapter-${chapter.order.toString().padStart(2, "0")}`,
      );
    }
  });

  it("RC 实机方案保持隔离资源、操作闸门和敏感信息边界", () => {
    const runbook = readFileSync(
      resolve(qaDirectory, "field-validation-runbook.md"),
      "utf8",
    );
    const results = readFileSync(
      resolve(qaDirectory, "field-validation-results.md"),
      "utf8",
    );
    const handoff = readFileSync(
      resolve(qaDirectory, "field-validation-handoff.md"),
      "utf8",
    );

    expect(runbook).toContain("第三方注册商中的独立空闲根域名");
    expect(runbook).toContain("为什么不能用 Cloudflare Registrar 新购域名验证全书");
    expect(runbook).toContain("app.<LAB_DOMAIN>");
    expect(runbook).toContain("caddy.<LAB_DOMAIN>");
    expect(runbook).toContain("G8");
    expect(runbook).toContain("一个“继续”只授权当前明确阶段");
    expect(runbook).toContain("不新增公网入站 7844");
    expect(runbook).toContain("公网 TCP 80/443");
    expect(runbook).toContain("公网 80/443/8080 均不可直连");
    expect(runbook).toContain("Owner 已授权进入 `1.0.0-rc.1` 综合验收");
    const qaIpv4Values = `${runbook}\n${results}\n${handoff}`.match(
      /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    );
    expect(new Set(qaIpv4Values)).toEqual(
      new Set(["127.0.0.1", "198.18.0.0"]),
    );

    expect(results).toContain("状态：G1—G8 已脱敏确认并执行");
    expect(results).toContain("G1 域名 | 已确认");
    expect(results).toContain("G2 VPS Deploy | 已确认并执行");
    expect(results).toContain("G3 nameserver / DS | 已确认并执行");
    expect(results).toContain("G4 Tunnel token 安装 | 已确认并执行");
    expect(results).toContain("G6 重启与故障注入 | 已确认并执行");
    expect(results).toContain("G7 Caddy 80/443 | 已确认并执行");
    expect(results).toContain("G8 清理与永久删除 | 已确认并执行");
    expect(results).toContain("| 1 | 第三册交接");
    expect(results).toContain("公网 8080 | 始终不可直连");
    expect(results).toContain("远程 DoH");
    expect(results).toContain("G8 清理与永久删除");
    expect(results).toContain("15 个内容单元均已获得对应阶段");
    expect(results).toContain(
      "当前结论：**G1—G8 与阶段 1—9 已通过，第四册 RC 实机校订完成；这不等于已经发布。**",
    );
    expect(handoff).toContain("状态：G1—G8 与阶段 1—9 已通过");
    expect(handoff).toContain("app.<LAB_DOMAIN>");
    expect(handoff).toContain("G8 已完成");
    expect(results).not.toMatch(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i,
    );
  });

  it("记录 RC 搜索、打印、跨浏览器、性能与费用闭环", () => {
    const release = readFileSync(
      resolve(qaDirectory, "release-candidate.md"),
      "utf8",
    );
    const search = readFileSync(
      resolve(qaDirectory, "search-samples.md"),
      "utf8",
    );

    expect(release).toContain("book04-v1.0.0-rc.1");
    expect(release).toContain("Production build 生成 71 个 HTML");
    expect(release).toContain("Pagefind 1.5.2 索引 60 个正文页");
    expect(release).toContain("Playwright 共 126 项");
    expect(release).toContain("最终 125 页");
    expect(release).toContain("Accessibility 100");
    expect(release).toContain("VPS 已销毁");
    expect(search).toContain("19 / 20 个查询");
    expect(search).toContain("Quick Scan");
  });
});
