import {
  readFileSync,
  readdirSync,
} from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const contentDirectory = resolve(
  root,
  "src/content/books/01-first-vps",
);
const failures = [];

const expectedUnits = [
  ["00-introduction.mdx", 0, "start", "introduction"],
  ["01-what-is-vps.mdx", 1, "01-what-is-vps", "chapter"],
  ["02-read-a-plan.mdx", 2, "02-read-a-plan", "chapter"],
  ["03-needs-and-budget.mdx", 3, "03-needs-and-budget", "chapter"],
  ["04-choose-provider.mdx", 4, "04-choose-provider", "chapter"],
  ["05-choose-region.mdx", 5, "05-choose-region", "chapter"],
  [
    "06-account-payment-verification.mdx",
    6,
    "06-account-payment-verification",
    "chapter",
  ],
  ["07-login-method.mdx", 7, "07-login-method", "chapter"],
  ["08-create-server.mdx", 8, "08-create-server", "chapter"],
  ["09-order-and-billing.mdx", 9, "09-order-and-billing", "chapter"],
  ["10-instance-ready.mdx", 10, "10-instance-ready", "chapter"],
  [
    "11-purchase-troubleshooting.mdx",
    11,
    "11-purchase-troubleshooting",
    "chapter",
  ],
  [
    "12-first-login-and-handoff.mdx",
    12,
    "12-first-login-and-handoff",
    "chapter",
  ],
  ["13-appendix.mdx", 13, "appendix", "appendix"],
  ["14-sources.mdx", 14, "sources", "sources"],
];

const requiredFrontmatter = [
  "book",
  "order",
  "slug",
  "title",
  "shortTitle",
  "description",
  "chapterType",
  "updatedAt",
  "draft",
];

function field(source, name) {
  return source
    .match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");
}

function count(source, token) {
  return source.split(token).length - 1;
}

const actualFiles = readdirSync(contentDirectory)
  .filter((file) => file.endsWith(".mdx"))
  .sort();
const expectedFiles = expectedUnits.map(([file]) => file);
if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
  failures.push("第一册内容文件与登记的 15 个内容单元不一致");
}

const sources = new Map();
for (const [file, order, slug, chapterType] of expectedUnits) {
  const source = readFileSync(resolve(contentDirectory, file), "utf8");
  sources.set(file, source);

  for (const name of requiredFrontmatter) {
    if (field(source, name) === undefined) {
      failures.push(`${file} 缺少 frontmatter：${name}`);
    }
  }

  if (field(source, "book") !== "01-first-vps") {
    failures.push(`${file} 的 book 不是 01-first-vps`);
  }
  if (Number(field(source, "order")) !== order) {
    failures.push(`${file} 的 order 应为 ${order}`);
  }
  if (field(source, "slug") !== slug) {
    failures.push(`${file} 的 slug 应为 ${slug}`);
  }
  if (field(source, "chapterType") !== chapterType) {
    failures.push(`${file} 的 chapterType 应为 ${chapterType}`);
  }
  if (field(source, "draft") !== "false") {
    failures.push(`${file} 必须进入公开 Release Candidate`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(field(source, "updatedAt") ?? "")) {
    failures.push(`${file} 的 updatedAt 格式无效`);
  }
}

const combined = [...sources.values()].join("\n");
const expectedCounts = new Map([
  ["<section", 146],
  ["<Callout", 51],
  ["<CodeBlock", 14],
  ["<MockWindow", 16],
  ["<MockField", 120],
  ["<MockStatusBadge", 18],
  ["<TerminalMock", 6],
  ["<TroubleshootingItem", 24],
  ["<ChapterChecklist", 12],
  ["<ComparisonTable", 31],
  ["<FlowDiagram", 9],
  ["<InstructionStep", 21],
  ["<PlatformTabs", 5],
  ["<Glossary", 1],
]);
for (const [token, expected] of expectedCounts) {
  const actual = count(combined, token);
  if (actual !== expected) {
    failures.push(`${token} 数量应为 ${expected}，实际 ${actual}`);
  }
}

const requiredContent = [
  "Vultr Cloud Compute",
  "独立公网 IPv4",
  "Ubuntu 24.04 LTS",
  "x86_64 / amd64",
  "Tokyo",
  "Los Angeles",
  "Alipay",
  "账户、支付和实名认证必须使用真实信息",
  "ssh-keygen -t ed25519",
  'ssh -i "$env:USERPROFILE',
  "ssh -i ~/.ssh/id_ed25519 root@203.0.113.10",
  "ssh root@203.0.113.10",
  'code="whoami"',
  'code="sudo whoami"',
  'code="exit"',
  "第二册《拥有自己的海外网络》",
  "教学仿真",
  "不使用返利、推广、邀请码、代付、共享账户或非官方充值链接",
];
for (const text of requiredContent) {
  if (!combined.includes(text)) {
    failures.push(`第一册缺少关键内容：${text}`);
  }
}

for (const [file, , , chapterType] of expectedUnits) {
  const source = sources.get(file);
  if (chapterType === "chapter" && count(source, "<ChapterChecklist") !== 1) {
    failures.push(`${file} 必须且只能包含一个 ChapterChecklist`);
  }
  if (source.includes("<CopyButton") || /\bcopyValue\s*=/.test(source)) {
    failures.push(`${file} 不得维护独立复制值`);
  }
}

const mockWindowSource = readFileSync(
  resolve(root, "src/components/mock-ui/MockWindow.astro"),
  "utf8",
);
if (!mockWindowSource.includes("教学仿真")) {
  failures.push("MockWindow 必须明确标记为教学仿真");
}

const uuidPattern =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;
if (uuidPattern.test(combined)) {
  failures.push("第一册发现形似真实 UUID 的值");
}
const ips = combined.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? [];
const unexpectedIps = [...new Set(ips)].filter(
  (ip) =>
    !ip.startsWith("203.0.113.") &&
    !ip.startsWith("198.51.100.") &&
    !ip.startsWith("192.0.2.") &&
    ip !== "0.0.0.0",
);
if (unexpectedIps.length > 0) {
  failures.push(`第一册发现非文档保留 IPv4：${unexpectedIps.join(", ")}`);
}

if (failures.length > 0) {
  console.error("第一册内容检查失败：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    "第一册内容检查通过：15 个内容单元、12 个编号章、146 个正文区块、51 个提示框、16 个教学仿真窗口、14 个单一来源命令，以及公网 IPv4、支付安全、双认证登录和第二册交接边界。",
  );
}
