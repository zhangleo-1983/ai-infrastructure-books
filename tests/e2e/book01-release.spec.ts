import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const bookPath = "books/01-first-vps/";

test.describe("第一册公开候选关键路径", () => {
  test("封面、仿真创建流程、完成状态、复制、搜索和打印", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(bookPath);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText(/15分钟\s*搞定你的VPS/);
    await expect(page.locator("[data-toc-item]")).toHaveCount(15);
    await expect(page.getByRole("link", { name: "开始阅读" })).toBeVisible();
    await expect(page.getByRole("link", { name: "整册打印" })).toBeVisible();

    await page.getByRole("link", { name: "VPS 到底是什么" }).click();
    await expect(page).toHaveURL(/\/01-what-is-vps\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "你买到的 VPS 到底是什么",
    );

    await page.getByRole("link", { name: "创建服务器配置" }).click();
    await expect(page).toHaveURL(/\/08-create-server\/$/);
    await expect(page.locator(".mock-window")).toHaveCount(4);
    expect(
      await page.locator(".mock-window").evaluateAll((windows) =>
        windows.every((window) =>
          window.textContent?.includes("教学仿真"),
        ),
      ),
    ).toBe(true);
    await expect(
      page.getByText("Deploy · 本章不要点击", { exact: true }),
    ).toBeVisible();

    const completion = page.locator("[data-chapter-complete-control]");
    await completion.check();
    await expect(page.getByText("本章已完成，状态已保存在本机。")).toBeVisible();
    await page.reload();
    await expect(completion).toBeChecked();
    await completion.uncheck();

    await page.goto(`${bookPath}12-first-login-and-handoff/`);
    const windowsKeyTab = page.locator("#book01-key-login-tab-windows");
    await windowsKeyTab.click();
    const windowsKeyCommand = page.locator(
      "#book01-key-login-windows .code-block",
    );
    await expect(windowsKeyCommand).toContainText("USERPROFILE");
    const copyButton = windowsKeyCommand.locator("[data-copy-button]");
    await copyButton.click();
    await expect(copyButton).toHaveText(/已复制|复制失败/);

    await page.getByRole("button", { name: "搜索全书" }).click();
    const search = page.getByRole("searchbox", { name: "搜索关键词" });
    await search.fill("支付宝");
    await expect(page.locator("[data-search-status]")).toContainText("找到");
    await expect(
      page.locator("[data-search-results] small").first(),
    ).toHaveText("第一台 VPS");
    await search.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/books\/01-first-vps\//);

    await page.goto(`${bookPath}print/`);
    await expect(page.locator("[data-print-chapter]")).toHaveCount(15);
    const printButton = page.getByRole("button", {
      name: "打印或导出 PDF",
    });
    await expect(printButton).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() =>
      window.dispatchEvent(new Event("beforeprint")),
    );
    await expect(page.locator("body")).toContainText("教学仿真");
    await expect(page.locator("body")).toContainText(
      'ssh -i "$env:USERPROFILE\\.ssh\\id_ed25519" root@203.0.113.10',
    );
    await expect(page.locator("body")).toContainText(
      "ssh -i ~/.ssh/id_ed25519 root@203.0.113.10",
    );
    await expect(printButton).toBeHidden();
    expect(consoleErrors).toEqual([]);
  });

  test("关闭 JavaScript 后目录、双平台命令和正文仍可阅读", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${bookPath}12-first-login-and-handoff/`);

    await expect(page.locator("[data-table-of-contents]")).toHaveAttribute(
      "open",
      "",
    );
    await expect(page.locator("[data-platform-panel='windows']")).toHaveCount(
      3,
    );
    await expect(page.locator("[data-platform-panel='mac']")).toHaveCount(3);
    expect(
      await page.locator("[data-platform-panel]").evaluateAll((panels) =>
        panels.every((panel) => getComputedStyle(panel).display !== "none"),
      ),
    ).toBe(true);
    await expect(page.locator(".code-block pre")).toHaveCount(9);
    expect(
      await page.locator("[data-copy-button]").evaluateAll((buttons) =>
        buttons.every((button) => (button as HTMLElement).hidden),
      ),
    ).toBe(true);
    await context.close();
  });
});

test.describe("第一册响应式、打印与无障碍", () => {
  for (const viewport of [
    { width: 375, height: 667 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`${viewport.width} × ${viewport.height} 的复杂创建章无页面级横向溢出`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== "chromium");
      await page.setViewportSize(viewport);
      await page.goto(`${bookPath}08-create-server/`);
      await expect(page.locator(".mock-window")).toHaveCount(4);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test("代表页面无 WCAG A/AA 自动化违规", async ({
    page,
    browserName,
  }) => {
    test.setTimeout(90_000);
    test.skip(browserName !== "chromium");
    for (const path of [
      bookPath,
      `${bookPath}06-account-payment-verification/`,
      `${bookPath}08-create-server/`,
      `${bookPath}12-first-login-and-handoff/`,
      `${bookPath}print/`,
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations, path).toEqual([]);
    }
  });
});
