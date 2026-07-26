import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";
import { parse } from "node-html-parser";

const root = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(root, "dist");
const failures = [];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    return statSync(absolutePath).isDirectory()
      ? walk(absolutePath)
      : [absolutePath];
  });
}

if (!existsSync(outputDirectory)) {
  console.error("发布准备检查失败：请先运行 npm run build。");
  process.exit(1);
}

const htmlFiles = walk(outputDirectory).filter((file) =>
  file.endsWith(".html"),
);
const indexableTitles = new Map();
let externalBlankLinks = 0;

for (const file of htmlFiles) {
  const document = parse(readFileSync(file, "utf8"));
  const fileLabel = relative(root, file);
  const html = document.querySelector("html");
  const title = document.querySelector("title")?.text.trim() ?? "";
  const description =
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content")
      ?.trim() ?? "";
  const robots =
    document
      .querySelector('meta[name="robots"]')
      ?.getAttribute("content")
      ?.toLowerCase() ?? "";

  if (html?.getAttribute("lang") !== "zh-CN") {
    failures.push(`${fileLabel}：html lang 不是 zh-CN`);
  }
  if (document.querySelectorAll("h1").length !== 1) {
    failures.push(`${fileLabel}：必须且只能有一个 h1`);
  }
  if (!title) failures.push(`${fileLabel}：缺少 title`);
  if (!description) failures.push(`${fileLabel}：缺少 description`);

  if (!robots.includes("noindex")) {
    const previous = indexableTitles.get(title);
    if (previous) {
      failures.push(`${fileLabel}：title 与 ${previous} 重复`);
    } else {
      indexableTitles.set(title, fileLabel);
    }
  }

  const ids = document
    .querySelectorAll("[id]")
    .map((element) => element.getAttribute("id"))
    .filter(Boolean);
  const duplicateIds = [...new Set(ids.filter((id, index) =>
    ids.indexOf(id) !== index,
  ))];
  if (duplicateIds.length > 0) {
    failures.push(`${fileLabel}：存在重复 id ${duplicateIds.join(", ")}`);
  }

  for (const link of document.querySelectorAll('a[target="_blank"]')) {
    externalBlankLinks += 1;
    const rel = new Set(
      (link.getAttribute("rel") ?? "").toLowerCase().split(/\s+/),
    );
    if (!rel.has("noopener") || !rel.has("noreferrer")) {
      failures.push(`${fileLabel}：新窗口链接缺少 noopener noreferrer`);
    }
  }
}

const printFile = resolve(
  outputDirectory,
  "books/02-overseas-network/print/index.html",
);
const printDocument = parse(readFileSync(printFile, "utf8"));
if (
  !printDocument
    .querySelector('meta[name="robots"]')
    ?.getAttribute("content")
    ?.includes("noindex")
) {
  failures.push("整册打印页必须 noindex");
}
if (printDocument.querySelector("[data-pagefind-body]")) {
  failures.push("整册打印页不得进入 Pagefind");
}
if (printDocument.querySelectorAll("[data-print-chapter]").length !== 15) {
  failures.push("整册打印页必须包含 15 个内容单元");
}

const coverFile = resolve(
  outputDirectory,
  "books/02-overseas-network/index.html",
);
const coverHtml = readFileSync(coverFile, "utf8");
if (!coverHtml.includes('"@type":"Book"')) {
  failures.push("第二册封面缺少 Book 结构化数据");
}

const chapterFiles = htmlFiles.filter((file) =>
  /books\/02-overseas-network\/(?:start|0\d-|1[0-2]-|appendix|sources)\/index\.html$/.test(
    file,
  ),
);
for (const file of chapterFiles) {
  const html = readFileSync(file, "utf8");
  if (
    !html.includes('"@type":"TechArticle"') &&
    !html.includes('"@type":"Article"')
  ) {
    failures.push(`${relative(root, file)}：缺少章节结构化数据`);
  }
}

const configuredSite = process.env.SITE_URL?.trim();
if (configuredSite) {
  for (const file of htmlFiles) {
    const document = parse(readFileSync(file, "utf8"));
    if (!document.querySelector('link[rel="canonical"]')) {
      failures.push(`${relative(root, file)}：配置 SITE_URL 后缺少 canonical`);
    }
  }
  if (!existsSync(resolve(outputDirectory, "sitemap-index.xml"))) {
    failures.push("配置 SITE_URL 后未生成 sitemap-index.xml");
  }
}

const robotsFile = resolve(outputDirectory, "robots.txt");
if (!existsSync(robotsFile)) failures.push("缺少 robots.txt");

const sourceFiles = walk(resolve(root, "src")).filter((file) =>
  /\.(?:astro|mdx|ts|css)$/.test(file),
);
const sourceText = sourceFiles
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
const uuidPattern =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;
if (uuidPattern.test(sourceText)) {
  failures.push("src 中发现形似真实 UUID 的值");
}
const ipv4Values = sourceText.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? [];
const unexpectedIps = [...new Set(ipv4Values)].filter(
  (ip) =>
    !ip.startsWith("203.0.113.") &&
    !ip.startsWith("198.51.100.") &&
    !ip.startsWith("192.0.2.") &&
    ip !== "0.0.0.0",
);
if (unexpectedIps.length > 0) {
  failures.push(`src 中发现非文档保留 IPv4：${unexpectedIps.join(", ")}`);
}

if (failures.length > 0) {
  console.error("发布准备检查失败：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `发布准备检查通过：${htmlFiles.length} 个 HTML、唯一标题与单一 h1、结构化数据、打印 noindex、${externalBlankLinks} 个安全新窗口链接、示例凭证边界。`,
  );
}
