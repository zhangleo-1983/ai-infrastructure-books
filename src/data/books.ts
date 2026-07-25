export type BookStatus = "current" | "planned";

export interface BookSummary {
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  status: BookStatus;
}

export const seriesTitle = "AI 基础设施从零开始";

export const books: BookSummary[] = [
  {
    number: 1,
    slug: "01-first-vps",
    title: "购买第一台 VPS",
    shortTitle: "第一台 VPS",
    description: "选择服务商、区域、系统和配置，并完成首次购买。",
    status: "planned",
  },
  {
    number: 2,
    slug: "02-overseas-network",
    title: "拥有自己的海外网络：从 VPS 到 Clash，只需要 30 分钟",
    shortTitle: "拥有自己的海外网络",
    description: "从 Ubuntu VPS 登录到电脑和手机完成连接与验证。",
    status: "current",
  },
  {
    number: 3,
    slug: "03-docker-basics",
    title: "Docker 入门",
    shortTitle: "Docker 入门",
    description: "理解容器、镜像、端口、目录映射和 Compose。",
    status: "planned",
  },
  {
    number: 4,
    slug: "04-domain-cloudflare",
    title: "域名与 Cloudflare",
    shortTitle: "域名与 Cloudflare",
    description: "理解域名、DNS、SSL、反向代理和基础安全设置。",
    status: "planned",
  },
  {
    number: 5,
    slug: "05-open-webui",
    title: "Open WebUI",
    shortTitle: "Open WebUI",
    description: "从部署到日常使用的零基础指南。",
    status: "planned",
  },
  {
    number: 6,
    slug: "06-dify",
    title: "Dify",
    shortTitle: "Dify",
    description: "理解并搭建 AI 应用工作流。",
    status: "planned",
  },
  {
    number: 7,
    slug: "07-n8n",
    title: "n8n",
    shortTitle: "n8n",
    description: "搭建可维护的自动化流程。",
    status: "planned",
  },
  {
    number: 8,
    slug: "08-supabase",
    title: "Supabase",
    shortTitle: "Supabase",
    description: "理解数据库、认证、存储与应用连接。",
    status: "planned",
  },
  {
    number: 9,
    slug: "09-ai-development-environment",
    title: "AI 开发环境",
    shortTitle: "AI 开发环境",
    description: "建立适合 AI 工具与开发工作的本地环境。",
    status: "planned",
  },
  {
    number: 10,
    slug: "10-server-security-operations",
    title: "服务器安全与运维",
    shortTitle: "服务器安全与运维",
    description: "逐步建立更新、备份、监控和故障处理能力。",
    status: "planned",
  },
];

const activeBook = books.find((book) => book.status === "current");

if (!activeBook) {
  throw new Error("书目数据中必须有一本当前维护的图书。");
}

export const currentBook: BookSummary = activeBook;
