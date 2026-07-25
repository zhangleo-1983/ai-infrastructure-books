import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "node-html-parser";

const root = resolve(import.meta.dirname, "..");
const prototypePath = resolve(root, "source/book02-v1.html");
const ledgerPath = resolve(root, "docs/migration/book02-content-map.md");
const prototype = readFileSync(prototypePath, "utf8");
const ledger = readFileSync(ledgerPath, "utf8");

const expectations = [
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

const failures = [];

for (const [label, pattern, expected] of expectations) {
  const actual = prototype.match(pattern)?.length ?? 0;
  if (actual !== expected) {
    failures.push(`${label}：预期 ${expected}，实际 ${actual}`);
  }
}

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
  if (!ledger.includes(`\`${reference}\``)) {
    failures.push(`迁移台账缺少区块：${reference}`);
  }
}

const migratedUnits = [
  {
    label: "开始之前",
    sourceSelectors: ["#intro"],
    output: "dist/books/02-overseas-network/start/index.html",
    targetAnchor: "intro",
  },
  {
    label: "第 1 章",
    sourceSelectors: ["#ch1", "#ch1-map"],
    output: "dist/books/02-overseas-network/01-after-vps/index.html",
    targetAnchor: "ch1",
  },
  {
    label: "第 2 章",
    sourceSelectors: ["#ch2", "#ch2-ssh", "#ch2-login"],
    output: "dist/books/02-overseas-network/02-login-server/index.html",
    targetAnchor: "ch2",
  },
];

function canonicalNodeText(node, removeSelectors) {
  for (const selector of removeSelectors) {
    for (const descendant of node.querySelectorAll(selector)) {
      descendant.remove();
    }
  }
  for (const pre of node.querySelectorAll("pre")) {
    const replacement = parse(`<span>${pre.innerHTML}</span>`).firstChild;
    if (replacement) pre.replaceWith(replacement);
  }
  return node.innerText
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

const prototypeDocument = parse(prototype);

for (const unit of migratedUnits) {
  const sourceText = unit.sourceSelectors
    .map((selector) => {
      const node = prototypeDocument.querySelector(selector);
      if (!node) {
        failures.push(`${unit.label}：原型缺少 ${selector}`);
        return "";
      }
      return canonicalNodeText(node, [
        "button",
        "input",
        "script",
        "style",
        ".arrow",
        ".next",
      ]);
    })
    .join("");

  const outputPath = resolve(root, unit.output);
  let output;
  try {
    output = readFileSync(outputPath, "utf8");
  } catch {
    failures.push(`${unit.label}：找不到构建页面 ${unit.output}`);
    continue;
  }

  const outputDocument = parse(output);
  const target = outputDocument.querySelector(
    `[data-migrated-content="${unit.targetAnchor}"]`,
  );
  if (!target) {
    failures.push(`${unit.label}：构建页面缺少迁移内容根节点`);
    continue;
  }

  const targetText = canonicalNodeText(target, [
    "button",
    "input",
    "script",
    "style",
    "[data-parity-ignore]",
  ]);

  if (sourceText !== targetText) {
    const firstDifferentIndex = Array.from({
      length: Math.min(sourceText.length, targetText.length),
    }).findIndex((_, index) => sourceText[index] !== targetText[index]);
    const differenceAt =
      firstDifferentIndex === -1
        ? Math.min(sourceText.length, targetText.length)
        : firstDifferentIndex;
    failures.push(
      `${unit.label}：正文对照不一致（原型 ${sourceText.length} 字符，迁移 ${targetText.length} 字符，首个差异位置 ${differenceAt}）`,
    );
  }
}

if (failures.length > 0) {
  console.error("内容基线检查失败：");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `内容完整性检查通过：${expectations.length} 项原型数量基线，${ledgerRefs.length} 个迁移台账区块，${migratedUnits.length} 个内容单元构建后正文对照。`,
  );
}
