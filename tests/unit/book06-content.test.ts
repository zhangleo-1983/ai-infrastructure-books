import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getBookById, getReadableBooks } from "../../src/data/books";

const root = resolve(import.meta.dirname, "../..");
const contentDirectory = resolve(root, "src/content/books/06-dify");
const files = readdirSync(contentDirectory).filter((file) => file.endsWith(".mdx")).sort();
function value(source: string, field: string): string { return source.match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? ""; }

describe("第六册发布候选内容", () => {
  it("注册为 release-candidate 并启用搜索与打印", () => {
    const book = getBookById("06-dify");
    expect(book?.status).toBe("release-candidate");
    expect(book?.version).toBe("1.0.0-rc.1");
    expect(book?.search.enabled).toBe(true);
    expect(book?.print.enabled).toBe(true);
    expect(getReadableBooks().map(({ id }) => id)).toContain("06-dify");
  });
  it("包含 15 个连续内容单元且全部为非草稿", () => {
    expect(files).toHaveLength(15);
    const entries = files.map((file) => { const source = readFileSync(resolve(contentDirectory, file), "utf8"); return { file, source, order: Number(value(source, "order")) }; });
    expect(entries.map(({ order }) => order).sort((a,b) => a-b)).toEqual(Array.from({length:15}, (_, i) => i));
    for (const { source } of entries) {
      expect(value(source, "book")).toBe("06-dify");
      expect(value(source, "updatedAt")).toBe("2026-09-11");
      expect(value(source, "draft")).toBe("false");
    }
  });
  it("保留 Dify 工作流、知识库与恢复主线", () => {
    const all = files.map((file) => readFileSync(resolve(contentDirectory, file), "utf8")).join("\\n");
    expect(all).toContain("Dify");
    expect(all).toContain("知识库");
    expect(all).toContain("恢复");
  });
});
