import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const contentRoot = resolve(root, "src/content/books");

interface Entry {
  file: string;
  source: string;
  order: number;
  slug: string;
  chapterNumber: number | undefined;
  completionId: string | undefined;
}

function value(source: string, field: string): string | undefined {
  return source
    .match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");
}

function readBook(bookId: string): Entry[] {
  const directory = resolve(contentRoot, bookId);
  return readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const source = readFileSync(resolve(directory, file), "utf8");
      const chapterNumber = value(source, "chapterNumber");
      return {
        file,
        source,
        order: Number(value(source, "order")),
        slug: value(source, "slug") ?? "",
        chapterNumber: chapterNumber ? Number(chapterNumber) : undefined,
        completionId: value(source, "completionId"),
      };
    })
    .sort((left, right) => left.order - right.order);
}

const books = [
  {
    id: "08-skills-plugins-mcp",
    chapters: 17,
    concepts: [
      "Skill 阅读卡",
      "个人 Skill",
      "能力边界卡",
      "MCP 服务器",
      "只读 MCP",
      "最小权限",
      "凭证台账",
      "数据流",
      "撤销",
    ],
    sources: ["developers.openai.com", "modelcontextprotocol.io"],
  },
  {
    id: "09-vibe-coding",
    chapters: 15,
    concepts: [
      "用户路径",
      "界面草图",
      "项目简报",
      "恢复起点",
      "浏览器验收",
      "假数据",
      "最小修复",
      "无障碍",
      "隐私与安全",
      "原型交接卡",
    ],
    sources: ["developer.mozilla.org", "www.w3.org", "owasp.org"],
  },
  {
    id: "10-harness",
    chapters: 15,
    concepts: [
      "评估协议",
      "最小测试集",
      "评分表",
      "基准样例",
      "人工评审",
      "运行记录",
      "AI 评委",
      "回归检查",
      "端到端",
      "漂移",
      "回滚",
    ],
    sources: ["platform.openai.com", "docs.anthropic.com"],
  },
];

describe.each(books)("$id 完整正文", ({ id, chapters, concepts, sources }) => {
  it(`包含 ${chapters} 章、开始之前、附录和资料来源`, () => {
    const entries = readBook(id);
    const chapterEntries = entries.filter((entry) => entry.chapterNumber);

    expect(entries).toHaveLength(chapters + 3);
    expect(entries.map((entry) => entry.order)).toEqual(
      Array.from({ length: chapters + 3 }, (_, index) => index),
    );
    expect(chapterEntries.map((entry) => entry.chapterNumber)).toEqual(
      Array.from({ length: chapters }, (_, index) => index + 1),
    );
    expect(new Set(entries.map((entry) => entry.slug)).size).toBe(entries.length);
    expect(new Set(chapterEntries.map((entry) => entry.completionId)).size).toBe(
      chapters,
    );
  });

  it("每章保留零基础操作闭环和当前校订日期", () => {
    for (const { file, source } of readBook(id)) {
      expect(source, `${file} 的书籍 id 不正确`).toContain(`book: "${id}"`);
      expect(source, `${file} 的校订日期未更新`).toContain(
        'updatedAt: "2026-09-13"',
      );
      expect(source, `${file} 不应作为单章草稿隐藏`).toContain("draft: false");

      if (/^chapterType:\s*["']chapter["']/m.test(source)) {
        expect(source.length, `${file} 正文过短`).toBeGreaterThan(800);
        expect(source, `${file} 缺少成功状态`).toContain("成功状态");
        expect(source, `${file} 缺少失败判断`).toContain("失败判断");
      }
    }
  });

  it("覆盖规划中的核心交付物", () => {
    const combined = readBook(id).map((entry) => entry.source).join("\n");
    for (const concept of concepts) {
      expect(combined, `缺少核心概念：${concept}`).toContain(concept);
    }
  });

  it("资料来源使用对应官方站点", () => {
    const source = readBook(id).find((entry) => entry.slug === "sources")?.source;
    expect(source).toBeDefined();
    for (const domain of sources) {
      expect(source, `资料来源缺少 ${domain}`).toContain(domain);
    }
    expect(source).toContain("校订日期：2026-09-13");
  });
});
