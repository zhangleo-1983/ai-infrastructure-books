import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const bookPath = "books/03-docker/";

test.describe("第三册发布候选验收", () => {
  test("封面、完整目录、复杂 Compose 章、章节导航和打印入口", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(bookPath);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toContainText(
      /一篇文章掌握\s*Docker/,
    );
    await expect(page.locator("[data-toc-item]")).toHaveCount(15);
    await expect(page.getByRole("link", { name: "开始阅读" })).toBeVisible();
    await expect(page.getByRole("link", { name: "整册打印" })).toBeVisible();

    await page.getByRole("link", { name: "用 Compose 管理服务" }).click();
    await expect(page).toHaveURL(/\/09-docker-compose\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "用 Compose 管理一套服务",
    );
    await expect(page.locator(".code-block")).toHaveCount(24);
    await expect(page.locator(".terminal-mock").first()).toBeVisible();
    await expect(page.locator("table").first()).toBeVisible();

    await page.getByRole("link", { name: /下一章/ }).click();
    await expect(page).toHaveURL(/\/10-troubleshooting\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "定位常见故障",
    );

    await page.goto(`${bookPath}print/`);
    await expect(page.locator("[data-print-chapter]")).toHaveCount(15);
    await expect(
      page.getByRole("button", { name: "打印或导出 PDF" }),
    ).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test("复制成功和失败均提供独立、可感知反馈", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium");
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "clipboard", {
        configurable: true,
        get: () => ({
          writeText: (value: string) => {
            document.documentElement.dataset.copiedCommand = value;
            return Promise.resolve();
          },
        }),
      });
    });
    await page.goto(`${bookPath}03-install-docker/`);
    const copyButtons = page.locator("[data-copy-button]");
    expect(await copyButtons.count()).toBeGreaterThan(5);
    const firstCopyButton = copyButtons.first();
    const secondCopyButton = copyButtons.nth(1);
    await firstCopyButton.click();
    await expect(firstCopyButton).toHaveText("已复制");
    await expect(secondCopyButton).toHaveText("复制");
    await expect(page.locator("html")).toHaveAttribute(
      "data-copied-command",
      /.+/,
    );

    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "clipboard", {
        configurable: true,
        get: () => ({
          writeText: () => Promise.reject(new Error("clipboard denied")),
        }),
      });
      Object.defineProperty(Document.prototype, "execCommand", {
        configurable: true,
        value: () => false,
      });
    });
    await page.reload();
    const failedCopyButton = page.locator("[data-copy-button]").first();
    await failedCopyButton.click();
    await expect(failedCopyButton).toHaveText("复制失败");
    await expect(failedCopyButton).toHaveAccessibleName(
      "复制失败，请手动选择并复制命令",
    );
  });

  test("关闭 JavaScript 后目录、正文、命令与打印内容仍可阅读", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto(`${bookPath}09-docker-compose/`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-table-of-contents]")).toHaveAttribute(
      "open",
      "",
    );
    await expect(page.locator(".code-block pre")).toHaveCount(24);
    expect(
      await page.locator("[data-copy-button]").evaluateAll((buttons) =>
        buttons.every((button) => (button as HTMLElement).hidden),
      ),
    ).toBe(true);

    await page.goto(`${bookPath}print/`);
    await expect(page.locator("[data-print-chapter]")).toHaveCount(15);
    await expect(page.locator("body")).toContainText("Compose Web service");
    await context.close();
  });

  for (const viewport of [
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    test(`${viewport.width} × ${viewport.height} 的复杂章无页面级横向溢出`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== "chromium");
      await page.setViewportSize(viewport);
      await page.goto(`${bookPath}09-docker-compose/`);

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator(".code-block").first()).toBeVisible();
      await expect(page.locator(".terminal-mock").first()).toBeVisible();
      await expect(page.locator("table").first()).toBeVisible();

      if (viewport.width <= 768) {
        const toc = page.locator("[data-table-of-contents]");
        await expect(toc).not.toHaveAttribute("open", "");
        await page.getByText("本册目录", { exact: true }).click();
        await expect(toc).toHaveAttribute("open", "");
        await page.keyboard.press("Escape");
        await expect(toc).not.toHaveAttribute("open", "");
      }
    });
  }

  test("系统深色模式、reduced-motion 和打印浅色样式生效", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium");
    await page.emulateMedia({
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    await page.goto(`${bookPath}09-docker-compose/`);
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme-mode",
      "system",
    );
    const darkScheme = await page.evaluate(() => ({
      mediaMatches: window.matchMedia("(prefers-color-scheme: dark)").matches,
      backgroundToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-bg")
        .trim(),
    }));
    expect(darkScheme).toEqual({
      mediaMatches: true,
      backgroundToken: "#0c121a",
    });
    const progressTransition = await page
      .locator("[data-reading-progress-bar]")
      .evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(Number.parseFloat(progressTransition)).toBeLessThanOrEqual(0.00001);

    await page.goto(`${bookPath}print/`);
    await page.emulateMedia({ media: "print", colorScheme: "dark" });
    await page.evaluate(() =>
      window.dispatchEvent(new Event("beforeprint")),
    );
    await expect(
      page.getByRole("button", { name: "打印或导出 PDF" }),
    ).toBeHidden();
    const colors = await page.locator("body").evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        background: styles.backgroundColor,
        color: styles.color,
      };
    });
    expect(colors.background).toBe("rgb(255, 255, 255)");
    expect(colors.color).not.toBe("rgb(255, 255, 255)");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("代表页面无 WCAG A/AA 自动化违规", async ({
    page,
    browserName,
  }) => {
    test.setTimeout(90_000);
    test.skip(browserName !== "chromium");
    for (const path of [
      bookPath,
      `${bookPath}03-install-docker/`,
      `${bookPath}09-docker-compose/`,
      `${bookPath}10-troubleshooting/`,
      `${bookPath}print/`,
    ]) {
      await page.goto(path);
      await expect(page.locator("main h1")).toHaveCount(1);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations, path).toEqual([]);
    }
  });
});
