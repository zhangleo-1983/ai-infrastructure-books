import { describe, expect, it } from "vitest";
import {
  books,
  getBookById,
  getFeaturedBook,
  getReadableBooks,
} from "../../src/data/books";
import {
  bookHref,
  chapterHref,
  isCompletionEligible,
  isPrintEligible,
  isSearchEligible,
  printHref,
} from "../../src/lib/book-content";
import { sitePath } from "../../src/lib/site-path";

describe("系列书籍注册表", () => {
  it("保留十册规划并公开第一册与第二册发布候选", () => {
    expect(books).toHaveLength(10);
    expect(getReadableBooks()).toHaveLength(2);

    const firstBook = getBookById("01-first-vps");
    expect(firstBook).toBeDefined();
    expect(firstBook?.status).toBe("release-candidate");
    expect(firstBook?.version).toBe("1.0.0-rc.1");
    expect(firstBook?.search.enabled).toBe(true);
    expect(firstBook?.print.enabled).toBe(true);

    const book = getFeaturedBook();
    expect(book.id).toBe("02-overseas-network");
    expect(book.slug).toBe("02-overseas-network");
    expect(book.number).toBe(2);
    expect(book.status).toBe("release-candidate");
    expect(book.version).toBe("1.0.0-rc.1");
  });

  it("每本书具有完整的系列级配置", () => {
    for (const book of books) {
      expect(book.id).toBeTruthy();
      expect(book.slug).toBeTruthy();
      expect(book.title).toBeTruthy();
      expect(book.subtitle).toBeTruthy();
      expect(book.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(book.cover.navigationLabel).toBeTruthy();
      expect(book.cover.titleLines.length).toBeGreaterThan(0);
      expect(book.completion.eligibleChapterTypes.length).toBeGreaterThan(0);
      expect(book.search.indexedChapterTypes.length).toBeGreaterThan(0);
      expect(book.print.includedChapterTypes.length).toBeGreaterThan(0);
    }
  });

  it("书号、id 和 URL slug 不重复", () => {
    expect(new Set(books.map((book) => book.number)).size).toBe(books.length);
    expect(new Set(books.map((book) => book.id)).size).toBe(books.length);
    expect(new Set(books.map((book) => book.slug)).size).toBe(books.length);
  });

  it("书籍 URL 由注册表数据统一生成", () => {
    const book = getBookById("02-overseas-network");
    expect(book).toBeDefined();
    if (!book) return;

    expect(bookHref(book)).toBe("/books/02-overseas-network/");
    expect(chapterHref(book, "01-after-vps")).toBe(
      "/books/02-overseas-network/01-after-vps/",
    );
    expect(printHref(book)).toBe(
      "/books/02-overseas-network/print/",
    );
  });

  it("第一册保持稳定公开 URL", () => {
    const book = getBookById("01-first-vps");
    expect(book).toBeDefined();
    if (!book) return;

    expect(bookHref(book)).toBe("/books/01-first-vps/");
    expect(chapterHref(book, "12-first-login-and-handoff")).toBe(
      "/books/01-first-vps/12-first-login-and-handoff/",
    );
    expect(printHref(book)).toBe("/books/01-first-vps/print/");
  });

  it("完成率、搜索和打印范围由书籍配置驱动", () => {
    const book = getBookById("02-overseas-network");
    expect(book).toBeDefined();
    if (!book) return;

    expect(isCompletionEligible(book, "chapter")).toBe(true);
    expect(isCompletionEligible(book, "introduction")).toBe(false);
    expect(isCompletionEligible(book, "appendix")).toBe(false);
    expect(isCompletionEligible(book, "sources")).toBe(false);
    expect(isSearchEligible(book, "sources")).toBe(true);
    expect(isPrintEligible(book, "sources")).toBe(true);
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
