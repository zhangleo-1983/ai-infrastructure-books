import {
  expect,
  test,
  type Page,
} from "@playwright/test";
import { book01SearchSamples } from "../fixtures/book01-search-samples";
import { book02SearchSamples } from "../fixtures/book02-search-samples";
import { book03SearchSamples } from "../fixtures/book03-search-samples";

async function observeSearchSamples(
  page: Page,
  samples: readonly {
    query: string;
    expectedSlugs: string[];
    knownLimitation?: string;
  }[],
) {
  const input = page.getByRole("searchbox", { name: "搜索关键词" });
  const observations: Array<{
    query: string;
    expected: string[];
    actual: string[];
    matchedExpectedChapter: boolean;
    knownLimitation?: string;
  }> = [];

  for (const sample of samples) {
    await input.fill(sample.query);
    await page.waitForTimeout(260);
    await expect(page.locator("[data-search-status]")).toHaveAttribute(
      "data-state",
      /ready|empty/,
    );
    const hrefs = await page
      .locator("[data-search-results] a")
      .evaluateAll((links) =>
        links
          .slice(0, 5)
          .map((link) => (link as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
    const matchedExpectedChapter = hrefs.some((href) =>
      sample.expectedSlugs.some((slug) => href.includes(`/${slug}/`)),
    );
    observations.push({
      query: sample.query,
      expected: sample.expectedSlugs,
      actual: hrefs,
      matchedExpectedChapter,
      ...(sample.knownLimitation
        ? { knownLimitation: sample.knownLimitation }
        : {}),
    });

    expect.soft(hrefs.some((href) => href.includes("/print/"))).toBe(false);
    if (!sample.knownLimitation) {
      expect.soft(
        matchedExpectedChapter,
        `${sample.query} 的首批结果未包含预期章节`,
      ).toBe(true);
    }
  }

  return observations;
}

test("第一册 16 个中文搜索样本命中预期章节", async ({
  page,
  browserName,
}, testInfo) => {
  test.skip(browserName !== "chromium");
  await page.goto("books/01-first-vps/08-create-server/");
  await page.getByRole("button", { name: "搜索全书" }).click();
  const observations = await observeSearchSamples(page, book01SearchSamples);

  await testInfo.attach("book01-search-observations", {
    body: JSON.stringify(observations, null, 2),
    contentType: "application/json",
  });
});

test("第二册 16 个中文搜索样本命中预期章节", async ({
  page,
  browserName,
}, testInfo) => {
  test.skip(browserName !== "chromium");
  await page.goto("books/02-overseas-network/02-login-server/");
  await page.getByRole("button", { name: "搜索全书" }).click();
  const observations = await observeSearchSamples(page, book02SearchSamples);

  await testInfo.attach("book02-search-observations", {
    body: JSON.stringify(observations, null, 2),
    contentType: "application/json",
  });
});

test("第三册 25 个中文搜索样本命中预期章节", async ({
  page,
  browserName,
}, testInfo) => {
  test.skip(browserName !== "chromium");
  await page.goto("books/03-docker/09-docker-compose/");
  await page.getByRole("button", { name: "搜索全书" }).click();
  const observations = await observeSearchSamples(page, book03SearchSamples);

  await testInfo.attach("book03-search-observations", {
    body: JSON.stringify(observations, null, 2),
    contentType: "application/json",
  });
});
