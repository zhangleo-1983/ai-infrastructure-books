import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  sortBookChapters,
  toBookTocItems,
} from "../../src/data/book02";

const root = resolve(import.meta.dirname, "../..");
const contentDirectory = resolve(
  root,
  "src/content/books/02-overseas-network",
);
const migratedFiles = [
  "00-introduction.mdx",
  "01-after-vps.mdx",
  "02-login-server.mdx",
  "03-understand-3x-ui.mdx",
  "04-install-3x-ui.mdx",
  "05-create-reality-node.mdx",
  "06-subscription.mdx",
  "07-clash-verge-rev.mdx",
  "08-shadowrocket.mdx",
  "09-verify-connection.mdx",
  "10-daily-use.mdx",
  "11-troubleshooting.mdx",
  "12-security-maintenance.mdx",
  "13-appendix.mdx",
  "14-sources.mdx",
];
const expectedSlugs = [
  "start",
  "01-after-vps",
  "02-login-server",
  "03-understand-3x-ui",
  "04-install-3x-ui",
  "05-create-reality-node",
  "06-subscription",
  "07-clash-verge-rev",
  "08-shadowrocket",
  "09-verify-connection",
  "10-daily-use",
  "11-troubleshooting",
  "12-security-maintenance",
  "appendix",
  "sources",
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

describe("第二册 Milestone 3 内容", () => {
  it("只从内容条目的显式 order 排序和生成目录", () => {
    const entries = [
      {
        data: {
          book: "02-overseas-network",
          order: 2,
          slug: "second",
          title: "第二项",
          shortTitle: "第二项",
          description: "第二项说明",
          chapterType: "chapter" as const,
          updatedAt: "2026-07-25",
          draft: false,
          chapterNumber: 2,
        },
      },
      {
        data: {
          book: "02-overseas-network",
          order: 1,
          slug: "first",
          title: "第一项",
          shortTitle: "第一项",
          description: "第一项说明",
          chapterType: "chapter" as const,
          updatedAt: "2026-07-25",
          draft: false,
          chapterNumber: 1,
        },
      },
    ];

    expect(sortBookChapters(entries).map((entry) => entry.data.slug)).toEqual([
      "first",
      "second",
    ]);
    expect(toBookTocItems(entries).map((item) => item.slug)).toEqual([
      "first",
      "second",
    ]);
  });

  it("存在按原型顺序迁移的 15 个 MDX 内容单元", () => {
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

  it("每个内容单元具有唯一 slug，并用显式 order 固定完整顺序", () => {
    const metadata = migratedFiles.map((filename) => {
      const content = readFileSync(resolve(contentDirectory, filename), "utf8");
      const order = Number(content.match(/^order:\s*(\d+)$/m)?.[1]);
      const slug = content.match(/^slug:\s*"([^"]+)"$/m)?.[1];
      return { order, slug };
    });

    expect(metadata.map(({ order }) => order)).toEqual(
      Array.from({ length: 15 }, (_, index) => index),
    );
    expect(metadata.map(({ slug }) => slug)).toEqual(expectedSlugs);
    expect(new Set(metadata.map(({ slug }) => slug)).size).toBe(15);
  });

  it("已迁移章节核心元数据只保存在 Content Collection frontmatter", () => {
    const chapterData = readFileSync(
      resolve(root, "src/data/book02.ts"),
      "utf8",
    );

    expect(chapterData).not.toMatch(/\bslug:\s*"/);
    expect(chapterData).not.toMatch(/\border:\s*\d/);
    expect(chapterData).not.toMatch(/\btitle:\s*"/);
    expect(chapterData).toContain("sortBookChapters");
  });

  it("CodeBlock 用同一个 code 值负责显示和复制", () => {
    const codeBlock = readFileSync(
      resolve(root, "src/components/common/CodeBlock.astro"),
      "utf8",
    );
    expect(codeBlock).toContain("<CopyButton value={code} />");
    expect(codeBlock).toContain("<code>{code}</code></pre>");
    expect(codeBlock).toContain('tabindex="0"');
  });

  it("平台面板的静态 HTML 默认不隐藏任何一套正文", () => {
    const platformTabs = readFileSync(
      resolve(root, "src/components/book/PlatformTabs.astro"),
      "utf8",
    );
    expect(platformTabs).toContain("platforms.map((platform) =>");
    expect(platformTabs).toContain("data-platform-panel={platform.key}");
    expect(platformTabs).not.toMatch(
      /data-platform-panel=\{platform\.key\}[\s\S]{0,120}\shidden(?:\s|>)/,
    );
    expect(platformTabs).toContain(
      "panel.hidden = panel.dataset.platformPanel !== platform",
    );
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

  it("整册打印路由由内容集合按 order 组合，不读取 HTML 原型", () => {
    const printRoute = readFileSync(
      resolve(
        root,
        "src/pages/books/02-overseas-network/print/index.astro",
      ),
      "utf8",
    );

    expect(printRoute).toContain("sortBookChapters");
    expect(printRoute).toContain("data-print-chapter");
    expect(printRoute).toContain("data-order={entry.data.order}");
    expect(printRoute).not.toContain("book02-v1.html");
  });

  it("故障排查正文在无 JavaScript 与打印时保持展开可读", () => {
    const troubleshootingItem = readFileSync(
      resolve(root, "src/components/book/TroubleshootingItem.astro"),
      "utf8",
    );

    expect(troubleshootingItem).toContain(
      '<details class="troubleshooting-item" open',
    );
    expect(troubleshootingItem).toContain(
      ".troubleshooting-item__body {\n      display: block !important;",
    );
  });
});
