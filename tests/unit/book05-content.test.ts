import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getBookById, getReadableBooks } from "../../src/data/books";

const root = resolve(import.meta.dirname, "../..");
const contentDirectory = resolve(root, "src/content/books/05-open-webui");
const qaDirectory = resolve(root, "docs/qa/05-open-webui");

const expectedDrafts = [
  {
    file: "00-introduction.mdx",
    order: 0,
    slug: "start",
    chapterType: "introduction",
  },
  {
    file: "01-two-request-paths.mdx",
    order: 1,
    slug: "01-two-request-paths",
    chapterType: "chapter",
    completionId: "book05-chapter-01",
  },
  {
    file: "02-choose-model-provider.mdx",
    order: 2,
    slug: "02-choose-model-provider",
    chapterType: "chapter",
    completionId: "book05-chapter-02",
  },
  {
    file: "03-plan-deployment.mdx",
    order: 3,
    slug: "03-plan-deployment",
    chapterType: "chapter",
    completionId: "book05-chapter-03",
  },
  {
    file: "04-deploy-open-webui.mdx",
    order: 4,
    slug: "04-deploy-open-webui",
    chapterType: "chapter",
    completionId: "book05-chapter-04",
  },
  {
    file: "05-bootstrap-admin.mdx",
    order: 5,
    slug: "05-bootstrap-admin",
    chapterType: "chapter",
    completionId: "book05-chapter-05",
  },
  {
    file: "06-connect-model-provider.mdx",
    order: 6,
    slug: "06-connect-model-provider",
    chapterType: "chapter",
    completionId: "book05-chapter-06",
    updatedAt: "2026-09-11",
  },
  {
    file: "07-publish-with-tunnel.mdx",
    order: 7,
    slug: "07-publish-with-tunnel",
    chapterType: "chapter",
    completionId: "book05-chapter-07",
  },
  {
    file: "08-first-conversation.mdx",
    order: 8,
    slug: "08-first-conversation",
    chapterType: "chapter",
    completionId: "book05-chapter-08",
  },
  {
    file: "09-users-and-privacy.mdx",
    order: 9,
    slug: "09-users-and-privacy",
    chapterType: "chapter",
    completionId: "book05-chapter-09",
  },
  {
    file: "10-backup-and-update.mdx",
    order: 10,
    slug: "10-backup-and-update",
    chapterType: "chapter",
    completionId: "book05-chapter-10",
  },
  {
    file: "11-troubleshooting.mdx",
    order: 11,
    slug: "11-troubleshooting",
    chapterType: "chapter",
    completionId: "book05-chapter-11",
    updatedAt: "2026-09-11",
  },
  {
    file: "12-maintenance-handoff.mdx",
    order: 12,
    slug: "12-maintenance-handoff",
    chapterType: "chapter",
    completionId: "book05-chapter-12",
  },
  {
    file: "appendix.mdx",
    order: 13,
    slug: "appendix",
    chapterType: "appendix",
  },
  {
    file: "sources.mdx",
    order: 14,
    slug: "sources",
    chapterType: "sources",
    updatedAt: "2026-09-11",
  },
] as const;

function frontmatterValue(source: string, field: string): string | undefined {
  return source
    .match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");
}

function sampleSource(filename: string): string {
  return readFileSync(resolve(contentDirectory, filename), "utf8");
}

