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

const chapter06 = readChapter("06-publish-ports.mdx");
const chapter07 = readChapter("07-persist-data.mdx");
const chapter08 = readChapter("08-config-and-secrets.mdx");

describe("第三册第二批正文元数据", () => {
  const chapters = [
    {
      source: chapter06,
      order: 6,
      slug: "06-publish-ports",
      completionId: "book03-chapter-06",
    },
    {
      source: chapter07,
      order: 7,
      slug: "07-persist-data",
      completionId: "book03-chapter-07",
    },
    {
      source: chapter08,
      order: 8,
      slug: "08-config-and-secrets",
      completionId: "book03-chapter-08",
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

describe("第 6 章端口映射", () => {
  it("默认只绑定主机回环地址并按三层验证", () => {
    expect(chapter06).toContain(
      "sudo docker run -d --name book03-port-local -p 127.0.0.1:8080:80 nginx:1.30.4-alpine",
    );
    expect(chapter06).toContain(
      "80/tcp -&gt; 127.0.0.1:8080",
    );
    expect(chapter06).toContain(
      "curl --fail --show-error http://127.0.0.1:8080",
    );
    expect(chapter06).toContain(
      "ssh -N -L 18080:127.0.0.1:8080 admin@203.0.113.10",
    );
    expect(chapter06).toContain("容器状态是 Up");
  });

  it("解释公网、云防火墙和 UFW 边界，但不提供开放规则", () => {
    expect(chapter06).toContain("省略主机 IP");
    expect(chapter06).toContain("云防火墙");
    expect(chapter06).toContain("Docker 与 UFW");
    expect(chapter06).toContain("INPUT、OUTPUT");
    expect(chapter06).not.toContain("ufw allow 8080");
    expect(chapter06).not.toContain('"iptables": false');
    expect(chapter06).not.toMatch(
      /export const \w+\s*=\s*["'`]sudo docker run[^"'`]* -p 8080:80/,
    );
  });

  it("命令保持 CodeBlock 单一来源", () => {
    expect(chapter06).not.toContain("<CopyButton");
    expect(chapter06).not.toMatch(/\bcopyValue\s*=/);
    expect(chapter06).toContain("code={portRunLocal}");
    expect(chapter06).toContain("code={portInspect}");
    expect(chapter06).toContain("code={portRequest}");
    expect(chapter06).toContain("code={portCleanup}");
  });
});

describe("第 7 章持久化", () => {
  it("用两个容器验证同一 named volume 的独立生命周期", () => {
    expect(chapter07).toContain(
      "sudo docker volume create book03-web-data",
    );
    expect(chapter07).toContain("--name book03-volume-a");
    expect(chapter07).toContain("--name book03-volume-b");
    expect(chapter07).toContain(
      "type=volume,src=book03-web-data,dst=/usr/share/nginx/html",
    );
    expect(chapter07).toContain("容器 A 已经删除");
    expect(chapter07).toContain("本章有意保留 `book03-web-data`");
  });

  it("用专用主机目录和只读 bind mount 演练文件维护", () => {
    expect(chapter07).toContain(
      '$HOME/docker-labs/bind-web',
    );
    expect(chapter07).toContain(
      "type=bind,src=$HOME/docker-labs/bind-web,dst=/usr/share/nginx/html,readonly",
    );
    expect(chapter07).toContain("rw=false");
    expect(chapter07).toContain("修改主机文件会反映到 bind mount");
    expect(chapter07).toContain("不要把系统根目录或敏感目录挂进练习容器");
  });

  it("不提供数据破坏性命令的复制步骤", () => {
    expect(chapter07).not.toMatch(
      /<CodeBlock[\s\S]{0,260}code=(?:\{)?["'`][^"'`]*(?:docker volume rm|volume prune|system prune|compose down -v|rm -rf)/,
    );
    expect(chapter07).toContain("持久化不等于备份");
    expect(chapter07).toContain(
      "“没有容器在使用”不等于“数据已经没有价值”",
    );
  });

  it("命令保持 CodeBlock 单一来源", () => {
    expect(chapter07).not.toContain("<CopyButton");
    expect(chapter07).not.toMatch(/\bcopyValue\s*=/);
    expect(chapter07).toContain("code={volumeCreate}");
    expect(chapter07).toContain("code={volumeRunFirst}");
    expect(chapter07).toContain("code={volumeRunSecond}");
    expect(chapter07).toContain("code={bindRun}");
    expect(chapter07).toContain("code={bindCleanup}");
  });
});

describe("第 8 章配置与敏感信息", () => {
  it("只使用普通教学变量并证明环境变量可被 inspect 读取", () => {
    expect(chapter08).toContain("BOOK03_MODE=practice");
    expect(chapter08).toContain("BOOK03_COLOR=blue");
    expect(chapter08).toContain("--env-file");
    expect(chapter08).toContain(".Config.Env");
    expect(chapter08).toContain("环境变量不是秘密保险箱");
    expect(chapter08).toContain("book03-env-inspect");
  });

  it("区分 .env、env_file、普通配置和 Compose secrets", () => {
    expect(chapter08).toContain("`.env`、`env_file` 和容器环境不是一回事");
    expect(chapter08).toContain("/run/secrets/<secret_name>");
    expect(chapter08).toContain("example.invalid/app:1.0");
    expect(chapter08).toContain("Compose secrets 不是自动托管的云密码库");
    expect(chapter08).toContain("应用是否支持“从文件读取”");
  });

  it("建立仓库忽略、最小授权和真实凭证红线", () => {
    expect(chapter08).toContain("*.env");
    expect(chapter08).toContain("secrets/");
    expect(chapter08).toContain("!*.example");
    expect(chapter08).toContain("root 或管理员密码");
    expect(chapter08).toContain("SSH 私钥");
    expect(chapter08).toContain("Reality 私钥、UUID 和订阅 URL");
    expect(chapter08).toContain("撤销或轮换凭证");
    expect(chapter08).not.toMatch(/AKIA[0-9A-Z]{16}/);
    expect(chapter08).not.toContain("BEGIN OPENSSH PRIVATE KEY");
  });

  it("命令和文件内容保持 CodeBlock 单一来源", () => {
    expect(chapter08).not.toContain("<CopyButton");
    expect(chapter08).not.toMatch(/\bcopyValue\s*=/);
    expect(chapter08).toContain("code={publicEnvFile}");
    expect(chapter08).toContain("code={envRun}");
    expect(chapter08).toContain("code={envInspect}");
    expect(chapter08).toContain("code={ignoreFile}");
    expect(chapter08).toContain("code={composeSecretExample}");
  });
});
