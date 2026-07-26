import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "node-html-parser";

const root = resolve(import.meta.dirname, "..");
const prototypePath = resolve(root, "source/book02-v1.html");
const ledgerPath = resolve(root, "docs/migration/book02-content-map.md");
const prototype = readFileSync(prototypePath, "utf8");
const ledger = readFileSync(ledgerPath, "utf8");
const failures = [];

const prototypeExpectations = [
  ["主要 section", /<section\b/g, 33],
  ["编号章节", /class="chapter-head" id="ch\d+"/g, 12],
  ["章节完成项", /class="chapter-check"/g, 12],
  ["复制按钮", /class="copy"/g, 15],
  ["仿真界面", /class="mock"/g, 10],
  ["终端仿真", /class="sim"/g, 3],
  ["流程图", /class="diagram"/g, 4],
  ["故障排查项", /<details\b/g, 12],
  ["术语", /<dt>/g, 12],
  ["提示框", /class="callout(?:\s|")/g, 28],
];

for (const [label, pattern, expected] of prototypeExpectations) {
  const actual = prototype.match(pattern)?.length ?? 0;
  if (actual !== expected) {
    failures.push(`${label}：原型预期 ${expected}，实际 ${actual}`);
  }
}

const units = [
  ["开始之前", ["#intro"], "start", "intro"],
  ["第 1 章", ["#ch1", "#ch1-map"], "01-after-vps", "ch1", [".next"]],
  ["第 2 章", ["#ch2", "#ch2-ssh", "#ch2-login"], "02-login-server", "ch2"],
  ["第 3 章", ["#ch3", "#ch3-panel"], "03-understand-3x-ui", "ch3"],
  ["第 4 章", ["#ch4", "#ch4-install", "#ch4-login"], "04-install-3x-ui", "ch4"],
  ["第 5 章", ["#ch5", "#ch5-fields", "#ch5-save"], "05-create-reality-node", "ch5"],
  ["第 6 章", ["#ch6", "after:#ch6"], "06-subscription", "ch6"],
  ["第 7 章", ["#ch7", "#ch7-import", "#ch7-modes"], "07-clash-verge-rev", "ch7"],
  ["第 8 章", ["#ch8", "after:#ch8"], "08-shadowrocket", "ch8"],
  ["第 9 章", ["#ch9", "after:#ch9"], "09-verify-connection", "ch9"],
  ["第 10 章", ["#ch10", "after:#ch10"], "10-daily-use", "ch10"],
  ["第 11 章", ["#ch11", "after:#ch11"], "11-troubleshooting", "ch11"],
  ["第 12 章", ["#ch12", "after:#ch12"], "12-security-maintenance", "ch12"],
  ["附录", ["#appendix", "after:#appendix"], "appendix", "appendix"],
  ["资料来源", ["#sources"], "sources", "sources"],
].map(([label, sourceSelectors, slug, targetAnchor, removeSource = []]) => ({
  label,
  sourceSelectors,
  slug,
  targetAnchor,
  removeSource,
  output: `dist/books/02-overseas-network/${slug}/index.html`,
}));

const expectedSlugs = units.map((unit) => unit.slug);
const expectedOrders = Array.from({ length: expectedSlugs.length }, (_, index) =>
  String(index),
);
const ledgerRefs = [
  "#cover",
  "#intro",
  "#ch1",
  "#ch1-map",
  "#ch2",
  "#ch2-ssh",
  "#ch2-login",
  "#ch3",
  "#ch3-panel",
  "#ch4",
  "#ch4-install",
  "#ch4-login",
  "#ch5",
  "#ch5-fields",
  "#ch5-save",
  "#ch6",
  "ch6-body",
  "#ch7",
  "#ch7-import",
  "#ch7-modes",
  "#ch8",
  "ch8-body",
  "#ch9",
  "ch9-body",
  "#ch10",
  "ch10-body",
  "#ch11",
  "ch11-body",
  "#ch12",
  "ch12-body",
  "#appendix",
  "appendix-body",
  "#sources",
];

for (const reference of ledgerRefs) {
  const row = ledger
    .split("\n")
    .find((line) => line.startsWith("|") && line.includes(`\`${reference}\``));
  if (!row) {
    failures.push(`迁移台账缺少区块：${reference}`);
    continue;
  }
  if (!row.includes("| 已核对 |")) {
    failures.push(`迁移台账区块尚未核对：${reference}`);
  }
  if (!row.includes("对照通过") && !row.includes("核心文案核对通过")) {
    failures.push(`迁移台账区块缺少校验结果：${reference}`);
  }
}

const prototypeDocument = parse(prototype);

function sourceNode(selector) {
  if (!selector.startsWith("after:")) {
    return prototypeDocument.querySelector(selector);
  }
  const anchorSelector = selector.slice("after:".length);
  const sections = prototypeDocument.querySelectorAll("section");
  const anchorIndex = sections.findIndex((section) =>
    section.matches(anchorSelector),
  );
  return anchorIndex >= 0 ? sections[anchorIndex + 1] : undefined;
}

function canonicalNodeText(node, removeSelectors) {
  const clone = parse(node.toString()).firstChild;
  if (!clone) return "";

  for (const selector of removeSelectors) {
    for (const descendant of clone.querySelectorAll(selector)) {
      descendant.remove();
    }
  }
  for (const pre of clone.querySelectorAll("pre")) {
    const replacement = parse(`<span>${pre.innerHTML}</span>`).firstChild;
    if (replacement) pre.replaceWith(replacement);
  }
  return clone.innerText
    .replace(/&#x([\da-f]+);/gi, (_, value) =>
      String.fromCodePoint(Number.parseInt(value, 16)),
    )
    .replace(/&#(\d+);/g, (_, value) =>
      String.fromCodePoint(Number.parseInt(value, 10)),
    )
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, "");
}