describe("第五册发布候选内容", () => {
  it("进入 release-candidate、搜索与正式打印", () => {
    const book = getBookById("05-open-webui");

    expect(book).toBeDefined();
    expect(book?.title).toBe(
      "搭建自己的 AI 对话入口：Open WebUI 从部署到维护",
    );
    expect(book?.status).toBe("release-candidate");
    expect(book?.version).toBe("1.0.0-rc.1");
    expect(book?.search.enabled).toBe(true);
    expect(book?.print.enabled).toBe(true);
    expect(getReadableBooks().map(({ id }) => id)).toContain(
      "05-open-webui",
    );
  });

  it("完整建立开始篇、第 1—12 章、附录与资料来源发布内容", () => {
    const files = readdirSync(contentDirectory)
      .filter((file) => file.endsWith(".mdx"))
      .sort();

    expect(files).toEqual(expectedDrafts.map(({ file }) => file).sort());

    for (const expected of expectedDrafts) {
      const source = sampleSource(expected.file);
      expect(frontmatterValue(source, "book")).toBe("05-open-webui");
      expect(Number(frontmatterValue(source, "order"))).toBe(expected.order);
      expect(frontmatterValue(source, "slug")).toBe(expected.slug);
      expect(frontmatterValue(source, "chapterType")).toBe(
        expected.chapterType,
      );
      expect(frontmatterValue(source, "updatedAt")).toBe("2026-09-11");
      expect(frontmatterValue(source, "draft")).toBe("false");
      if ("completionId" in expected) {
        expect(frontmatterValue(source, "completionId")).toBe(
          expected.completionId,
        );
      }
    }
  });

  it("第 1—3 章建立双路径、远程模型决策与部署闸门", () => {
    const paths = sampleSource("01-two-request-paths.mdx");
    const provider = sampleSource("02-choose-model-provider.mdx");
    const planning = sampleSource("03-plan-deployment.mdx");

    expect(paths).toContain("路径 A：浏览器访问路径");
    expect(paths).toContain("路径 B：模型请求路径");
    expect(paths).toContain("自托管界面不等于提示词只留在 VPS");
    expect(provider).toContain("远程 OpenAI-compatible API");
    expect(provider).toContain("最坏可接受支出");
    expect(provider).toContain("独立、最小权限、可撤销");
    expect(planning).toContain("127.0.0.1:3000:8080");
    expect(planning).toContain("v0.11.3");
    expect(planning).toContain("docker compose down -v");
    expect(planning).toContain("必须单独确认");
  });

  it("第 4—5 章固定镜像、回环、volume、Secret 与首位管理员顺序", () => {
    const deployment = sampleSource("04-deploy-open-webui.mdx");
    const bootstrap = sampleSource("05-bootstrap-admin.mdx");

    expect(deployment).toContain("ghcr.io/open-webui/open-webui:v0.11.3");
    expect(deployment).toContain('127.0.0.1:3000:8080');
    expect(deployment).toContain("book05-open-webui-data");
    expect(deployment).toContain("WEBUI_SECRET_KEY");
    expect(deployment).toContain("docker compose config -q");
    expect(deployment).toContain("docker compose down -v");
    expect(bootstrap).toContain("SSH local forwarding");
    expect(bootstrap).toContain("OpenWebUIAdminBootstrapMock");
    expect(bootstrap).toContain("signup 自动关闭");
    expect(bootstrap).toContain("用户总数为 1");
    expect(bootstrap).toContain("WEBUI_AUTH 保持 True");
  });

  it("首轮写作校订更新固定版本并补齐资源清理与地址分支", () => {
    const introduction = sampleSource("00-introduction.mdx");
    const paths = sampleSource("01-two-request-paths.mdx");
    const publish = sampleSource("07-publish-with-tunnel.mdx");
    const update = sampleSource("10-backup-and-update.mdx");
    const sources = sampleSource("sources.mdx");
    const allContent = expectedDrafts
      .map(({ file }) => sampleSource(file))
      .join("\n");
    const editorial = readFileSync(
      resolve(qaDirectory, "editorial-pass-1.md"),
      "utf8",
    );

    expect(introduction).toContain("如果旧 VPS 或 Tunnel 已经清理");
    expect(introduction).toContain("VPS 已销毁，只保留域名与 zone");
    expect(paths).toContain("四个地址分别填在哪里");
    expect(paths).toContain("这条命令由谁执行");
    expect(publish).toContain("第五册专用、");
    expect(publish).toContain("无 route 的 Tunnel 与单 connector");
    expect(update).toContain("migration 失败后应用仍可能半更新启动");
    expect(sources).toContain("Open WebUI v0.11.3 release");
    expect(allContent).not.toContain("v0.11.0");
    expect(editorial).toContain("固定版本从 v0.11.0 更新到 v0.11.3");
    expect(editorial).toContain("未拉取镜像");
  });

  it("开始篇建立双路径、费用、数据和停止边界", () => {
    const source = sampleSource("00-introduction.mdx");

    expect(source).toContain("Open WebUI 是 AI 对话与管理界面，不是大语言模型");
    expect(source).toContain("OpenWebUIPathMap");
    expect(source).toContain("127.0.0.1:3000");
    expect(source).toContain("一次点击可能不只产生一次模型请求");
    expect(source).toContain("自托管 Open WebUI");
    expect(source).toContain("Open WebUI License");
    expect(source).toContain("必须暂停");
  });

  it("第二轮写作校订固定后端模型路径、叠加权限、诊断与交接边界", () => {
    const connection = sampleSource("06-connect-model-provider.mdx");
    const conversation = sampleSource("08-first-conversation.mdx");
    const privacy = sampleSource("09-users-and-privacy.mdx");
    const troubleshooting = sampleSource("11-troubleshooting.mdx");
    const handoff = sampleSource("12-maintenance-handoff.mdx");
    const sources = sampleSource("sources.mdx");
    const editorial = readFileSync(
      resolve(qaDirectory, "editorial-pass-2.md"),
      "utf8",
    );

    expect(connection).toContain("Direct Connections 全局开关为关闭");
    expect(connection).toContain("Settings → Admin → Interface → Tasks");
    expect(conversation).toContain("两个窗口之间仍不断出现请求");
    expect(privacy).toContain("群组权限采用加法");
    expect(privacy).toContain("区分三种分享范围");
    expect(privacy).toContain("ENABLE_ADMIN_EXPORT");
    expect(troubleshooting).toContain("SSH 浏览器页面不再是等价对照");
    expect(troubleshooting).toContain("不临时增加 `localhost`");
    expect(handoff).toContain("一名用户只有一把应用 API key");
    expect(handoff).toContain("Tunnel 来源：安全复用 / 第五册专用");
    expect(sources).toContain("Direct Connections");
    expect(sources).toContain("Task Models");
    expect(editorial).toContain("已完成并通过仓库内验证");
    expect(editorial).toContain("未调用真实模型");
  });

  it("模型连接样章覆盖管理员设置、allowlist、费用和回退", () => {
    const source = sampleSource("06-connect-model-provider.mdx");

    expect(source).toContain("Admin Settings");
    expect(source).toContain("OpenWebUIConnectionMock");
    expect(source).toContain("API base URL");
    expect(source).toContain("Model IDs Filter");
    expect(source).toContain("/v1/chat/completions");
    expect(source).toContain("/models");
    expect(source).toContain("401 Unauthorized");
    expect(source).toContain("429");
    expect(source).toContain("禁用连接并撤销 key");
    expect(source).toContain("docker compose down -v");
    expect(source).toContain("SSH 转发下发送一个连接探针");
    expect(source).toContain("这还不是第一次公开链路真实对话");
    expect(source).toContain("deepseek-flash");
    expect(source).toContain("DeepSeek-V4.1-Flash");
    expect(source).toContain("5 元为人工硬上限");
    expect(source).toContain("Evaluation Arena");
    expect(source).toContain("只回复：BOOK05-RC-OK");
  });

  it("第 7 章先收紧 URL、Origin 与 Cookie，再复用既有 Tunnel 公开", () => {
    const source = sampleSource("07-publish-with-tunnel.mdx");

    expect(source).toContain("WEBUI_URL: \"https://chat.example.com\"");
    expect(source).toContain("CORS_ALLOW_ORIGIN: \"https://chat.example.com\"");
    expect(source).toContain("WEBUI_SESSION_COOKIE_SECURE");
    expect(source).toContain("WEBUI_AUTH_COOKIE_SECURE");
    expect(source).toContain("TunnelRouteMock");
    expect(source).toContain("http://127.0.0.1:3000");
    expect(source).toContain("不会创建第二个 Tunnel");
    expect(source).toContain("保存 route 是一个外部操作闸门");
    expect(source).toContain("没有开放公网 80、443 或 3000");
    expect(source).toContain("环境值正确，不代表 ConfigVar 已更新");
  });

  it("第 8 章用固定低敏感问题验证电脑、手机、流式与实际用量", () => {
    const source = sampleSource("08-first-conversation.mdx");

    expect(source).toContain("publicTestPrompt");
    expect(source).toContain("mobileTestPrompt");
    expect(source).toContain("电脑 1 条，手机 1 条");
    expect(source).toContain("流式回答");
    expect(source).toContain("CORS / WS");
    expect(source).toContain("自托管 Open WebUI 不等于问题只留在自己的 VPS");
    expect(source).toContain("用量持续增长");
    expect(source).toContain("禁用该模型连接");
  });

  it("第 9 章固定角色、最小权限、附件分享与删除边界", () => {
    const source = sampleSource("09-users-and-privacy.mdx");

    expect(source).toContain("admin、user 与 pending");
    expect(source).toContain("signup 关闭");
    expect(source).toContain("文件上传");
    expect(source).toContain("Public sharing");
    expect(source).toContain("Open sharing");
    expect(source).toContain("ENABLE_FORWARD_USER_INFO_HEADERS");
    expect(source).toContain("ENABLE_ADMIN_CHAT_ACCESS");
    expect(source).toContain("删除聊天不等于所有副本都消失");
  });

  it("第 10 章备份精确 volume、验证 hash、隔离恢复并拒绝只降级镜像", () => {
    const source = sampleSource("10-backup-and-update.mdx");

    expect(source).toContain("book05-open-webui-data");
    expect(source).toContain("book05-open-webui-restore-check");
    expect(source).toContain("open-webui-data.tar.gz.sha256");
    expect(source).toContain("--mount type=volume,src=book05-open-webui-data,dst=/data,readonly");
    expect(source).toContain("WEBUI_SECRET_KEY");
    expect(source).toContain("旧镜像不等于回退");
    expect(source).toContain("数据库迁移后不能只降级镜像");
    expect(source).toContain("不使用无人值守自动更新作为主线");
    expect(source).toContain("不能改成 `docker volume prune`");
  });

  it("排错样章先分流两条路径并覆盖应用与模型故障", () => {
    const source = sampleSource("11-troubleshooting.mdx");

    expect(source).toContain("不要先 restart");
    expect(source).toContain("OpenWebUIPathMap");
    expect(source).toContain("Cloudflare Error 1033");
    expect(source).toContain("500 / 502 或其他源站连接错误");
    expect(source).toContain("CORS_ALLOW_ORIGIN");
    expect(source).toContain("WebSocket 403");
    expect(source).toContain("容器中的 localhost 不等于 VPS 主机的 localhost");
    expect(source).toContain("API key、Authorization、Cookie");
    expect(source).toContain("电脑、手机、登录、模型、流式回答、用量");
  });

  it("第 12 章区分巡检、凭证、费用、临时下线与永久退役", () => {
    const source = sampleSource("12-maintenance-handoff.mdx");

    expect(source).toContain("已知正常");
    expect(source).toContain("VPS、域名、模型与备份");
    expect(source).toContain("Open WebUI API key");
    expect(source).toContain("WEBUI_SECRET_KEY");
    expect(source).toContain("只阻止模型费用");
    expect(source).toContain("只停止公开入口");
    expect(source).toContain("永久退役按依赖逆序");
    expect(source).toContain("docker volume prune");
    expect(source).toContain("永久删除必须单独确认精确名称");
    expect(source).toContain("不含秘密的交接卡");
  });

  it("附录提供环境变量、只读命令、错误地图与受限 Ollama 路径图", () => {
    const source = sampleSource("appendix.mdx");

    expect(source).toContain("环境变量速查");
    expect(source).toContain("WEBUI_SESSION_COOKIE_SECURE");
    expect(source).toContain("删除命令不属于速查表");
    expect(source).toContain("错误地图：先判断哪条请求路径失败");
    expect(source).toContain("host.docker.internal:host-gateway");
    expect(source).toContain("http://ollama:11434");
    expect(source).toContain("捆绑镜像");
    expect(source).toContain("不展开第二条教程");
    expect(source).toContain("不会安装 Ollama");
  });

  it("资料来源记录发布候选与实机未覆盖边界", () => {
    const source = sampleSource("sources.mdx");

    expect(source).toContain("15 个发布候选内容单元");
    expect(source).toContain("15 个内容单元均为 `draft: false`");
    expect(source).toContain("RC 实机 G1—G8 已通过");
    expect(source).toContain("Open WebUI API Keys");
    expect(source).toContain("Networking in Compose");
    expect(source).toContain("Starting with Ollama");
    expect(source).toContain("当前未覆盖与已知边界");
    expect(source).toContain("必须保留为未知");
    expect(source).toContain("production、Pagefind、完成状态和正式打印");
  });

  it("三篇样章不维护独立复制值或形似真实秘密", () => {
    const source = expectedDrafts
      .map(({ file }) => sampleSource(file))
      .join("\n");

    expect(source).not.toContain("<CopyButton");
    expect(source).not.toMatch(/\bcopyValue\s*=/);
    expect(source).not.toMatch(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i,
    );
    expect(source).not.toMatch(/\bsk-[A-Za-z0-9_-]{16,}\b/);
    expect(source).not.toMatch(/\beyJ[A-Za-z0-9_-]{20,}\b/);
    expect(source).not.toMatch(/-----BEGIN .*PRIVATE KEY-----/);
    expect(source).toContain("api.example-provider.invalid");
    expect(source).toContain("chat.example.com");
  });

  it("QA 台账明确 G1—G8、发布候选与 production 纳入", () => {
    const readme = readFileSync(resolve(qaDirectory, "README.md"), "utf8");
    const progress = readFileSync(
      resolve(qaDirectory, "content-progress.md"),
      "utf8",
    );
    const samples = readFileSync(
      resolve(qaDirectory, "sample-chapters.md"),
      "utf8",
    );
    const facts = readFileSync(
      resolve(qaDirectory, "fact-check.md"),
      "utf8",
    );

    expect(readme).toContain("production build、Pagefind、完成状态和正式打印已经纳入第五册");
    const firstBatch = readFileSync(
      resolve(qaDirectory, "first-batch.md"),
      "utf8",
    );
    const secondBatch = readFileSync(
      resolve(qaDirectory, "second-batch.md"),
      "utf8",
    );
    const thirdBatch = readFileSync(
      resolve(qaDirectory, "third-batch.md"),
      "utf8",
    );

    expect(progress).toContain("发布候选内容单元：15");
    expect(progress).toContain("真实模型调用：G4—G5 各执行一次固定合成短提示");
    expect(samples).toContain("00-introduction");
    expect(samples).toContain("06-connect-model-provider");
    expect(samples).toContain("11-troubleshooting");
    expect(facts).toContain("RC 实机 G1—G8 已通过");
    expect(facts).toContain("`deepseek-flash`");
    expect(facts).toContain("https://docs.openwebui.com/");
    expect(facts).toContain("必须保留为未知");
    expect(firstBatch).toContain("最新非预发布 release 为 `v0.11.0`");
    expect(firstBatch).toContain("没有拉取 Open WebUI 镜像");
    expect(firstBatch).toContain("检查完成后必须停下等待 Owner 确认");
    expect(secondBatch).toContain("第 7—10 章第二批 draft");
    expect(secondBatch).toContain("没有创建 Cloudflare route");
    expect(secondBatch).toContain("没有发送真实模型请求");
    expect(secondBatch).toContain("production、Pagefind、完成状态和正式打印继续排除第五册");
    expect(thirdBatch).toContain("第 12 章、附录与资料来源第三批 draft");
    expect(thirdBatch).toContain("没有 add、commit、push、部署或发布");
    expect(thirdBatch).toContain("Ollama 只保留路径图");
    expect(thirdBatch).toContain("Owner 对 15 个完整 draft 的整册复核");
  });

  it("独立实机 runbook 固定 G1—G8、费用和安全停止边界", () => {
    const runbook = readFileSync(
      resolve(qaDirectory, "field-validation-runbook.md"),
      "utf8",
    );

    for (let gate = 1; gate <= 8; gate += 1) {
      expect(runbook).toContain(`## G${gate}`);
    }

    expect(runbook).toContain("G1—G8 已通过");
    expect(runbook).toContain("授权按顺序继续 G6—G8");
    expect(runbook).toContain("127.0.0.1:3000");
    expect(runbook).toContain("book05-open-webui-data");
    expect(runbook).toContain("<MODEL_TEST_BUDGET>");
    expect(runbook).toContain("累计达到 4 元停止新增调用");
    expect(runbook).toContain("环境不覆盖");
    expect(runbook).toContain("docker volume prune");
    expect(runbook).toContain("根 zone、nameserver 与 DNSSEC 默认永久保留");
    expect(runbook).toContain("G8 已完成永久清理与费用闭环");
  });

  it("G1—G8 实机结果台账记录完整恢复与费用闭环", () => {
    const results = readFileSync(
      resolve(qaDirectory, "field-validation-results.md"),
      "utf8",
    );

    for (let gate = 1; gate <= 8; gate += 1) {
      expect(results).toMatch(new RegExp(`\\| G${gate} [^\\n]+\\| 已授权 / 已通过 \\|`));
    }

    expect(results).toContain("第五册 G1—G8 已通过");
    expect(results).toContain("VPS 已永久销毁");
    expect(results).toContain("Cloudflare 当前费用为 0");
    expect(results).toContain("G4—G5 共两次固定合成请求");
    expect(results).toContain("VPS 实例 | 已永久销毁");
    expect(results).toContain("旧 key 探针返回 `401`");
    expect(results).not.toMatch(/\bsk-[A-Za-z0-9_-]{16,}\b/);
    expect(results).not.toMatch(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i,
    );
  });

  it("专用仿真保持可访问标题、响应式和打印规则", () => {
    const pathMap = readFileSync(
      resolve(root, "src/components/book/OpenWebUIPathMap.astro"),
      "utf8",
    );
    const connection = readFileSync(
      resolve(root, "src/components/mock-ui/OpenWebUIConnectionMock.astro"),
      "utf8",
    );
    const bootstrap = readFileSync(
      resolve(
        root,
        "src/components/mock-ui/OpenWebUIAdminBootstrapMock.astro",
      ),
      "utf8",
    );

    expect(pathMap).toContain("aria-labelledby");
    expect(pathMap).toContain("路径 A");
    expect(pathMap).toContain("路径 B");
    expect(pathMap).toContain("@media (max-width: 48rem)");
    expect(pathMap).toContain("@media print");
    expect(connection).toContain("Open WebUI · Connections 仿真");
    expect(connection).toContain("aria-label=\"已隐藏的 API key\"");
    expect(connection).toContain("@media (max-width: 35.625rem)");
    expect(connection).toContain("@media print");
    expect(bootstrap).toContain("首位管理员初始化仿真");
    expect(bootstrap).toContain('aria-label="已隐藏的管理员密码"');
    expect(bootstrap).toContain("@media (max-width: 43.75rem)");
    expect(bootstrap).toContain("@media print");
  });
});
