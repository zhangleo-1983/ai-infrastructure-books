import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  createEmptyReadingState,
  getCompletionSummary,
  parseReadingState,
  setChapterCompleted,
} from "../../src/scripts/chapter-status";
import {
  READING_STATE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../src/scripts/constants";
import { copyText, getCopyFeedback } from "../../src/scripts/copy";
import { calculateReadingProgress } from "../../src/scripts/reading-progress";
import { isThemeMode, resolveTheme } from "../../src/scripts/theme";
import { sitePath } from "../../src/lib/site-path";

const root = resolve(import.meta.dirname, "../..");
const chapterSlugs = Array.from(
  { length: 12 },
  (_, index) => `${String(index + 1).padStart(2, "0")}-chapter`,
);

describe("Milestone 4 基础交互", () => {
  it("主题支持 system、light、dark，并使用命名空间版本键", () => {
    expect(["system", "light", "dark"].every(isThemeMode)).toBe(true);
    expect(isThemeMode("auto")).toBe(false);
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(THEME_STORAGE_KEY).toBe("ai-infrastructure-books:theme:v1");
  });

  it("首屏内联脚本在样式绘制前恢复主题", () => {
    const layout = readFileSync(
      resolve(root, "src/layouts/BaseLayout.astro"),
      "utf8",
    );
    const earlyTheme = layout.indexOf("themeStorageKey");
    const body = layout.indexOf("<body>");

    expect(earlyTheme).toBeGreaterThan(0);
    expect(earlyTheme).toBeLessThan(body);
    expect(layout).toContain('document.documentElement.dataset.js = "true"');
    expect(layout).toContain("root.dataset.themeMode = mode");
  });

  it("阅读进度只按正文几何范围从 0 计算到 100%", () => {
    const geometry = {
      contentTop: 100,
      contentHeight: 2000,
      viewportHeight: 800,
      headerHeight: 64,
    };

    expect(calculateReadingProgress({ ...geometry, scrollY: 0 })).toBe(0);
    expect(calculateReadingProgress({ ...geometry, scrollY: 668 })).toBe(0.5);
    expect(calculateReadingProgress({ ...geometry, scrollY: 1400 })).toBe(1);
  });

  it("完成状态集中保存，可标记、取消并忽略部署 URL", () => {
    let state = createEmptyReadingState();
    state = setChapterCompleted(
      state,
      "02-overseas-network",
      "01-chapter",
      true,
    );
    expect(state.books["02-overseas-network"]?.completed).toEqual([
      "01-chapter",
    ]);

    const restored = parseReadingState(JSON.stringify(state));
    expect(
      getCompletionSummary(restored, "02-overseas-network", chapterSlugs),
    ).toEqual({ completed: 1, total: 12, complete: false });

    state = setChapterCompleted(
      restored,
      "02-overseas-network",
      "01-chapter",
      false,
    );
    expect(state.books["02-overseas-network"]?.completed).toEqual([]);
    expect(READING_STATE_STORAGE_KEY).toBe(
      "ai-infrastructure-books:reading-state:v1",
    );
    expect(JSON.stringify(state)).not.toContain("/books/");
  });

  it("12 个编号章全部完成时才判定整册完成", () => {
    let state = createEmptyReadingState();
    for (const slug of chapterSlugs) {
      state = setChapterCompleted(
        state,
        "02-overseas-network",
        slug,
        true,
      );
    }

    expect(
      getCompletionSummary(state, "02-overseas-network", chapterSlugs),
    ).toEqual({ completed: 12, total: 12, complete: true });
    expect(
      getCompletionSummary(state, "02-overseas-network", [
        ...chapterSlugs,
        "start",
      ]),
    ).toEqual({ completed: 12, total: 13, complete: false });
  });

  it("复制成功与失败都可被调用方判断", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    await copyText("ssh root@example", { writeText });
    expect(writeText).toHaveBeenCalledWith("ssh root@example");

    await expect(
      copyText("ssh root@example", {
        writeText: vi.fn().mockRejectedValue(new Error("denied")),
      }),
    ).rejects.toThrow("denied");

    expect(getCopyFeedback("success")).toEqual({
      label: "已复制",
      ariaLabel: "命令已复制",
      message: "命令已复制到剪贴板。",
    });
    expect(getCopyFeedback("error")).toEqual({
      label: "复制失败",
      ariaLabel: "复制失败，请手动选择并复制命令",
      message: "复制失败，请手动选择并复制命令。",
    });
  });

  it("搜索、复制和手机目录具备渐进增强边界", () => {
    const search = readFileSync(
      resolve(root, "src/scripts/search.ts"),
      "utf8",
    );
    const copyButton = readFileSync(
      resolve(root, "src/components/common/CopyButton.astro"),
      "utf8",
    );
    const mobileToc = readFileSync(
      resolve(root, "src/scripts/mobile-toc.ts"),
      "utf8",
    );
    const chapterRoute = readFileSync(
      resolve(root, "src/pages/books/[book]/[chapter].astro"),
      "utf8",
    );
    const printRoute = readFileSync(
      resolve(
        root,
        "src/pages/books/02-overseas-network/print/index.astro",
      ),
      "utf8",
    );

    expect(search).toContain("data.sub_results?.[0]");
    expect(search).toContain("没有找到与");
    expect(search).toContain("ArrowDown");
    expect(search).toContain('event.key === "Enter"');
    expect(search).toContain("appendSafeExcerpt");
    expect(search).not.toContain("excerptElement.innerHTML");
    expect(copyButton).toContain("data-copy-value={value}");
    expect(copyButton).toMatch(/data-copy-button[\s\S]*hidden/);
    expect(mobileToc).toContain('event.key !== "Escape"');
    expect(mobileToc).toContain('link.addEventListener("click"');
    expect(chapterRoute).toContain("data-pagefind-body");
    expect(printRoute).not.toContain("data-pagefind-body");
  });

  it("子路径链接保留页面尾斜杠，但不破坏静态文件路径", () => {
    expect(sitePath("/books/02-overseas-network/", "/docs/")).toBe(
      "/docs/books/02-overseas-network/",
    );
    expect(sitePath("/favicon.svg", "/docs/")).toBe("/docs/favicon.svg");
    expect(sitePath("/sitemap-index.xml", "/docs/")).toBe(
      "/docs/sitemap-index.xml",
    );
  });
});
