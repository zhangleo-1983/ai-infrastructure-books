import { expect, test } from "@playwright/test";

const publicPreviews = [
  {
    slug: "07-n8n",
    note: "n8n 实机校订 G1—G8 已完成",
    chapter: "09-webhook-safely",
  },
  {
    slug: "08-supabase",
    note: "未做实机校验，欢迎读者一起参与校验和 update",
    chapter: "06-row-level-security",
  },
  {
    slug: "09-ai-development-environment",
    note: "未做实机校验，欢迎读者一起参与校验和 update",
    chapter: "08-ai-coding-loop",
  },
  {
    slug: "10-server-security-operations",
    note: "未做实机校验，欢迎读者一起参与校验和 update",
    chapter: "08-restore-drill",
  },
] as const;

test.describe("旧版第六至第十册公开预览", () => {
  test("书目页保留独立选读分区和可访问链接", async ({ page }) => {
    await page.goto("books/");
    const section = page.locator(".book-route--optional");
    await expect(section.getByRole("heading", { name: "选读与开源共建" })).toBeVisible();
    await expect(section.locator("li")).toHaveCount(5);

    for (const { slug } of publicPreviews) {
      await expect(section.locator(`a[href$="/books/${slug}/"]`)).toBeVisible();
    }
  });

  test("编写中的选读书册公开但保持预览边界", async ({ page }) => {
    for (const { slug, note, chapter } of publicPreviews) {
      await page.goto(`books/${slug}/`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex,nofollow",
      );
      await expect(page.getByText("公开预览目录")).toBeVisible();
      await expect(page.getByText(note, { exact: false })).toBeVisible();
      await expect(page.getByRole("link", { name: "阅读预览" })).toBeVisible();
      await expect(page.locator("[data-toc-item]")).toHaveCount(15);

      await page.goto(`books/${slug}/${chapter}/`);
      await expect(page.locator(".optional-route-note")).toContainText(
        "选读 · 开源共建",
      );
      await expect(page.locator("[data-pagefind-body]")).toHaveCount(0);
      await expect(
        page.locator("[data-chapter-status-root]"),
      ).toHaveAttribute("data-completion-eligible", "false");
    }
  });

  test("公开预览包含完整打印页并隐藏打印工具栏", async ({ page }) => {
    for (const slug of ["08-supabase", "10-server-security-operations"]) {
      await page.goto(`books/${slug}/print/`);
      await expect(page.locator("[data-print-chapter]")).toHaveCount(15);
      await page.emulateMedia({ media: "print" });
      await expect(page.locator(".print-toolbar")).toBeHidden();
    }
  });
});
