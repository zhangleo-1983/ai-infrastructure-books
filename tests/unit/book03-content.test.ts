import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const contentDirectory = resolve(root, "src/content/books/03-docker");

interface ContentUnit {
  filename: string;
  source: string;
  order: number;
  slug: string;
  title: string;
  chapterType: string;
}

function frontmatterValue(source: string, key: string): string {
  const match = source.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?$`, "m"));
  const value = match?.[1];
  if (!value) throw new Error(`缺少 frontmatter 字段：${key}`);
  return value.trim();
}

const contentUnits: ContentUnit[] = readdirSync(contentDirectory)
  .filter((filename) => filename.endsWith(".mdx"))
  .map((filename) => {
    const source = readFileSync(resolve(contentDirectory, filename), "utf8");
    return {
      filename,
      source,
      order: Number(frontmatterValue(source, "order")),
      slug: frontmatterValue(source, "slug"),
      title: frontmatterValue(source, "title"),
      chapterType: frontmatterValue(source, "chapterType"),
    };
  })
  .sort((a, b) => a.order - b.order);

const expectedUnits = [
  ["00-introduction.mdx", 0, "start", "introduction"],
  ["01-why-docker.mdx", 1, "01-why-docker", "chapter"],
  ["02-image-and-container.mdx", 2, "02-image-and-container", "chapter"],
  ["03-install-docker.mdx", 3, "03-install-docker", "chapter"],
  ["04-first-container.mdx", 4, "04-first-container", "chapter"],
  ["05-container-lifecycle.mdx", 5, "05-container-lifecycle", "chapter"],
  ["06-publish-ports.mdx", 6, "06-publish-ports", "chapter"],
  ["07-persist-data.mdx", 7, "07-persist-data", "chapter"],
  ["08-config-and-secrets.mdx", 8, "08-config-and-secrets", "chapter"],
  ["09-docker-compose.mdx", 9, "09-docker-compose", "chapter"],
  ["10-troubleshooting.mdx", 10, "10-troubleshooting", "chapter"],
  [
    "11-update-backup-cleanup.mdx",
    11,
    "11-update-backup-cleanup",
    "chapter",
  ],
  ["12-handoff.mdx", 12, "12-handoff", "chapter"],
  ["13-appendix.mdx", 13, "appendix", "appendix"],
  ["14-sources.mdx", 14, "sources", "sources"],
] as const;

const appendix = contentUnits.find((unit) => unit.slug === "appendix")!;
const sources = contentUnits.find((unit) => unit.slug === "sources")!;

describe("第三册完整内容结构", () => {
  it("按显式 order 固定 15 个内容单元", () => {
    expect(
      contentUnits.map(({ filename, order, slug, chapterType }) => [
        filename,
        order,
        slug,
        chapterType,
      ]),
    ).toEqual(expectedUnits);
  });

  it("所有 slug、order 和标题均唯一", () => {
    expect(new Set(contentUnits.map((unit) => unit.slug)).size).toBe(15);
    expect(new Set(contentUnits.map((unit) => unit.order)).size).toBe(15);
    expect(new Set(contentUnits.map((unit) => unit.title)).size).toBe(15);
  });

  it("全部内容进入发布候选，并为实机校订章节记录新日期", () => {
    for (const unit of contentUnits) {
      expect(unit.source).toContain('book: "03-docker"');
      const expectedUpdatedAt =
        (unit.order >= 3 && unit.order <= 12) || unit.slug === "sources"
          ? "2026-08-11"
          : "2026-07-28";
      expect(unit.source).toContain(`updatedAt: "${expectedUpdatedAt}"`);
      expect(unit.source).toMatch(/^draft: false$/m);
    }
  });

  it("完成率只包含第 1—12 章", () => {
    const chapters = contentUnits.filter(
      (unit) => unit.chapterType === "chapter",
    );
    expect(chapters).toHaveLength(12);

    for (const chapter of chapters) {
      expect(chapter.source).toMatch(/^chapterNumber: (?:[1-9]|1[0-2])$/m);
      expect(chapter.source).toMatch(
        /^completionId: "book03-chapter-(?:0[1-9]|1[0-2])"$/m,
      );
      const completionId = frontmatterValue(chapter.source, "completionId");
      expect(chapter.source).toContain(
        `chapterId="${completionId}"`,
      );
    }

    for (const unit of contentUnits.filter(
      (item) => item.chapterType !== "chapter",
    )) {
      expect(unit.source).not.toMatch(/^chapterNumber:/m);
      expect(unit.source).not.toMatch(/^completionId:/m);
    }
  });
});

describe("第三册附录", () => {
  it("覆盖策划规格要求的十类速查内容", () => {
    for (const requiredText of [
      "Docker 对象关系图",
      "常用命令：先按对象分类",
      "`docker run` 与 Compose 字段对照",
      "端口映射检查表",
      "Volume、bind mount 与容器可写层怎样选择",
      "更新前后检查表",
      "高风险命令识别表",
      "故障定位决策树",
      "Compose 项目交接卡速查",
      "核心术语",
    ]) {
      expect(appendix.source).toContain(requiredText);
    }
    expect(appendix.source).toContain("<Glossary>");
  });

  it("危险命令只用于识别，不提供复制组件", () => {
    expect(appendix.source).toContain("docker compose down -v");
    expect(appendix.source).toContain("docker volume prune");
    expect(appendix.source).toContain("docker system prune");
    expect(appendix.source).toContain("--privileged");
    expect(appendix.source).toContain("/var/run/docker.sock");
    expect(appendix.source).not.toContain("<CodeBlock");
    expect(appendix.source).not.toContain("<CopyButton");
  });

  it("同时覆盖 Docker Desktop 与 Dockerfile 的最小认读边界", () => {
    expect(appendix.source).toContain(
      "Docker Engine 与 Docker Desktop 概念对照",
    );
    expect(appendix.source).toContain("本书是否安装");
    expect(appendix.source).toContain("最小认读：Dockerfile 是什么");
    expect(appendix.source).toContain("本册不要求编写或发布镜像");
  });

  it("静态检查清单使用文本方框，不生成无标签表单控件", () => {
    expect(appendix.source).not.toMatch(/^\s*-\s+\[[ xX]\]/m);
    expect(appendix.source.match(/^\s*-\s+□/gm)?.length).toBeGreaterThanOrEqual(
      25,
    );
    expect(sources.source).not.toMatch(/^\s*-\s+\[[ xX]\]/m);
    expect(
      sources.source.match(/^\s*-\s+[□☑]/gm)?.length,
    ).toBeGreaterThanOrEqual(10);
  });
});

describe("第三册资料来源与校订边界", () => {
  it("按七类官方资料组织并记录校订日期", () => {
    for (const section of [
      "安装、系统与权限",
      "容器、镜像与生命周期",
      "网络、端口与防火墙",
      "存储、挂载与备份",
      "Compose、配置与 secrets",
      "Docker daemon 与容器安全",
      "状态、日志与故障排查",
      "更新、日志轮转与安全清理",
    ]) {
      expect(sources.source).toContain(section);
    }
    expect(sources.source).toContain("当前内容校订日期：**2026-08-11**");
  });

  it("外部技术链接只使用 Docker、Ubuntu 官方域名", () => {
    const hrefs = [...sources.source.matchAll(/href="(https:[^"]+)"/g)].map(
      (match) => new URL(match[1]!),
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(35);
    expect(
      hrefs.every((url) =>
        ["docs.docker.com", "hub.docker.com", "ubuntu.com"].includes(
          url.hostname,
        ),
      ),
    ).toBe(true);
    expect(sources.source).not.toContain("target=\"_blank\" rel=\"noreferrer\"");
    expect(sources.source.match(/rel="noopener noreferrer"/g)?.length).toBe(
      hrefs.length,
    );
  });

  it("明确区分单次实机校订、环境差异和发布状态", () => {
    expect(sources.source).toContain("一次实机通过不等于所有环境都会相同");
    expect(sources.source).toContain(
      "已在隔离的 Ubuntu 24.04 LTS、amd64 VPS 连续执行开始检查和第 3—12 章",
    );
    expect(sources.source).toContain("Docker Engine 29.7.2");
    expect(sources.source).toContain("Compose plugin 5.4.0");
    expect(sources.source).toContain(
      "第三册已进入 `1.0.0-rc.1` 发布候选",
    );
    expect(sources.source).toContain("发布候选持续复核清单");
  });
});

describe("跨章对象和安全连续性", () => {
  it("安装验证自动清理临时 hello-world 容器", () => {
    const install = contentUnits.find(
      (unit) => unit.slug === "03-install-docker",
    )!.source;
    expect(install).toContain("sudo docker run --rm hello-world");
    expect(install).toContain("避免留下随机名称的练习对象");
  });

  it("主 Compose 项目保持固定名称、目录、镜像和本机端口", () => {
    for (const slug of [
      "09-docker-compose",
      "10-troubleshooting",
      "11-update-backup-cleanup",
      "12-handoff",
    ]) {
      const source = contentUnits.find((unit) => unit.slug === slug)!.source;
      expect(source).toContain("book03-compose-demo");
      expect(source).toContain("$HOME/docker-labs/compose-web");
      expect(source).toContain("nginx:1.30.4-alpine");
      expect(source).toContain("127.0.0.1:8080");
    }
  });

  it("附录和来源不维护独立复制值或真实凭证", () => {
    for (const source of [appendix.source, sources.source]) {
      expect(source).not.toMatch(/\bcopyValue\s*=/);
      expect(source).not.toMatch(/AKIA[0-9A-Z]{16}/);
      expect(source).not.toContain("BEGIN OPENSSH PRIVATE KEY");
      expect(source).not.toContain("vless://");
    }
  });
});
