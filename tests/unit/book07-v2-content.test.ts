import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const contentRoot = resolve(root, "src/content/books/07-prompt-context");

function readBook() {
  return readdirSync(contentRoot)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => ({
      file,
      source: readFileSync(resolve(contentRoot, file), "utf8"),
    }));
}

describe("新主线第七册内容", () => {
  it("包含开始之前、第 1—12 章、附录和资料来源", () => {
    const entries = readBook();

    expect(entries).toHaveLength(15);
    expect(entries.map(({ file }) => file)).toEqual([
      "00-introduction.mdx",
      "01-goal-reader.mdx",
      "02-context-pack.mdx",
      "03-constraints.mdx",
      "04-output-contract.mdx",
      "05-stepwise.mdx",
      "06-examples.mdx",
      "07-long-tasks.mdx",
      "08-conversation-routing.mdx",
      "09-tool-gates.mdx",
      "10-review-prompt.mdx",
      "11-debug-prompt.mdx",
      "12-prompt-handbook.mdx",
      "appendix.mdx",
      "sources.mdx",
    ]);

    for (const { file, source } of entries) {
      expect(source, `${file} 的书籍 id 不正确`).toContain(
        'book: "07-prompt-context"',
      );
      expect(source, `${file} 不应作为单章草稿隐藏`).toContain("draft: false");
    }
  });

  it("每章都提供零基础操作闭环", () => {
    const chapters = readBook().filter(({ file }) => /^\d{2}-/.test(file));

    expect(chapters).toHaveLength(13);
    for (const { file, source } of chapters) {
      expect(source.length, `${file} 正文过短`).toBeGreaterThan(1_000);
      expect(source, `${file} 缺少成功状态`).toContain("成功状态");
      expect(source, `${file} 缺少失败判断`).toContain("失败判断");
    }
  });

  it("覆盖 Prompt 与上下文任务闭环", () => {
    const source = readBook().map((entry) => entry.source).join("\n");

    for (const concept of [
      "目标与读者",
      "上下文包",
      "约束",
      "输出协议",
      "交接包",
      "工具闸门",
      "独立评审",
      "最小复现",
      "Prompt 手册",
    ]) {
      expect(source, `缺少核心概念：${concept}`).toContain(concept);
    }
  });

  it("使用 OpenAI 与 Anthropic 官方资料并记录校订日期", () => {
    const sources = readFileSync(resolve(contentRoot, "sources.mdx"), "utf8");

    expect(sources).toContain("https://help.openai.com/");
    expect(sources).toContain("https://platform.openai.com/docs/");
    expect(sources).toContain("https://docs.anthropic.com/");
    expect(sources).toContain("https://support.anthropic.com/");
    expect(sources).toContain("校订日期：2026-09-13");
  });
});
