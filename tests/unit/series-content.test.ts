import {
  readFileSync,
  readdirSync,
} from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  books,
  chapterTypes,
  getBookById,
  isReadableBook,
} from "../../src/data/books";

const root = resolve(import.meta.dirname, "../..");
const contentRoot = resolve(root, "src/content/books");
const requiredFields = [
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

interface ParsedContentMetadata {
  book: string;
  order: number;
  slug: string;
  chapterType: string;
  draft: boolean;
}

function frontmatterValue(source: string, field: string): string | undefined {
  return source
    .match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");
}

function parseContentMetadata(
  filename: string,
  source: string,
): ParsedContentMetadata {
  for (const field of requiredFields) {
    expect(source, `${filename} 缺少 ${field}`).toMatch(
      new RegExp(`^${field}:`, "m"),
    );
  }

  return {
    book: frontmatterValue(source, "book") ?? "",
    order: Number(frontmatterValue(source, "order")),
    slug: frontmatterValue(source, "slug") ?? "",
    chapterType: frontmatterValue(source, "chapterType") ?? "",
    draft: frontmatterValue(source, "draft") === "true",
  };
}

function contentDirectories(): string[] {
  return readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function bookContent(bookId: string) {
  const directory = resolve(contentRoot, bookId);
  return readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => {
      const source = readFileSync(resolve(directory, file), "utf8");
      return {
        file,
        source,
        data: parseContentMetadata(`${bookId}/${file}`, source),
      };
    });
}

describe("系列级内容规范", () => {
  it("每个内容目录均对应书籍注册表", () => {
    for (const directory of contentDirectories()) {
      expect(getBookById(directory), `${directory} 未登记`).toBeDefined();
    }
  });

  it("每本可阅读书籍都具有内容，计划书籍不生成空白正文页面", () => {
    const directories = new Set(contentDirectories());
    for (const book of books) {
      if (isReadableBook(book)) {
        expect(directories.has(book.id), `${book.id} 缺少内容目录`).toBe(true);
        expect(bookContent(book.id).length).toBeGreaterThan(0);
      }
    }
  });

  it.each(contentDirectories())(
    "%s 的 frontmatter、slug 和 order 保持稳定",
    (bookId) => {
      const entries = bookContent(bookId);
      const orders = entries.map(({ data }) => data.order);
      const slugs = entries.map(({ data }) => data.slug);

      for (const { file, data } of entries) {
        expect(data.book, `${file} 的 book 与目录不一致`).toBe(bookId);
        expect(chapterTypes, `${file} 的 chapterType 无效`).toContain(
          data.chapterType,
        );
        expect(data.slug, `${file} 缺少 slug`).not.toBe("print");
      }

      expect(new Set(slugs).size).toBe(slugs.length);
      expect(new Set(orders).size).toBe(orders.length);

      const book = getBookById(bookId);
      if (book && isReadableBook(book)) {
        expect([...orders].sort((left, right) => left - right)).toEqual(
          Array.from({ length: entries.length }, (_, index) => index),
        );
      } else {
        expect(
          orders.every((order) => Number.isInteger(order) && order >= 0),
          `${bookId} 的草稿 order 必须是非负整数`,
        ).toBe(true);
      }
    },
  );

  it.each(contentDirectories())(
    "%s 不在 MDX 中维护独立复制值或敏感凭证",
    (bookId) => {
      for (const { file, source } of bookContent(bookId)) {
        expect(source, `${file} 不应直接使用 CopyButton`).not.toContain(
          "<CopyButton",
        );
        expect(source, `${file} 不应声明 copyValue`).not.toMatch(
          /\bcopyValue\s*=/,
        );
        expect(source, `${file} 中发现形似真实 UUID`).not.toMatch(
          /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i,
        );
      }
    },
  );

  it("第一册 Release Candidate 包含开始之前、第 1—12 章、附录和资料来源", () => {
    const entries = bookContent("01-first-vps");

    expect(entries).toHaveLength(15);
    expect(entries.map(({ data }) => data.order)).toEqual(
      Array.from({ length: 15 }, (_, index) => index),
    );
    expect(entries.map(({ data }) => data.slug)).toEqual([
      "start",
      "01-what-is-vps",
      "02-read-a-plan",
      "03-needs-and-budget",
      "04-choose-provider",
      "05-choose-region",
      "06-account-payment-verification",
      "07-login-method",
      "08-create-server",
      "09-order-and-billing",
      "10-instance-ready",
      "11-purchase-troubleshooting",
      "12-first-login-and-handoff",
      "appendix",
      "sources",
    ]);
    expect(entries.every(({ data }) => !data.draft)).toBe(true);
    expect(
      entries.filter(({ data }) => data.chapterType === "chapter"),
    ).toHaveLength(12);
    expect(entries.at(0)?.data.chapterType).toBe("introduction");
    expect(entries.at(-2)?.data.chapterType).toBe("appendix");
    expect(entries.at(-1)?.data.chapterType).toBe("sources");
  });

  it("第三册 Release Candidate 包含开始之前、第 1—12 章、附录和资料来源", () => {
    const entries = bookContent("03-docker");

    expect(entries).toHaveLength(15);
    expect(entries.map(({ data }) => data.order)).toEqual(
      Array.from({ length: 15 }, (_, index) => index),
    );
    expect(entries.map(({ data }) => data.slug)).toEqual([
      "start",
      "01-why-docker",
      "02-image-and-container",
      "03-install-docker",
      "04-first-container",
      "05-container-lifecycle",
      "06-publish-ports",
      "07-persist-data",
      "08-config-and-secrets",
      "09-docker-compose",
      "10-troubleshooting",
      "11-update-backup-cleanup",
      "12-handoff",
      "appendix",
      "sources",
    ]);
    expect(entries.every(({ data }) => !data.draft)).toBe(true);
    expect(
      entries.filter(({ data }) => data.chapterType === "chapter"),
    ).toHaveLength(12);
    expect(entries.at(0)?.data.chapterType).toBe("introduction");
    expect(entries.at(-2)?.data.chapterType).toBe("appendix");
    expect(entries.at(-1)?.data.chapterType).toBe("sources");
  });

  it("第四册 Release Candidate 包含开始之前、第 1—12 章、附录和资料来源", () => {
    const entries = bookContent("04-cloudflare");

    expect(entries).toHaveLength(15);
    expect(entries.map(({ data }) => data.order)).toEqual(
      Array.from({ length: 15 }, (_, index) => index),
    );
    expect(entries.map(({ data }) => data.slug)).toEqual([
      "start",
      "01-request-path",
      "02-own-domain",
      "03-add-to-cloudflare",
      "04-change-nameservers",
      "05-read-dns-records",
      "06-plan-public-hostname",
      "07-create-tunnel",
      "08-publish-application",
      "09-verify-https",
      "10-security-boundary",
      "11-troubleshooting",
      "12-maintenance-handoff",
      "appendix",
      "sources",
    ]);
    expect(entries.every(({ data }) => !data.draft)).toBe(true);
    expect(
      entries.filter(({ data }) => data.chapterType === "chapter"),
    ).toHaveLength(12);
    expect(entries.at(0)?.data.chapterType).toBe("introduction");
    expect(entries.at(-2)?.data.chapterType).toBe("appendix");
    expect(entries.at(-1)?.data.chapterType).toBe("sources");
  });
});
