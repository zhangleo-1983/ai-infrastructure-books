import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { book02ChapterPlan } from "../../src/data/book02";

const root = resolve(import.meta.dirname, "../..");
const contentDirectory = resolve(
  root,
  "src/content/books/02-overseas-network",
);
const migratedFiles = [
  "00-introduction.mdx",
  "01-after-vps.mdx",
  "02-login-server.mdx",
];
const requiredFrontmatterFields = [
  "book",
  "order",
  "slug",
  "title",
  "shortTitle",
  "description",
  "chapterType",
  "updatedAt",
  "draft",
];

describe("第二册 Milestone 2 内容", () => {
  it("只将开始之前、第 1 章和第 2 章标记为可阅读", () => {
    expect(
      book02ChapterPlan
        .filter((chapter) => chapter.migrated)
        .map((chapter) => chapter.slug),
    ).toEqual(["start", "01-after-vps", "02-login-server"]);
    expect(book02ChapterPlan.filter((chapter) => chapter.migrated)).toHaveLength(
      3,
    );
  });

  it("只存在三个本阶段 MDX 文件", () => {
    expect(
      readdirSync(contentDirectory)
        .filter((file) => file.endsWith(".mdx"))
        .sort(),
    ).toEqual(migratedFiles);
  });

  it.each(migratedFiles)("%s 显式声明稳定 frontmatter", (filename) => {
    const content = readFileSync(resolve(contentDirectory, filename), "utf8");
    for (const field of requiredFrontmatterFields) {
      expect(content, `${filename} 缺少 ${field}`).toMatch(
        new RegExp(`^${field}:`, "m"),
      );
    }
  });

  it("CodeBlock 用同一个 code 值负责显示和复制", () => {
    const codeBlock = readFileSync(
      resolve(root, "src/components/common/CodeBlock.astro"),
      "utf8",
    );
    expect(codeBlock).toContain("<CopyButton value={code} />");
    expect(codeBlock).toContain("<pre><code>{code}</code></pre>");
  });

  it("平台面板的静态 HTML 默认不隐藏任何一套正文", () => {
    const platformTabs = readFileSync(
      resolve(root, "src/components/book/PlatformTabs.astro"),
      "utf8",
    );
    const panelOpenTags =
      platformTabs.match(
        /<section[\s\S]*?data-platform-panel="(?:mac|windows)"[\s\S]*?>/g,
      ) ?? [];
    expect(panelOpenTags).toHaveLength(2);
    for (const tag of panelOpenTags) expect(tag).not.toMatch(/\shidden(?:\s|>)/);
  });

  it("保留系统深色模式与打印媒体规则", () => {
    const tokens = readFileSync(
      resolve(root, "src/styles/tokens.css"),
      "utf8",
    );
    const print = readFileSync(resolve(root, "src/styles/print.css"), "utf8");

    expect(tokens).toContain("@media (prefers-color-scheme: dark)");
    expect(tokens).toContain(":root:not([data-theme=\"light\"])");
    expect(tokens).toContain("--color-bg: #0c121a");
    expect(print).toContain("@media print");
    expect(print).toContain("[data-print-hidden]");
    expect(print).toContain('a[href^="http"]::after');
  });

  it("流程图将横向滚动限制在自身容器", () => {
    const flowDiagram = readFileSync(
      resolve(root, "src/components/book/FlowDiagram.astro"),
      "utf8",
    );
    expect(flowDiagram).toMatch(
      /\.flow-diagram__track\s*\{[\s\S]*?width:\s*100%;[\s\S]*?min-width:\s*0;/,
    );
    expect(flowDiagram).toContain("overflow-x: auto");
  });
});
