import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const bookPath = "books/02-overseas-network/";

test.describe("第二册发布候选关键路径", () => {
  test("封面、章节、交互、搜索和打印入口", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(bookPath);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText(/拥有自己的\s*海外网络/);
    await expect(page.getByRole("link", { name: "开始阅读" })).toBeVisible();

    await page.getByRole("link", { name: "买好 VPS，然后呢" }).click();
    await expect(page).toHaveURL(/\/01-after-vps\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "VPS 已经买好了",
    );

    await page.getByRole("link", { name: "登录服务器" }).click();
    await expect(page).toHaveURL(/\/02-login-server\/$/);

    const windowsTab = page.locator("#ssh-platform-tab-windows");
    const macTab = page.locator("#ssh-platform-tab-mac");
    await windowsTab.click();
    await expect(windowsTab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#ssh-platform-windows")).toBeVisible();
    await macTab.click();
    await expect(macTab).toHaveAttribute("aria-selected", "true");

    const keyWindowsTab = page.locator("#ssh-key-platform-tab-windows");
    const keyMacTab = page.locator("#ssh-key-platform-tab-mac");
    await keyWindowsTab.click();
    await expect(
      page.locator("#ssh-key-platform-windows .code-block pre"),
    ).toContainText("USERPROFILE");
    await keyMacTab.click();
    await expect(
      page.locator("#ssh-key-platform-mac .code-block pre"),
    ).toContainText("~/.ssh/id_ed25519");

    await keyWindowsTab.click();
    const firstCopyButton = page.locator(
      "#ssh-key-platform-windows [data-copy-button]",
    );
    await expect(firstCopyButton).toHaveAccessibleName("复制命令");
    await firstCopyButton.click();
    await expect(firstCopyButton).toHaveText(/已复制|复制失败/);

    const completion = page.getByRole("checkbox", {
      name: "我已经成功登录、执行 whoami，并使用 exit 退出。",
    });
    await completion.check();
    await expect(page.getByText("本章已完成，状态已保存在本机。")).toBeVisible();
    await page.reload();
    await expect(completion).toBeChecked();
    await completion.uncheck();

    const theme = page.getByRole("combobox", { name: "配色主题" });
    await theme.selectOption("dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(theme).toHaveValue("dark");
    await theme.selectOption("light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await theme.selectOption("system");
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme-mode",
      "system",
    );

    await page.getByRole("button", { name: "搜索全书" }).click();
    const search = page.getByRole("searchbox", { name: "搜索关键词" });
    await search.fill("VLESS");
    await expect(page.locator("[data-search-status]")).toContainText("找到");
    await search.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/books\/02-overseas-network\//);

    await page.goto(`${bookPath}11-troubleshooting/`);
    await expect(
      page.getByRole("heading", { level: 1, name: "常见故障排查" }),
    ).toBeVisible();
    await expect(page.locator(".troubleshooting-item")).toHaveCount(12);
    await expect(page.locator(".troubleshooting-item").first()).toHaveAttribute(
      "open",
      "",
    );

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
    await expect(
      page.locator(
        "[data-source-anchor='ch2'] .troubleshooting-item",
      ).first(),
    ).toHaveAttribute("open", "");
    await expect(
      page.locator(
        "[data-source-anchor='ch2'] .troubleshooting-item__body",
      ).first(),
    ).toBeVisible();
    await expect(page.locator("body")).toContainText(
      '~/.ssh/id_ed25519 root@203.0.113.10',
    );
    await expect(page.locator("body")).toContainText(
      "ssh root@203.0.113.10",
    );
    await expect(printButton).toBeHidden();
    expect(consoleErrors).toEqual([]);
  });

  test("关闭 JavaScript 后正文、目录和双平台内容仍可阅读", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${bookPath}02-login-server/`);

    await expect(page.locator("[data-migrated-content='ch2']")).toBeVisible();
    await expect(page.locator("[data-table-of-contents]")).toHaveAttribute(
      "open",
      "",
    );
    await expect(page.locator("[data-platform-panel='mac']")).toHaveCount(2);
    await expect(page.locator("[data-platform-panel='windows']")).toHaveCount(
      2,
    );
    expect(
      await page.locator("[data-platform-panel]").evaluateAll((panels) =>
        panels.every(
          (panel) => getComputedStyle(panel).display !== "none",
        ),
      ),
    ).toBe(true);
    await expect(page.locator(".code-block pre")).toHaveCount(6);
    await expect(page.locator("[data-copy-button]")).toHaveCount(6);
    await expect(
      page.locator(".troubleshooting-item__body").first(),
    ).toBeVisible();
    expect(
      await page.locator("[data-copy-button]").evaluateAll((buttons) =>
        buttons.every((button) => (button as HTMLElement).hidden),
      ),
    ).toBe(true);
    await context.close();
  });

  test("带引号和反斜杠的 Windows SSH 命令可完整复制", async ({
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

    await page.goto(`${bookPath}02-login-server/`);
    const copyButton = page.locator(
      "#ssh-key-platform-windows [data-copy-button]",
    );
    await expect(copyButton).toHaveAccessibleName("复制命令");
    await copyButton.click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-copied-command",
      'ssh -i "$env:USERPROFILE\\.ssh\\id_ed25519" root@203.0.113.10',
    );
    await expect(copyButton).toHaveText("已复制");
  });
});

test.describe("响应式与无障碍", () => {
  const viewports = [
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    test(`${viewport.width} × ${viewport.height} 无页面级横向溢出`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== "chromium");
      await page.setViewportSize(viewport);
      await page.goto(`${bookPath}05-create-reality-node/`);

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator(".mock-window").first()).toBeVisible();

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

  test("SSH 密钥双平台内容在手机与平板宽度无页面级横向溢出", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium");

    for (const viewport of [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`${bookPath}02-login-server/`);
      await page.locator("#ssh-key-platform-tab-windows").click();
      await expect(
        page.locator("#ssh-key-platform-windows .code-block"),
      ).toBeVisible();

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${viewport.width}px`).toBeLessThanOrEqual(1);
    }
  });

  test("WCAG A/AA 自动扫描和页面语义", async ({ page }) => {
    await page.goto(`${bookPath}02-login-server/`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "跳到正文" })).toBeAttached();
    await expect(
      page.locator("[data-toc-item].current a[aria-current='page']"),
    ).toBeAttached();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("代表页面保持单一主标题且无 A/AA 自动化违规", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium");
    for (const path of [
      bookPath,
      `${bookPath}05-create-reality-node/`,
      `${bookPath}11-troubleshooting/`,
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

  test("复制失败提供可感知反馈", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium");
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
    await page.goto(`${bookPath}02-login-server/`);
    const copyButton = page.locator("[data-copy-button]").first();
    await copyButton.click();
    await expect(copyButton).toHaveText("复制失败");
    await expect(copyButton).toHaveAccessibleName(
      "复制失败，请手动选择并复制命令",
    );
    await expect(
      copyButton.locator("xpath=..").locator("[data-copy-feedback]"),
    ).toContainText("请手动选择并复制命令");
  });

  test("搜索弹层键盘关闭和 reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${bookPath}02-login-server/`);
    const searchButton = page.getByRole("button", { name: "搜索全书" });
    await searchButton.click();
    await expect(
      page.getByRole("searchbox", { name: "搜索关键词" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(searchButton).toBeFocused();

    const transition = await page
      .locator("[data-reading-progress-bar]")
      .evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(Number.parseFloat(transition)).toBeLessThanOrEqual(0.00001);
  });
});
