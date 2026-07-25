import { describe, expect, it } from "vitest";
import { books, currentBook } from "../../src/data/books";
import { sitePath } from "../../src/lib/site-path";

describe("书目基础数据", () => {
  it("保留十册规划且只有第二册处于当前维护状态", () => {
    expect(books).toHaveLength(10);
    expect(books.filter((book) => book.status === "current")).toHaveLength(1);
    expect(currentBook.number).toBe(2);
    expect(currentBook.slug).toBe("02-overseas-network");
  });

  it("书号和 slug 不重复", () => {
    expect(new Set(books.map((book) => book.number)).size).toBe(books.length);
    expect(new Set(books.map((book) => book.slug)).size).toBe(books.length);
  });
});

describe("部署路径", () => {
  it("支持根路径部署", () => {
    expect(sitePath("/", "/")).toBe("/");
    expect(sitePath("/books/", "/")).toBe("/books/");
  });

  it("支持 GitHub Pages 子路径部署", () => {
    expect(sitePath("/", "/ai-infrastructure-books/")).toBe(
      "/ai-infrastructure-books/",
    );
    expect(sitePath("/books/", "/ai-infrastructure-books/")).toBe(
      "/ai-infrastructure-books/books/",
    );
  });
});
