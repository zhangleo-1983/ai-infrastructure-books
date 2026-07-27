import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import {
  dirname,
  join,
  resolve,
} from "node:path";
import {
  fileURLToPath,
  pathToFileURL,
} from "node:url";

const bookIdPattern = /^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateBookId(id) {
  if (!bookIdPattern.test(id)) {
    throw new Error(
      "书籍 id 必须使用“二位书号-英文-slug”格式，例如 01-first-vps。",
    );
  }
  if (id.endsWith("-print")) {
    throw new Error("书籍 id 不得以保留路由 print 结尾。");
  }
  return id;
}

export function parseArguments(argumentsList) {
  const options = {
    id: "",
    withIntroduction: false,
    withChapter: false,
    help: false,
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else if (argument === "--with-introduction") {
      options.withIntroduction = true;
    } else if (argument === "--with-chapter") {
      options.withChapter = true;
    } else if (argument === "--id") {
      options.id = argumentsList[index + 1] ?? "";
      index += 1;
    } else if (argument.startsWith("--id=")) {
      options.id = argument.slice("--id=".length);
    } else {
      throw new Error(`无法识别的参数：${argument}`);
    }
  }

  if (!options.help) validateBookId(options.id);
  return options;
}

function introductionTemplate(id, updatedAt) {
  return `---
book: "${id}"
order: 0
slug: "start"
title: "开始之前"
shortTitle: "开始之前"
description: "请填写本书开始前需要说明的内容。"
chapterType: "introduction"
updatedAt: "${updatedAt}"
draft: true
---

<!-- 在确认大纲和技术路线后编写正文。 -->
`;
}

function chapterTemplate(id, order, updatedAt) {
  return `---
book: "${id}"
order: ${order}
slug: "01-chapter"
title: "第 1 章标题"
shortTitle: "第 1 章"
description: "请填写本章解决的问题。"
chapterType: "chapter"
updatedAt: "${updatedAt}"
chapterNumber: 1
draft: true
---

<!-- 在确认大纲和技术路线后编写正文。 -->
`;
}

function qaReadme(id, registered) {
  return `# ${id} QA 台账

本目录用于记录该书的内容完整性、搜索样本、打印与发布验收。

- [ ] 书籍注册表已填写并经过复核
- [ ] 章节规划与完成率规则已确认
- [ ] 内容完整性策略已确认
- [ ] 搜索样本已建立
- [ ] 打印与 PDF 已验收
- [ ] 发布候选检查已完成

脚手架运行时注册表状态：${registered ? "已找到对应 id" : "尚未登记，请先更新 src/data/books.ts"}。
`;
}

export function scaffoldBook({
  root,
  id,
  withIntroduction = false,
  withChapter = false,
  updatedAt = new Date().toISOString().slice(0, 10),
}) {
  validateBookId(id);

  const contentDirectory = resolve(root, "src/content/books", id);
  const qaDirectory = resolve(root, "docs/qa", id);
  if (existsSync(contentDirectory) || existsSync(qaDirectory)) {
    throw new Error(
      `拒绝覆盖：${id} 的内容目录或 QA 目录已经存在。`,
    );
  }

  const registryPath = resolve(root, "src/data/books.ts");
  const registrySource = existsSync(registryPath)
    ? readFileSync(registryPath, "utf8")
    : "";
  const registered = registrySource.includes(`id: "${id}"`);

  mkdirSync(contentDirectory, { recursive: true });
  mkdirSync(qaDirectory, { recursive: true });

  const createdFiles = [];
  if (withIntroduction) {
    const path = join(contentDirectory, "00-introduction.mdx");
    writeFileSync(path, introductionTemplate(id, updatedAt));
    createdFiles.push(path);
  }
  if (withChapter) {
    const order = withIntroduction ? 1 : 0;
    const path = join(contentDirectory, "01-chapter.mdx");
    writeFileSync(path, chapterTemplate(id, order, updatedAt));
    createdFiles.push(path);
  }
  if (!withIntroduction && !withChapter) {
    const path = join(contentDirectory, ".gitkeep");
    writeFileSync(path, "");
    createdFiles.push(path);
  }

  const qaPath = join(qaDirectory, "README.md");
  writeFileSync(qaPath, qaReadme(id, registered));
  createdFiles.push(qaPath);

  return {
    id,
    registered,
    contentDirectory,
    qaDirectory,
    createdFiles,
  };
}

function printHelp() {
  process.stdout.write(`创建新书的最小工程目录

用法：
  npm run book:new -- --id 01-first-vps
  npm run book:new -- --id 01-first-vps --with-introduction
  npm run book:new -- --id 01-first-vps --with-introduction --with-chapter

默认不会生成正文文件。脚本不会修改书籍注册表，也不会覆盖已有目录。
`);
}

const entryPath = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : "";

if (entryPath === import.meta.url) {
  try {
    const options = parseArguments(process.argv.slice(2));
    if (options.help) {
      printHelp();
    } else {
      const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
      const result = scaffoldBook({
        root,
        id: options.id,
        withIntroduction: options.withIntroduction,
        withChapter: options.withChapter,
      });
      process.stdout.write(
        [
          `已创建 ${result.id} 的最小工程目录。`,
          result.registered
            ? "书籍注册表中已存在对应 id。"
            : "下一步：在 src/data/books.ts 中登记该书。",
          "脚本没有生成正式正文，也没有修改任何已有书籍。",
          "",
        ].join("\n"),
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`新书脚手架失败：${message}\n`);
    process.exitCode = 1;
  }
}
