import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");

function readChapter(filename: string): string {
  return readFileSync(
    resolve(root, "src/content/books/03-docker", filename),
    "utf8",
  );
}

const chapter10 = readChapter("10-troubleshooting.mdx");
const chapter11 = readChapter("11-update-backup-cleanup.mdx");
const chapter12 = readChapter("12-handoff.mdx");

describe("第三册第三批正文元数据", () => {
  const chapters = [
    {
      source: chapter10,
      order: 10,
      slug: "10-troubleshooting",
      completionId: "book03-chapter-10",
    },
    {
      source: chapter11,
      order: 11,
      slug: "11-update-backup-cleanup",
      completionId: "book03-chapter-11",
    },
    {
      source: chapter12,
      order: 12,
      slug: "12-handoff",
      completionId: "book03-chapter-12",
    },
  ];

  it.each(chapters)(
    "order $order 使用稳定 slug、完成状态 ID 和发布候选标记",
    ({ source, order, slug, completionId }) => {
      expect(source).toContain('book: "03-docker"');
      expect(source).toMatch(new RegExp(`^order: ${order}$`, "m"));
      expect(source).toContain(`slug: "${slug}"`);
      expect(source).toContain('chapterType: "chapter"');
      expect(source).toContain(`completionId: "${completionId}"`);
      expect(source).toMatch(/^draft: false$/m);
    },
  );
});

describe("第 10 章故障排查", () => {
  it("按固定证据顺序覆盖 daemon、状态、日志、挂载、端口和请求", () => {
    expect(chapter10).toContain("一套固定的排查顺序");
    expect(chapter10).toContain("sudo systemctl is-active docker");
    expect(chapter10).toContain("sudo docker compose ps -a");
    expect(chapter10).toContain(
      "sudo docker compose logs --tail=50 --timestamps --since=10m web",
    );
    expect(chapter10).toContain(".Mounts");
    expect(chapter10).toContain("sudo docker compose port web 80");
    expect(chapter10).toContain(
      "curl --fail --show-error http://127.0.0.1:8080",
    );
  });

  it("使用可恢复的缺页故障并恢复最后已知正常状态", () => {
    expect(chapter10).toContain(
      "mv site/index.html site/index.html.disabled",
    );
    expect(chapter10).toContain(
      "mv site/index.html.disabled site/index.html",
    );
    expect(chapter10).toContain("故障注入");
    expect(chapter10).toContain("恢复");
    expect(chapter10).toContain("restart 不是通用诊断工具");
  });

  it("命令保持 CodeBlock 单一来源", () => {
    expect(chapter10).not.toContain("<CopyButton");
    expect(chapter10).not.toMatch(/\bcopyValue\s*=/);
    expect(chapter10).toContain("code={baselineCheck}");
    expect(chapter10).toContain("code={recentLogs}");
    expect(chapter10).toContain("code={injectMissingPage}");
    expect(chapter10).toContain("code={restorePage}");
  });
});

