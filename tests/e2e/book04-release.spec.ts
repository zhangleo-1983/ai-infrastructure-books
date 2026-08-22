import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const bookPath = "books/04-cloudflare/";

test.describe("第四册发布候选验收", () => {
  test("封面、完整目录、Tunnel 主线、章节导航和打印入口", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(bookPath);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toContainText(/让服务拥有域名/);
    await expect(page.locator("[data-toc-item]")).toHaveCount(15);
    await expect(page.getByRole("link", { name: "开始阅读" })).toBeVisible();
    await expect(page.getByRole("link", { name: "整册打印" })).toBeVisible();

    await page.getByRole("link", { name: "连接域名与服务" }).click();
    await expect(page).toHaveURL(/\/08-publish-application\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "把域名连接到本机 Compose 服务",
    );
    await expect(page.locator(".tunnel-route-mock")).toBeVisible();
    await expect(page.locator(".code-block")).toHaveCount(3);

    await page.getByRole("link", { name: /下一章/ }).click();
    await expect(page).toHaveURL(/\/09-verify-https\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "验证 HTTPS 与完整请求路径",
    );

    await page.goto(`${bookPath}print/`);
    await expect(page.locator("[data-print-chapter]")).toHaveCount(15);
    await expect(
      page.getByRole("button", { name: "打印或导出 PDF" }),
    ).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test("关闭 JavaScript 后排错正文、命令与打印内容仍可阅读", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto(`${bookPath}11-troubleshooting/`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-table-of-contents]")).toHaveAttribute(
      "open",
      "",
    );
    await expect(page.locator(".troubleshooting-item")).toHaveCount(7);
    expect(
      await page.locator(".troubleshooting-item__body").evaluateAll((items) =>
        items.every((item) => getComputedStyle(item).display !== "none"),
      ),
    ).toBe(true);
    expect(
      await page.locator("[data-copy-button]").evaluateAll((buttons) =>
        buttons.every((button) => (button as HTMLElement).hidden),
      ),
    ).toBe(true);

    await page.goto(`${bookPath}print/`);
    await expect(page.locator("[data-print-chapter]")).toHaveCount(15);
    await expect(page.locator("body")).toContainText("Full (strict)");
    await context.close();
  });

  for (const viewport of [
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    test(`${viewport.width} × ${viewport.height} 的 route 章无页面级横向溢出`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== "chromium");
      await page.setViewportSize(viewport);
      await page.goto(`${bookPath}08-publish-application/`);

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
      await expect(page.locator(".tunnel-route-mock")).toBeVisible();
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
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.goto(`${bookPath}08-publish-application/`);
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme-mode",
      "system",
    );
    const theme = await page.evaluate(() => ({
      mediaMatches: window.matchMedia("(prefers-color-scheme: dark)").matches,
      backgroundToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-bg")
        .trim(),
    }));
    expect(theme).toEqual({
      mediaMatches: true,
      backgroundToken: "#0c121a",
    });

    await page.goto(`${bookPath}print/`);
    await page.emulateMedia({ media: "print", colorScheme: "dark" });
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect(
      page.getByRole("button", { name: "打印或导出 PDF" }),
    ).toBeHidden();
    const colors = await page.locator("body").evaluate((element) => {
      const styles = getComputedStyle(element);
      return { background: styles.backgroundColor, color: styles.color };
    });
    expect(colors.background).toBe("rgb(255, 255, 255)");
    expect(colors.color).not.toBe("rgb(255, 255, 255)");
  });

  test("代表页面无 WCAG A/AA 自动化违规", async ({
    page,
    browserName,
  }) => {
    test.setTimeout(90_000);
    test.skip(browserName !== "chromium");
    for (const path of [
      bookPath,
      `${bookPath}04-change-nameservers/`,
      `${bookPath}08-publish-application/`,
      `${bookPath}11-troubleshooting/`,
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
