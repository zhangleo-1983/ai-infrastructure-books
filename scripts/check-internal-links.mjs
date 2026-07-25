import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(root, process.argv[2] ?? "dist");
const configuredBase = process.env.BASE_PATH?.trim() || "/";
const normalizedBase =
  configuredBase === "/"
    ? "/"
    : `/${configuredBase.replace(/^\/+|\/+$/g, "")}/`;

if (!existsSync(outputDirectory)) {
  console.error(`内部链接检查失败：找不到构建目录 ${outputDirectory}`);
  process.exit(1);
}

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    return statSync(absolutePath).isDirectory()
      ? walk(absolutePath)
      : [absolutePath];
  });
}

function routeForFile(file) {
  const route = relative(outputDirectory, file).split(sep).join("/");
  if (route === "index.html") return "/";
  if (route.endsWith("/index.html")) {
    return `/${route.slice(0, -"index.html".length)}`;
  }
  return `/${route}`;
}

function stripBase(pathname) {
  if (normalizedBase === "/") return pathname;
  const baseWithoutTrailingSlash = normalizedBase.slice(0, -1);
  if (pathname === baseWithoutTrailingSlash) return "/";
  if (pathname.startsWith(normalizedBase)) {
    return `/${pathname.slice(normalizedBase.length)}`;
  }
  return pathname;
}

function fileForPathname(pathname) {
  const decoded = decodeURIComponent(stripBase(pathname));
  const relativePath = decoded.replace(/^\/+/, "");
  if (decoded.endsWith("/")) {
    return resolve(outputDirectory, relativePath, "index.html");
  }
  return resolve(outputDirectory, relativePath);
}

const htmlFiles = walk(outputDirectory).filter((file) => file.endsWith(".html"));
const htmlByFile = new Map(
  htmlFiles.map((file) => [file, readFileSync(file, "utf8")]),
);
const failures = [];
let checkedLinks = 0;

for (const [sourceFile, html] of htmlByFile) {
  const sourceRoute = routeForFile(sourceFile);
  const hrefPattern = /<a\b[^>]*\bhref=(["'])(.*?)\1/gi;
  let match;

  while ((match = hrefPattern.exec(html)) !== null) {
    const href = match[2].trim();
    if (
      href === "" ||
      /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(href)
    ) {
      continue;
    }

    checkedLinks += 1;
    const targetUrl = new URL(href, `https://local.invalid${sourceRoute}`);
    const targetFile = fileForPathname(targetUrl.pathname);

    if (!existsSync(targetFile)) {
      failures.push(
        `${relative(root, sourceFile)} → ${href}（目标文件不存在）`,
      );
      continue;
    }

    if (targetUrl.hash && targetFile.endsWith(".html")) {
      const targetHtml =
        htmlByFile.get(targetFile) ?? readFileSync(targetFile, "utf8");
      const targetId = decodeURIComponent(targetUrl.hash.slice(1));
      const escapedId = targetId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const idPattern = new RegExp(`\\bid=(["'])${escapedId}\\1`);

      if (!idPattern.test(targetHtml)) {
        failures.push(
          `${relative(root, sourceFile)} → ${href}（锚点不存在）`,
        );
      }
    }
  }
}

if (failures.length > 0) {
  console.error("内部链接检查失败：");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `内部链接检查通过：${htmlFiles.length} 个 HTML 页面，${checkedLinks} 个内部链接。`,
  );
}