describe("第 11 章更新、备份与清理", () => {
  it("先备份与恢复验证，再更新和精确清理", () => {
    const backupIndex = chapter11.indexOf("## 第一步：备份 Compose 项目");
    const restoreIndex = chapter11.indexOf(
      "## 第三步：恢复到新 volume 并实际读取",
    );
    const updateIndex = chapter11.indexOf(
      "## 第四步：记录旧镜像，再执行更新",
    );
    const cleanupIndex = chapter11.indexOf(
      "## 第七步：只清理已验证的教学 volume",
    );

    expect(backupIndex).toBeGreaterThan(0);
    expect(restoreIndex).toBeGreaterThan(backupIndex);
    expect(updateIndex).toBeGreaterThan(restoreIndex);
    expect(cleanupIndex).toBeGreaterThan(updateIndex);
    expect(chapter11).toContain("book03-web-data-restore-test");
    expect(chapter11).toContain("--retry 5 --retry-delay 2 --retry-all-errors");
    expect(chapter11).toContain("http://127.0.0.1:18081");
  });

  it("区分 pull 与 up，并记录更新前镜像身份", () => {
    expect(chapter11).toContain("sudo docker compose pull web");
    expect(chapter11).toContain("sudo docker compose up -d web");
    expect(chapter11).toContain("nginx-image-before-update.txt");
    expect(chapter11).toContain(".RepoDigests");
    expect(chapter11).toContain("pull 可能显示 up to date");
  });

  it("为单一 service 配置 local 日志轮转", () => {
    expect(chapter11).toContain("driver: local");
    expect(chapter11).toContain('max-size: "10m"');
    expect(chapter11).toContain('max-file: "3"');
    expect(chapter11).toContain(".HostConfig.LogConfig");
    expect(chapter11).toContain("不改其他项目的 daemon 默认设置");
  });

  it("不把批量删除写成可复制命令", () => {
    expect(chapter11).not.toMatch(
      /export const \w+\s*=\s*["'`][\s\S]*?(?:docker system prune|docker volume prune|docker compose down -v)[\s\S]*?["'`];/,
    );
    expect(chapter11).toContain(
      "sudo docker volume rm book03-web-data-restore-test",
    );
    expect(chapter11).toContain(
      "sudo docker volume rm book03-web-data",
    );
    expect(chapter11).toContain("已经备份并验证恢复");
  });

  it("命令保持 CodeBlock 单一来源", () => {
    expect(chapter11).not.toContain("<CopyButton");
    expect(chapter11).not.toMatch(/\bcopyValue\s*=/);
    expect(chapter11).toContain("code={createProjectBackup}");
    expect(chapter11).toContain("code={createVolumeBackup}");
    expect(chapter11).toContain("code={restoreVolumeTest}");
    expect(chapter11).toContain("code={removeKnownPracticeVolume}");
  });
});

describe("第 12 章整理与交接", () => {
  it("交接卡覆盖项目、端口、镜像、数据、备份和维护入口", () => {
    expect(chapter12).toContain("# book03-compose-demo 交接卡");
    expect(chapter12).toContain("项目目录：$HOME/docker-labs/compose-web");
    expect(chapter12).toContain("主机监听：127.0.0.1:8080");
    expect(chapter12).toContain("当前 digest");
    expect(chapter12).toContain("项目备份指针");
    expect(chapter12).toContain("维护入口");
    expect(chapter12).toContain("已知边界");
  });

  it("明确不记录秘密和公网入口", () => {
    expect(chapter12).toContain("公网暴露：否");
    expect(chapter12).toContain("不能直接从公网访问 8080");
    expect(chapter12).toContain("不写秘密值");
    expect(chapter12).toContain(
      "密码、SSH 私钥、API token、第二册 UUID、Reality 私钥或订阅 URL",
    );
    expect(chapter12).not.toMatch(/AKIA[0-9A-Z]{16}/);
    expect(chapter12).not.toContain("BEGIN OPENSSH PRIVATE KEY");
  });

  it("核对最终对象且不提供批量清理", () => {
    expect(chapter12).toContain(
      "sudo docker ps --filter label=com.docker.compose.project=book03-compose-demo",
    );
    expect(chapter12).toContain(
      "sudo docker volume ls --filter name=book03-",
    );
    expect(chapter12).not.toMatch(
      /export const \w+\s*=\s*["'`][\s\S]*?(?:docker system prune|docker volume prune|docker compose down -v)[\s\S]*?["'`];/,
    );
  });

  it("命令和模板保持 CodeBlock 单一来源", () => {
    expect(chapter12).not.toContain("<CopyButton");
    expect(chapter12).not.toMatch(/\bcopyValue\s*=/);
    expect(chapter12).toContain("code={runtimeInventory}");
    expect(chapter12).toContain("code={handoffTemplate}");
    expect(chapter12).toContain("code={verifyHandoff}");
    expect(chapter12).toContain("code={finalObjectCheck}");
  });
});
