import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getBookById, isReadableBook } from "../../src/data/books";

const root = resolve(import.meta.dirname, "../..");
const introductionSamplePath = resolve(
  root,
  "src/content/books/03-docker/00-introduction.mdx",
);
const installSamplePath = resolve(
  root,
  "src/content/books/03-docker/03-install-docker.mdx",
);
const composeSamplePath = resolve(
  root,
  "src/content/books/03-docker/09-docker-compose.mdx",
);
const introductionSample = readFileSync(introductionSamplePath, "utf8");
const installSample = readFileSync(installSamplePath, "utf8");
const composeSample = readFileSync(composeSamplePath, "utf8");

describe("第三册发布候选注册状态", () => {
  it("第三册进入 production 可阅读书目，并启用搜索与打印", () => {
    const book = getBookById("03-docker");

    expect(book).toBeDefined();
    expect(book?.title).toBe("一篇文章掌握 Docker：从容器到 Compose");
    expect(book?.status).toBe("release-candidate");
    expect(book?.version).toBe("1.0.0-rc.1");
    expect(book?.search.enabled).toBe(true);
    expect(book?.print.enabled).toBe(true);
    expect(book && isReadableBook(book)).toBe(true);
  });
});

describe("第三册开始之前样章", () => {
  it("使用 introduction 元数据，不进入正式章节完成率", () => {
    expect(introductionSample).toContain('book: "03-docker"');
    expect(introductionSample).toMatch(/^order: 0$/m);
    expect(introductionSample).toContain('slug: "start"');
    expect(introductionSample).toMatch(/^chapterType: "introduction"$/m);
    expect(introductionSample).toMatch(/^draft: false$/m);
    expect(introductionSample).not.toMatch(/^chapterNumber:/m);
    expect(introductionSample).not.toMatch(/^completionId:/m);
    expect(introductionSample).not.toContain("<ChapterChecklist");
  });

  it("覆盖第一册交接、第二册共用服务器和三档判断", () => {
    expect(introductionSample).toContain("第一册交接卡");
    expect(introductionSample).toContain("3X-UI");
    expect(introductionSample).toContain("Xray");
    expect(introductionSample).toContain("可以继续");
    expect(introductionSample).toContain("需先处理");
    expect(introductionSample).toContain("必须停止");
    expect(introductionSample).toContain("至少预留约 2 GB");
  });

  it("只读取现状，不把安装、停止或清理命令放入可复制步骤", () => {
    expect(introductionSample).toContain(
      "sudo systemctl --type=service --state=running --no-pager",
    );
    expect(introductionSample).toContain("sudo ss -lntup");
    expect(introductionSample).toContain("sudo docker ps -a");
    expect(introductionSample).toContain("sudo docker volume ls");
    expect(introductionSample).not.toMatch(
      /<CodeBlock[\s\S]{0,240}code=(?:\{)?["'`][^"'`]*(?:apt install|docker run|docker system prune|systemctl stop|systemctl disable|ufw allow|ufw disable|rm -rf)/,
    );
  });

  it("清点表不要求记录认证秘密", () => {
    expect(introductionSample).toContain(
      "只记录状态，不写秘密",
    );
    expect(introductionSample).toContain("不要记录 root 密码");
    expect(introductionSample).toContain("Reality 私钥");
    expect(introductionSample).toContain("API key");
  });

  it("只读命令由 CodeBlock 单一来源复制", () => {
    expect(introductionSample).not.toContain("<CopyButton");
    expect(introductionSample).not.toMatch(/\bcopyValue\s*=/);
    expect(introductionSample).toContain("code={identityCheck}");
    expect(introductionSample).toContain("code={systemCheck}");
    expect(introductionSample).toContain("code={resourceCheck}");
    expect(introductionSample).toContain("code={listeningCheck}");
    expect(introductionSample).toContain("code={existingDockerCheck}");
  });
});

describe("第三册安装样章", () => {
  it("保留正式 order 与稳定 slug，并明确为发布候选", () => {
    expect(installSample).toContain('book: "03-docker"');
    expect(installSample).toMatch(/^order: 3$/m);
    expect(installSample).toContain('slug: "03-install-docker"');
    expect(installSample).toMatch(/^chapterNumber: 3$/m);
    expect(installSample).toMatch(/^draft: false$/m);
  });

  it("使用 Docker 官方 APT 软件源与当前官方软件包", () => {
    expect(installSample).toContain(
      "https://download.docker.com/linux/ubuntu",
    );
    expect(installSample).toContain(
      "sudo tee /etc/apt/sources.list.d/docker.sources",
    );
    expect(installSample).toContain(
      "Signed-By: /etc/apt/keyrings/docker.asc",
    );
    expect(installSample).toContain("docker-ce");
    expect(installSample).toContain("docker-ce-cli");
    expect(installSample).toContain("containerd.io");
    expect(installSample).toContain("docker-buildx-plugin");
    expect(installSample).toContain("docker-compose-plugin");
  });

  it("覆盖环境、服务、版本与 hello-world 的分层验证", () => {
    expect(installSample).toContain("cat /etc/os-release");
    expect(installSample).toContain("dpkg --print-architecture");
    expect(installSample).toContain("sudo systemctl status docker --no-pager");
    expect(installSample).toContain("sudo docker version");
    expect(installSample).toContain("sudo docker compose version");
    expect(installSample).toContain("sudo docker buildx version");
    expect(installSample).toContain("sudo docker run --rm hello-world");
  });

  it("保留权限、冲突包、签名与防火墙安全边界", () => {
    expect(installSample).toContain(
      "仅在已确认无现有 Docker 业务时移除冲突包",
    );
    expect(installSample).toContain("不要加 `trusted=yes`");
    expect(installSample).toContain("本章不执行 usermod -aG docker");
    expect(installSample).toContain("DOCKER-USER");
    expect(installSample).not.toMatch(
      /<CodeBlock[\s\S]{0,240}code=(?:\{)?["'`][^"'`]*get\.docker\.com/,
    );
    expect(installSample).not.toContain("usermod -aG docker $USER");
  });

  it("命令内容仍由 CodeBlock 单一来源复制", () => {
    expect(installSample).not.toContain("<CopyButton");
    expect(installSample).not.toMatch(/\bcopyValue\s*=/);
    expect(installSample).toContain("code={environmentCheck}");
    expect(installSample).toContain("code={addDockerRepository}");
    expect(installSample).toContain("code={installDockerPackages}");
    expect(installSample).toContain("code={versionChecks}");
  });
});

describe("第三册 Compose 样章", () => {
  it("保留正式 order 与稳定 slug，并明确为发布候选", () => {
    expect(composeSample).toContain('book: "03-docker"');
    expect(composeSample).toMatch(/^order: 9$/m);
    expect(composeSample).toContain('slug: "09-docker-compose"');
    expect(composeSample).toMatch(/^chapterNumber: 9$/m);
    expect(composeSample).toMatch(/^draft: false$/m);
  });

  it("覆盖 Compose 核心路径与安全删除边界", () => {
    expect(composeSample).toContain("sudo docker compose config -q");
    expect(composeSample).toContain("sudo docker compose up -d");
    expect(composeSample).toContain("sudo docker compose ps");
    expect(composeSample).toContain(
      "sudo docker compose logs --tail=20 web",
    );
    expect(composeSample).toContain("sudo docker compose down");
    expect(composeSample).toContain("127.0.0.1:8080:80");
    expect(composeSample).toContain("不要在这里增加 -v");
    expect(composeSample).not.toMatch(
      /<CodeBlock[\s\S]{0,240}code=(?:\{)?["'`][^"'`]*docker compose down -v/,
    );
  });

  it("命令与文件内容仍由 CodeBlock 单一来源复制", () => {
    expect(composeSample).not.toContain("<CopyButton");
    expect(composeSample).not.toMatch(/\bcopyValue\s*=/);
    expect(composeSample).toContain("code={composeFile}");
    expect(composeSample).toContain("code={indexFile}");
  });
});
