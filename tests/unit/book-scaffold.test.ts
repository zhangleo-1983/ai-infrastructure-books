import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  parseArguments,
  scaffoldBook,
  validateBookId,
} from "../../scripts/create-book.mjs";

const temporaryRoots: string[] = [];

function temporaryProject(): string {
  const root = mkdtempSync(join(tmpdir(), "ai-books-scaffold-"));
  temporaryRoots.push(root);
  mkdirSync(resolve(root, "src/content/books"), { recursive: true });
  mkdirSync(resolve(root, "src/data"), { recursive: true });
  mkdirSync(resolve(root, "docs/qa"), { recursive: true });
  writeFileSync(
    resolve(root, "src/data/books.ts"),
    'export const books = [{ id: "01-first-vps" }];\n',
  );
  return root;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("新书脚手架", () => {
  it("校验稳定书籍 id 和参数", () => {
    expect(validateBookId("01-first-vps")).toBe("01-first-vps");
    expect(() => validateBookId("book 01")).toThrow("二位书号");
    expect(parseArguments([
      "--id",
      "01-first-vps",
      "--with-introduction",
    ])).toMatchObject({
      id: "01-first-vps",
      withIntroduction: true,
      withChapter: false,
    });
  });

  it("默认只创建最小目录与 QA 台账", () => {
    const root = temporaryProject();
    const result = scaffoldBook({ root, id: "01-first-vps" });

    expect(result.registered).toBe(true);
    expect(
      readFileSync(
        resolve(root, "docs/qa/01-first-vps/README.md"),
        "utf8",
      ),
    ).toContain("QA 台账");
    expect(result.createdFiles).toContain(
      resolve(root, "src/content/books/01-first-vps/.gitkeep"),
    );
  });

  it("只有显式请求时才生成两个草稿模板", () => {
    const root = temporaryProject();
    const result = scaffoldBook({
      root,
      id: "11-example-book",
      withIntroduction: true,
      withChapter: true,
      updatedAt: "2026-07-27",
    });

    expect(result.registered).toBe(false);
    expect(
      readFileSync(
        resolve(root, "src/content/books/11-example-book/00-introduction.mdx"),
        "utf8",
      ),
    ).toContain('book: "11-example-book"');
    expect(
      readFileSync(
        resolve(root, "src/content/books/11-example-book/01-chapter.mdx"),
        "utf8",
      ),
    ).toContain("order: 1");
  });

  it("拒绝覆盖已有书籍目录", () => {
    const root = temporaryProject();
    scaffoldBook({ root, id: "01-first-vps" });
    expect(() => scaffoldBook({ root, id: "01-first-vps" })).toThrow(
      "拒绝覆盖",
    );
  });
});
