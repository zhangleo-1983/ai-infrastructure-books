import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getBookById } from "../../src/data/books";

const root = resolve(import.meta.dirname, "../..");
const dir = resolve(root, "src/content/books/07-n8n");
const files = readdirSync(dir).filter((file) => file.endsWith(".mdx")).sort();
function value(source: string, field: string): string { return source.match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? ""; }

describe("第七册样章", () => {
  it("保持 drafting 状态且不启用生产入口", () => {
    const book = getBookById("07-n8n");
    expect(book?.status).toBe("drafting");
    expect(book?.version).toBe("0.0.0");
    expect(book?.search.enabled).toBe(false);
    expect(book?.print.enabled).toBe(false);
  });
  it("包含三篇样章并保持连续 order", () => {
    expect(files).toEqual(["00-introduction.mdx", "01-what-is-n8n.mdx", "02-triggers-and-nodes.mdx", "03-plan-self-hosting.mdx", "04-deploy-n8n.mdx", "05-bootstrap-workspace.mdx", "06-build-first-workflow.mdx", "07-transform-and-branch.mdx", "08-credentials-and-http.mdx", "09-webhook-safely.mdx", "10-executions-and-errors.mdx"]);
    const entries = files.map((file) => { const source = readFileSync(resolve(dir, file), "utf8"); return { source, order: Number(value(source, "order")) }; });
    expect(entries.map(({ order }) => order).sort((a,b) => a-b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const { source } of entries) { expect(value(source, "book")).toBe("07-n8n"); expect(value(source, "draft")).toBe("true"); expect(value(source, "updatedAt")).toBe("2026-09-11"); }
  });
  it("覆盖自动化边界、执行记录与 Webhook 风险", () => {
    const all = files.map((file) => readFileSync(resolve(dir, file), "utf8")).join("\n");
    expect(all).toContain("活动报名整理器");
    expect(all).toContain("执行记录");
    expect(all).toContain("重放");
  });
});
