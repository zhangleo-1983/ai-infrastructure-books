import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const bookPath = "books/06-dify/";

test.describe("第六册发布候选验收", () => {
  test("封面、完整目录、Dify 主线、章节导航和打印入口", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(bookPath);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toContainText(/搭建自己的 AI 应用/);
    await expect(page.locator("[data-toc-item]")).toHaveCount(15);
    await expect(page.getByRole("link", { name: "开始阅读" })).toBeVisible();
    await expect(page.getByRole("link", { name: "整册打印" })).toBeVisible();
    await page.goto(`${bookPath}05-first-workflow/`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("第一次运行");
    await expect(page.locator(".code-block").first()).toBeVisible();
    await page.goto(`${bookPath}print/`);
    await expect(page.locator("[data-print-chapter]")).toHaveCount(15);
    await expect(page.getByRole("button", { name: "打印或导出 PDF" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("关闭 JavaScript 后排错正文与打印内容仍可阅读", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${bookPath}10-troubleshooting/`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-table-of-contents]")).toHaveAttribute("open", "");
    await expect(page.locator("body")).toContainText("分层排查");
    await expect(page.locator("body")).toContainText("恢复");
    await page.goto(`${bookPath}print/`);
    await expect(page.locator("[data-print-chapter]")).toHaveCount(15);
    await expect(page.locator("body")).toContainText("Dify");
    await context.close();
  });

  for (const viewport of [{ width: 375, height: 667 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1280, height: 800 }, { width: 1440, height: 900 }]) {
    test(`${viewport.width} × ${viewport.height} 无页面级横向溢出`, async ({ page, browserName }) => {
      test.skip(browserName !== "chromium");
      await page.setViewportSize(viewport);
      await page.goto(`${bookPath}05-first-workflow/`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test("深色模式、打印样式与 WCAG A/AA", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium");
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.goto(`${bookPath}05-first-workflow/`);
    await expect(page.locator("html")).toHaveAttribute("data-theme-mode", "system");
    await page.goto(`${bookPath}print/`);
    await page.emulateMedia({ media: "print", colorScheme: "dark" });
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect(page.getByRole("button", { name: "打印或导出 PDF" })).toBeHidden();
    for (const path of [`${bookPath}05-first-workflow/`, `${bookPath}10-troubleshooting/`]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(results.violations, path).toEqual([]);
    }
  });
});
