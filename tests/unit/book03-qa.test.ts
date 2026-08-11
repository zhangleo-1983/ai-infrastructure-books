import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { book03SearchSamples } from "../fixtures/book03-search-samples";

const root = resolve(import.meta.dirname, "../..");
const contentDirectory = resolve(root, "src/content/books/03-docker");
const qaDirectory = resolve(root, "docs/qa/03-docker");

function frontmatterValue(source: string, key: string): string {
  const match = source.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?$`, "m"));
  const value = match?.[1];
  if (!value) throw new Error(`缺少 frontmatter 字段：${key}`);
  return value.trim();
}

const contentBySlug = new Map(
  readdirSync(contentDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const source = readFileSync(resolve(contentDirectory, filename), "utf8");
      return [frontmatterValue(source, "slug"), source] as const;
    }),
);

const validationRunbook = readFileSync(
  resolve(qaDirectory, "vps-validation.md"),
  "utf8",
);
const searchReport = readFileSync(
  resolve(qaDirectory, "search-samples.md"),
  "utf8",
);

function searchableText(source: string): string {
  return source
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("zh-CN");
}

describe("第三册 VPS 实机验证台账", () => {
  it("覆盖全部 15 个内容单元并保持显式顺序", () => {
    const expectedSlugs = [
      "start",
      "01-why-docker",
      "02-image-and-container",
      "03-install-docker",
      "04-first-container",
      "05-container-lifecycle",
      "06-publish-ports",
      "07-persist-data",
      "08-config-and-secrets",
      "09-docker-compose",
      "10-troubleshooting",
      "11-update-backup-cleanup",
      "12-handoff",
      "appendix",
      "sources",
    ];

    const positions = expectedSlugs.map((slug) =>
      validationRunbook.indexOf(`\`${slug}\``),
    );
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it("记录环境、安全停止、脱敏证据和结果分类", () => {
    for (const requiredText of [
      "Ubuntu 24.04",
      "`amd64`",
      "第二个已经验证可登录的 SSH 会话",
      "安全停止",
      "环境阻塞",
      "命令纠错",
      "公网 IP、登录密码、SSH 私钥",
      "不要在承载第二册网络服务",
    ]) {
      expect(validationRunbook).toContain(requiredText);
    }
  });

  it("固定跨章对象并禁止现场扩张公网和批量清理范围", () => {
    for (const requiredText of [
      "$HOME/docker-labs/compose-web",
      "book03-compose-demo",
      "nginx:1.30.4-alpine",
      "127.0.0.1:8080",
      "book03-web-data",
      "不得在验证现场临时发明公网开放步骤",
      "已解决的连续性观察项",
      "sudo docker run --rm hello-world",
      "没有使用 prune",
      "docker system prune",
      "docker volume prune",
      "docker compose down -v",
    ]) {
      expect(validationRunbook).toContain(requiredText);
    }
  });

  it("记录实机验证已完成，但仍不等于发布候选", () => {
    expect(validationRunbook).toContain(
      "当前状态：已完成第 3—12 章连续实机校订",
    );
    expect(validationRunbook).toContain("Docker Engine 版本 | 29.7.2");
    expect(validationRunbook).toContain("Docker Compose plugin 版本 | 5.4.0");
    expect(validationRunbook).toContain("仍不是 RC");
    expect(validationRunbook).not.toContain("待填写");
  });
});

describe("第三册中文搜索预期样本", () => {
  it("至少覆盖 20 个互不重复的读者查询", () => {
    expect(book03SearchSamples.length).toBeGreaterThanOrEqual(20);
    expect(
      new Set(book03SearchSamples.map((sample) => sample.query)).size,
    ).toBe(book03SearchSamples.length);
  });

  it("每个预期 slug 都存在，且至少一个预期章节包含查询文本", () => {
    for (const sample of book03SearchSamples) {
      const expectedSources = sample.expectedSlugs.map((slug) => {
        const source = contentBySlug.get(slug);
        expect(source, `${sample.query} 的预期 slug 不存在：${slug}`).toBeDefined();
        return source!;
      });

      const normalizedQuery = searchableText(sample.query);
      expect(
        expectedSources.some((source) =>
          searchableText(source).includes(normalizedQuery),
        ),
        `${sample.query} 未出现在任何预期章节`,
      ).toBe(true);
    }
  });

  it("搜索报告记录 production Pagefind 的实际结果与已知限制", () => {
    expect(searchReport).toContain(
      "当前状态：production Pagefind 样本已验证",
    );
    expect(searchReport).toContain("24 / 25");
    expect(searchReport).toContain("Pagefind 1.5.2");
    expect(searchReport).toContain("未出现 `/print/`");
    expect(searchReport).toContain("端口映射");
    expect(searchReport).toContain("已知中文分词边界");

    for (const sample of book03SearchSamples) {
      expect(searchReport).toContain(`| ${sample.query} |`);
    }
  });
});
