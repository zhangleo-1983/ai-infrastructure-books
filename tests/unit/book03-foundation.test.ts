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

const chapter01 = readChapter("01-why-docker.mdx");
const chapter02 = readChapter("02-image-and-container.mdx");
const chapter04 = readChapter("04-first-container.mdx");
const chapter05 = readChapter("05-container-lifecycle.mdx");

describe("第三册第一批正文元数据", () => {
  const chapters = [
    {
      source: chapter01,
      order: 1,
      slug: "01-why-docker",
      completionId: "book03-chapter-01",
    },
    {
      source: chapter02,
      order: 2,
      slug: "02-image-and-container",
      completionId: "book03-chapter-02",
    },
    {
      source: chapter04,
      order: 4,
      slug: "04-first-container",
      completionId: "book03-chapter-04",
    },
    {
      source: chapter05,
      order: 5,
      slug: "05-container-lifecycle",
      completionId: "book03-chapter-05",
    },
  ];

  it.each(chapters)(
    "order $order 使用稳定 slug 和完成状态 ID",
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

describe("第 1 章 Docker 对象模型", () => {
  it("区分 VPS、容器、虚拟机、CLI 与 daemon", () => {
    expect(chapter01).toContain("容器首先是一个进程");
    expect(chapter01).toContain("共享主机内核");
    expect(chapter01).toContain("Docker CLI");
    expect(chapter01).toContain("Docker daemon");
    expect(chapter01).toContain("Docker Desktop");
    expect(chapter01).toContain(
      "VPS、Docker Engine 与容器分别位于哪一层",
    );
  });

  it("不提前要求执行尚未安装的 Docker 命令", () => {
    expect(chapter01).not.toContain("<CodeBlock");
    expect(chapter01).toContain("容器隔离不能替代来源审查和最小权限");
    expect(chapter01).toContain("--privileged");
    expect(chapter01).toContain("/var/run/docker.sock");
  });
});

describe("第 2 章镜像引用与来源", () => {
  it("覆盖完整引用、默认值、tag、digest 与分层", () => {
    expect(chapter02).toContain(
      "docker.io/library/nginx:1.30.4-alpine",
    );
    expect(chapter02).toContain(
      "[HOST[:PORT]/]NAMESPACE/REPOSITORY[:TAG]",
    );
    expect(chapter02).toContain("latest 只是一个默认标签名称");
    expect(chapter02).toContain("Digest（摘要）");
    expect(chapter02).toContain("镜像只读层");
    expect(chapter02).toContain("容器可写层");
    expect(chapter02).toContain("no matching manifest");
  });

  it("不提前下载镜像，并保留高权限红线", () => {
    expect(chapter02).not.toContain("<CodeBlock");
    expect(chapter02).toContain("--privileged");
    expect(chapter02).toContain("/var/run/docker.sock");
    expect(chapter02).toContain("关闭签名或 TLS 校验");
  });
});

describe("第 4 章首次运行", () => {
  it("使用具名 hello-world 展开 run 链路", () => {
    expect(chapter04).toContain(
      "sudo docker run --name book03-hello hello-world:latest",
    );
    expect(chapter04).toContain("查找镜像");
    expect(chapter04).toContain("必要时拉取");
    expect(chapter04).toContain("创建容器");
    expect(chapter04).toContain("启动主进程");
    expect(chapter04).toContain("退出码=0");
    expect(chapter04).toContain("run 与 start 不是同一个动作");
  });

  it("不发布端口，不给强制删除提供复制步骤", () => {
    expect(chapter04).not.toContain("127.0.0.1:8080");
    expect(chapter04).not.toMatch(
      /<CodeBlock[\s\S]{0,240}code=(?:\{)?["'`][^"'`]*(?:docker rm -f|docker system prune)/,
    );
  });

  it("命令由 CodeBlock 单一来源复制", () => {
    expect(chapter04).not.toContain("<CopyButton");
    expect(chapter04).not.toMatch(/\bcopyValue\s*=/);
    expect(chapter04).toContain("code={helloRun}");
    expect(chapter04).toContain("code={helloInspect}");
    expect(chapter04).toContain("code={helloNameCheck}");
  });
});

describe("第 5 章容器生命周期", () => {
  it("使用不发布端口的固定版本 Nginx 练习状态变化", () => {
    expect(chapter05).toContain(
      "sudo docker run -d --name book03-lifecycle nginx:1.30.4-alpine",
    );
    expect(chapter05).toContain("Running");
    expect(chapter05).toContain("Exited");
    expect(chapter05).toContain("sudo docker stop book03-lifecycle");
    expect(chapter05).toContain("sudo docker start book03-lifecycle");
    expect(chapter05).toContain("sudo docker restart book03-lifecycle");
    expect(chapter05).toContain("sudo docker rm book03-lifecycle");
    expect(chapter05).toContain("重启策略=no");
  });

  it("只定向删除练习容器，不复制强制或批量清理命令", () => {
    expect(chapter05).not.toMatch(
      /<CodeBlock[\s\S]{0,240}code=(?:\{)?["'`][^"'`]*(?:docker rm -f|container prune|image prune|volume prune|system prune)/,
    );
    expect(chapter05).toContain("本章不提供 rm -f 的复制按钮");
    expect(chapter05).toContain("删除容器以后查看镜像");
  });

  it("生命周期命令保持单一来源", () => {
    expect(chapter05).not.toContain("<CopyButton");
    expect(chapter05).not.toMatch(/\bcopyValue\s*=/);
    expect(chapter05).toContain("code={lifecycleRun}");
    expect(chapter05).toContain("code={lifecycleStatus}");
    expect(chapter05).toContain("code={lifecycleInspect}");
  });
});