function differenceSummary(sourceText, targetText) {
  const maximumSharedLength = Math.min(sourceText.length, targetText.length);
  let index = 0;
  while (
    index < maximumSharedLength &&
    sourceText[index] === targetText[index]
  ) {
    index += 1;
  }
  const start = Math.max(0, index - 18);
  const end = index + 42;
  return [
    `原型 ${sourceText.length} 字符，迁移 ${targetText.length} 字符，首个差异位置 ${index}`,
    `原型片段「${sourceText.slice(start, end)}」`,
    `迁移片段「${targetText.slice(start, end)}」`,
  ].join("；");
}

function commandValues(rootNode, selector) {
  return rootNode
    .querySelectorAll(selector)
    .map((node) =>
      node.innerHTML
        .replace(/<[^>]+>/g, "")
        .replace(/&#x([\da-f]+);/gi, (_, value) =>
          String.fromCodePoint(Number.parseInt(value, 16)),
        )
        .replace(/&#(\d+);/g, (_, value) =>
          String.fromCodePoint(Number.parseInt(value, 10)),
        )
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&")
        .replace(/\s+/g, ""),
    );
}

const builtDocuments = [];

for (const unit of units) {
  const sourceNodes = unit.sourceSelectors.map((selector) => {
    const node = sourceNode(selector);
    if (!node) failures.push(`${unit.label}：原型缺少 ${selector}`);
    return node;
  });
  if (sourceNodes.some((node) => !node)) continue;

  const sourceText = sourceNodes
    .map((node) =>
      canonicalNodeText(node, [
        ".copy",
        ".tab",
        "input",
        "script",
        "style",
        ".arrow",
        ...unit.removeSource,
      ]),
    )
    .join("");

  let output;
  try {
    output = readFileSync(resolve(root, unit.output), "utf8");
  } catch {
    failures.push(`${unit.label}：找不到构建页面 ${unit.output}`);
    continue;
  }

  const outputDocument = parse(output);
  builtDocuments.push(outputDocument);
  const target = outputDocument.querySelector(
    `[data-migrated-content="${unit.targetAnchor}"]`,
  );
  if (!target) {
    failures.push(`${unit.label}：构建页面缺少迁移内容根节点`);
    continue;
  }

  const targetText = canonicalNodeText(target, [
    ".copy-button",
    "[data-platform-tab]",
    "input",
    "script",
    "style",
    "[data-parity-ignore]",
  ]);

  if (sourceText !== targetText) {
    failures.push(
      `${unit.label}：正文对照不一致（${differenceSummary(sourceText, targetText)}）`,
    );
  }

  const sourceCommands = sourceNodes.flatMap((node) =>
    commandValues(node, ".code pre"),
  );
  const targetCommands = commandValues(target, ".code-block pre");
  if (JSON.stringify(sourceCommands) !== JSON.stringify(targetCommands)) {
    failures.push(
      `${unit.label}：命令对照不一致（原型 ${JSON.stringify(sourceCommands)}，迁移 ${JSON.stringify(targetCommands)}）`,
    );
  }
}

function builtCount(selector) {
  return builtDocuments.reduce(
    (total, document) => total + document.querySelectorAll(selector).length,
    0,
  );
}

const builtExpectations = [
  ["章节页面", "[data-migrated-content]", 15],
  ["章节完成项", ".chapter-checklist", 12],
  ["代码块", ".code-block", 15],
  ["仿真界面", ".mock-window", 10],
  ["终端仿真", ".terminal-mock", 3],
  ["流程图", ".flow-diagram", 4],
  ["故障排查项", ".troubleshooting-item", 12],
  ["术语", ".glossary dt", 12],
  ["提示框", ".callout", 28],
  ["资料来源", ".source-list li", 8],
];

for (const [label, selector, expected] of builtExpectations) {
  const actual = builtCount(selector);
  if (actual !== expected) {
    failures.push(`${label}：构建页面预期 ${expected}，实际 ${actual}`);
  }
}

const coverDocument = parse(
  readFileSync(
    resolve(root, "dist/books/02-overseas-network/index.html"),
    "utf8",
  ),
);
const tocSlugs = coverDocument
  .querySelectorAll(".table-of-contents__item a")
  .map((link) => link.getAttribute("href")?.split("/").filter(Boolean).at(-1));
if (JSON.stringify(tocSlugs) !== JSON.stringify(expectedSlugs)) {
  failures.push(
    `封面目录顺序不一致（预期 ${expectedSlugs.join(", ")}，实际 ${tocSlugs.join(", ")}）`,
  );
}

const printDocument = parse(
  readFileSync(
    resolve(root, "dist/books/02-overseas-network/print/index.html"),
    "utf8",
  ),
);
const printChapters = printDocument.querySelectorAll("[data-print-chapter]");
const printOrders = printChapters.map((node) => node.getAttribute("data-order"));
const printAnchors = printChapters.map((node) =>
  node.getAttribute("data-source-anchor"),
);
if (JSON.stringify(printOrders) !== JSON.stringify(expectedOrders)) {
  failures.push(`整册打印顺序不一致：${printOrders.join(", ")}`);
}
if (
  JSON.stringify(printAnchors) !==
  JSON.stringify(units.map((unit) => unit.targetAnchor))
) {
  failures.push(`整册打印章节不完整：${printAnchors.join(", ")}`);
}
if (failures.length > 0) {
  console.error("内容完整性检查失败：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `内容完整性检查通过：${prototypeExpectations.length} 项原型数量基线，${ledgerRefs.length} 个台账区块，${units.length} 个内容单元逐章正文与命令对照，${builtExpectations.length} 项构建数量，封面目录及整册打印顺序。`,
  );
}
