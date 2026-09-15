import { expect, test } from "@playwright/test";

const mainlineBooks = [
  {
    slug: "06-ai-workpartners",
    title: "AI 工作伙伴入门",
    entries: 15,
    chapter: "02-task-brief",
  },
  {
    slug: "07-prompt-context",
    title: "Prompt 与上下文",
    entries: 15,
    chapter: "04-output-contract",
  },
  {
    slug: "08-skills-plugins-mcp",
    title: "Skill、插件与 MCP",
    entries: 20,
    chapter: "10-credentials",
  },
  {
    slug: "09-vibe-coding",
    title: "Vibe coding",
    entries: 18,
    chapter: "07-browser-check",
  },
  {
    slug: "10-harness",
    title: "Harness",
    entries: 18,
    chapter: "08-regression",
  },
] as const;

test.describe("新主线第六至第十册发布候选", () => {
  test("书目、正文、搜索、完成状态与打印均进入公开构建", async ({ page }) => {
    await page.goto("books/");
    const coreRoute = page.locator(".book-route").first();
    for (const { slug } of mainlineBooks) {
      await expect(
        coreRoute.locator(`a[href$="/books/${slug}/"]`),
      ).toBeVisible();
    }

    for (const { slug, title, entries, chapter } of mainlineBooks) {
      await page.goto(`books/${slug}/`);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main h1")).toContainText(title);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "index,follow",
      );
      await expect(page.getByRole("link", { name: "开始阅读" })).toBeVisible();
      await expect(page.getByRole("link", { name: "整册打印" })).toBeVisible();
      await expect(page.locator("[data-toc-item]")).toHaveCount(entries);

      await page.goto(`books/${slug}/${chapter}/`);
      await expect(page.locator("[data-pagefind-body]")).toHaveCount(1);
      await expect(page.locator("[data-chapter-status-root]")).toHaveAttribute(
        "data-completion-eligible",
        "true",
      );

      await page.goto(`books/${slug}/print/`);
      await expect(page.locator("[data-print-chapter]")).toHaveCount(entries);
    }
  });
});
