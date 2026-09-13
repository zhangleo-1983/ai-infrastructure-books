import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const contentRoot = resolve(root, "src/content/books/06-ai-workpartners");

function readBook() {
  return readdirSync(contentRoot)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => ({
      file,
      source: readFileSync(resolve(contentRoot, file), "utf8"),
    }));
}

describe("新主线第六册内容", () => {
  it("包含开始之前、第 1—12 章、附录和资料来源", () => {
    const entries = readBook();

    expect(entries).toHaveLength(15);
    expect(entries.map(({ file }) => file)).toEqual([
      "00-introduction.mdx",
      "01-what-tools-do.mdx",
      "02-task-brief.mdx",
      "03-files-and-context.mdx",
      "04-permissions.mdx",
      "05-codex.mdx",
      "06-claude.mdx",
      "07-workbuddy.mdx",
      "08-task-loop.mdx",
      "09-failure-modes.mdx",
      "10-template-library.mdx",
      "11-when-not-to-use-ai.mdx",
      "12-handoff.mdx",
      "appendix.mdx",
      "sources.mdx",
    ]);

    for (const { file, source } of entries) {
      expect(source, `${file} 的书籍 id 不正确`).toContain(
        'book: "06-ai-workpartners"',
      );
      expect(source, `${file} 不应作为单章草稿隐藏`).toContain("draft: false");
    }
  });

  it("每章都保留零基础操作闭环", () => {
    const chapters = readBook().filter(({ file }) => /^\d{2}-/.test(file));

    expect(chapters).toHaveLength(13);
    for (const { file, source } of chapters) {
      expect(source.length, `${file} 正文过短`).toBeGreaterThan(900);
      expect(source, `${file} 缺少成功状态`).toContain("成功状态");
      expect(source, `${file} 缺少失败判断`).toContain("失败判断");
    }
  });

  it("覆盖任务、资料、权限、验证和交接五个核心环节", () => {
    const source = readBook().map((entry) => entry.source).join("\n");

    for (const concept of [
      "任务简报",
      "资料包",
      "最小权限",
      "验收标准",
      "交接卡",
      "停止条件",
    ]) {
      expect(source, `缺少核心概念：${concept}`).toContain(concept);
    }
  });

  it("产品说明只引用 Codex、Claude 和腾讯 WorkBuddy 官方来源", () => {
    const sources = readFileSync(resolve(contentRoot, "sources.mdx"), "utf8");

    expect(sources).toContain("https://learn.chatgpt.com/");
    expect(sources).toContain("https://support.anthropic.com/");
    expect(sources).toContain("https://docs.anthropic.com/");
    expect(sources).toContain("https://www.workbuddy.ai/");
    expect(sources).toContain("https://www.workbuddy.cn/");
    expect(sources).toContain("校订日期：2026-09-12");
  });
});
