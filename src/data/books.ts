export const chapterTypes = [
  "introduction",
  "chapter",
  "appendix",
  "sources",
] as const;

export type ChapterType = (typeof chapterTypes)[number];
export type BookStatus =
  | "planned"
  | "drafting"
  | "release-candidate"
  | "published"
  | "archived";

export interface BookCoverMetadata {
  navigationLabel: string;
  titleLines: readonly string[];
  learningPath: readonly string[];
  audience: string;
  outcome: string;
  prerequisites: string;
}

export interface BookCompletionRules {
  eligibleChapterTypes: readonly ChapterType[];
  requireAllEligible: boolean;
}

export interface BookSearchSettings {
  enabled: boolean;
  indexedChapterTypes: readonly ChapterType[];
  resultBookLabel: string;
}

export interface BookPrintSettings {
  enabled: boolean;
  includedChapterTypes: readonly ChapterType[];
  noindex: boolean;
  description: string;
}

export interface BookDefinition {
  id: string;
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  status: BookStatus;
  version: string;
  updatedAt: string;
  featured: boolean;
  cover: BookCoverMetadata;
  completion: BookCompletionRules;
  search: BookSearchSettings;
  print: BookPrintSettings;
}

export const seriesTitle = "AI 基础设施从零开始";

const standardCompletionRules: BookCompletionRules = {
  eligibleChapterTypes: ["chapter"],
  requireAllEligible: true,
};

const allContentTypes: readonly ChapterType[] = chapterTypes;

export const books: readonly BookDefinition[] = [
  {
    id: "01-first-vps",
    number: 1,
    slug: "01-first-vps",
    title: "15分钟搞定你的VPS",
    shortTitle: "15分钟搞定VPS",
    subtitle: "从看懂套餐到完成首次 SSH 登录",
    description: "面向中国零基础用户，从选择 Vultr 套餐到获得并登录第一台 Ubuntu VPS。",
    status: "release-candidate",
    version: "1.0.0-rc.2",
    updatedAt: "2026-07-28",
    featured: false,
    cover: {
      navigationLabel: "第一册",
      titleLines: ["15分钟", "搞定你的VPS"],
      learningPath: ["VPS", "Vultr", "公网 IPv4", "Ubuntu", "SSH"],
      audience: "从未购买过服务器、希望为第二册准备一台可登录 VPS 的中国用户。",
      outcome: "获得一台运行中的 Ubuntu VPS，并用密码或 SSH 密钥完成首次登录。",
      prerequisites: "能够使用浏览器、接收验证信息，并准备本人可用的合法支付方式。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: true,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "第一台 VPS",
    },
    print: {
      enabled: true,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第一册《购买第一台 VPS》完整打印版。",
    },
  },
  {
    id: "02-overseas-network",
    number: 2,
    slug: "02-overseas-network",
    title: "拥有自己的海外网络：从 VPS 到 Clash，只需要 30 分钟",
    shortTitle: "拥有自己的海外网络",
    subtitle: "从 VPS 到 Clash，只需要 30 分钟",
    description: "从 Ubuntu VPS 登录到电脑和手机完成连接与验证。",
    status: "release-candidate",
    version: "1.0.0-rc.1",
    updatedAt: "2026-07-27",
    featured: true,
    cover: {
      navigationLabel: "第二册",
      titleLines: ["拥有自己的", "海外网络"],
      learningPath: [
        "Ubuntu",
        "SSH",
        "3X-UI",
        "VLESS Reality",
        "Clash / Shadowrocket",
      ],
      audience: "已经购买 VPS，但不知道下一步该做什么的零基础用户。",
      outcome: "电脑和手机可以通过自己管理的节点建立网络连接。",
      prerequisites: "Ubuntu VPS 的 IP、实际管理员用户名、密码或 SSH 私钥，以及 Windows 或 Mac 电脑。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: true,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "拥有自己的海外网络",
    },
    print: {
      enabled: true,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第二册《拥有自己的海外网络》完整打印版。",
    },
  },
  {
    id: "03-docker",
    number: 3,
    slug: "03-docker",
    title: "一篇文章掌握 Docker：从容器到 Compose",
    shortTitle: "一篇文章掌握 Docker",
    subtitle: "从容器到 Compose",
    description: "面向零基础用户，理解镜像、容器、端口、数据持久化和 Compose 的具体用法。",
    status: "release-candidate",
    version: "1.0.0-rc.1",
    updatedAt: "2026-08-11",
    featured: false,
    cover: {
      navigationLabel: "第三册",
      titleLines: ["一篇文章掌握", "Docker"],
      learningPath: ["镜像", "容器", "端口", "数据", "Compose"],
      audience: "已经拥有可登录的 Ubuntu VPS、准备使用容器部署服务的零基础用户。",
      outcome: "获得一套可重复部署、可排错、可备份和可交接的 Compose 项目。",
      prerequisites: "一台可通过 SSH 登录的 Ubuntu 24.04 LTS amd64 服务器。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: true,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "一篇文章掌握 Docker",
    },
    print: {
      enabled: true,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第三册《一篇文章掌握 Docker：从容器到 Compose》完整打印版。",
    },
  },
  {
    id: "04-cloudflare",
    number: 4,
    slug: "04-cloudflare",
    title: "让服务拥有域名：从 DNS 到 Cloudflare HTTPS",
    shortTitle: "让服务拥有域名",
    subtitle: "从 DNS、Cloudflare Tunnel 到 HTTPS",
    description: "从域名所有权和权威 DNS 开始，使用 Cloudflare Tunnel 为本机 Compose 服务建立可维护的 HTTPS 入口。",
    status: "release-candidate",
    version: "1.0.0-rc.1",
    updatedAt: "2026-08-23",
    featured: false,
    cover: {
      navigationLabel: "第四册",
      titleLines: ["让服务拥有域名", "从 DNS 到 Cloudflare HTTPS"],
      learningPath: ["域名", "DNS", "Cloudflare Tunnel", "HTTPS", "分层排错"],
      audience: "已经拥有可登录的 Ubuntu VPS 和本机 Compose 服务，希望用域名安全访问的零基础用户。",
      outcome: "获得一个通过生产 Cloudflare Tunnel 连接到本机服务的 HTTPS 域名入口，并能分层排查故障。",
      prerequisites: "一台可通过 SSH 管理的 Ubuntu VPS，以及能在服务器本机通过 127.0.0.1:8080 访问的 Compose Web 服务。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: true,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "让服务拥有域名",
    },
    print: {
      enabled: true,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第四册《让服务拥有域名：从 DNS 到 Cloudflare HTTPS》完整打印版。",
    },
  },
  {
    id: "05-open-webui",
    number: 5,
    slug: "05-open-webui",
    title: "搭建自己的 AI 对话入口：Open WebUI 从部署到维护",
    shortTitle: "搭建自己的 AI 对话入口",
    subtitle: "Open WebUI 从部署到维护",
    description: "使用 Docker Compose 部署 Open WebUI，接入远程模型 API，并建立账户、HTTPS、备份和分层排错边界。",
    status: "release-candidate",
    version: "1.0.0-rc.1",
    updatedAt: "2026-09-11",
    featured: false,
    cover: {
      navigationLabel: "第五册",
      titleLines: ["搭建自己的 AI 对话入口", "Open WebUI 从部署到维护"],
      learningPath: ["Open WebUI", "模型 API", "账户安全", "HTTPS", "备份与排错"],
      audience: "已经拥有可管理 VPS、Docker 和域名，希望建立自托管 AI 对话入口的零基础用户。",
      outcome: "获得一个只通过受控 HTTPS 入口访问、可以接入远程模型并完成备份与排错的 Open WebUI。",
      prerequisites: "一台可通过 SSH 管理的 Ubuntu VPS、Docker Compose、可控制域名与 Cloudflare Tunnel，以及一个受限的模型 API key。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: true,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "Open WebUI",
    },
    print: {
      enabled: true,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第五册《搭建自己的 AI 对话入口：Open WebUI 从部署到维护》完整打印版。",
    },
  },
  {
    id: "06-dify",
    number: 6,
    slug: "06-dify",
    title: "搭建自己的 AI 应用：Dify 从工作流到知识库",
    shortTitle: "搭建自己的 AI 应用",
    subtitle: "Dify 从工作流到知识库",
    description: "使用官方 Compose 部署 Dify，以合成资料建立单次问答工作流，并掌握访问控制、费用与恢复边界。",
    status: "release-candidate",
    version: "1.0.0-rc.1",
    updatedAt: "2026-09-11",
    featured: false,
    cover: {
      navigationLabel: "第六册",
      titleLines: ["搭建自己的 AI 应用", "Dify 从工作流到知识库"],
      learningPath: ["Dify", "工作流", "知识库", "访问控制", "备份与维护"],
      audience: "已经了解 VPS、Docker 和模型接口，希望通过图形界面搭建 AI 应用的零基础读者。",
      outcome: "用合成资料建立可检查依据的单次问答流程，并掌握受控访问、费用核对和恢复方法。",
      prerequisites: "可管理的 Ubuntu VPS、Docker Compose、可控制域名，以及单个受控远程模型；缺项先返回前册准备。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: true,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "Dify",
    },
    print: {
      enabled: true,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第六册《搭建自己的 AI 应用：Dify 从工作流到知识库》发布候选打印版。",
    },
  },
  {
    id: "07-n8n",
    number: 7,
    slug: "07-n8n",
    title: "把重复工作连起来：n8n 自动化流程入门",
    shortTitle: "把重复工作连起来",
    subtitle: "n8n 自动化流程入门",
    description: "从手动触发到受控 Webhook，理解触发器、节点、凭证、执行记录与恢复边界。",
    status: "drafting",
    version: "0.0.0",
    updatedAt: "2026-09-11",
    featured: false,
    cover: {
      navigationLabel: "第七册",
      titleLines: ["把重复工作连起来", "n8n 自动化流程入门"],
      learningPath: ["触发器", "节点", "凭证", "Webhook", "执行记录"],
      audience: "已经接触 VPS、Docker 和受控 HTTPS，第一次学习 n8n 的零基础用户。",
      outcome: "能建立一条低风险练习流程，读懂执行记录，并知道如何撤销入口和凭证。",
      prerequisites: "具备可登录的 Ubuntu VPS、Docker Compose 和可控制的测试域名；缺项先返回前册。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: false,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "n8n",
    },
    print: {
      enabled: false,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第七册《n8n》完整打印版。",
    },
  },
  {
    id: "08-supabase",
    number: 8,
    slug: "08-supabase",
    title: "把数据接进应用：Supabase 从数据库到认证",
    shortTitle: "把数据接进应用",
    subtitle: "Supabase 从数据库到认证与存储",
    description: "面向零基础用户理解表、行、策略、认证和对象存储，并完成一个受控的练习应用数据层。",
    status: "drafting",
    version: "0.0.0",
    updatedAt: "2026-09-11",
    featured: false,
    cover: {
      navigationLabel: "第八册",
      titleLines: ["把数据接进应用" , "Supabase 从数据库到认证"],
      learningPath: ["Postgres", "表与关系", "Row Level Security", "认证", "对象存储"],
      audience: "需要为应用准备数据库、认证和文件存储的零基础用户。",
      outcome: "完成一个受控练习项目，能设计表、配置 RLS、接入认证并安全管理文件。",
      prerequisites: "理解网站、账号和数据库的基础概念；真实业务上线前需先完成独立安全校订。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: false,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "Supabase",
    },
    print: {
      enabled: false,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第八册《Supabase》完整打印版。",
    },
  },
  {
    id: "09-ai-development-environment",
    number: 9,
    slug: "09-ai-development-environment",
    title: "建立自己的 AI 开发环境：终端、编辑器与项目协作",
    shortTitle: "建立自己的 AI 开发环境",
    subtitle: "终端、编辑器与项目协作",
    description: "从文件系统、终端和 Git 开始，建立适合 AI 工具协作的本地开发环境与恢复习惯。",
    status: "drafting",
    version: "0.0.0",
    updatedAt: "2026-09-11",
    featured: false,
    cover: {
      navigationLabel: "第九册",
      titleLines: ["建立自己的 AI 开发环境", "终端、编辑器与协作"],
      learningPath: ["终端", "Git", "编辑器", "环境变量", "AI 协作"],
      audience: "需要在本地使用 AI 工具、终端和编辑器完成项目工作的知识工作者。",
      outcome: "建立可复现、可审查、可回滚的本地 AI 开发工作区。",
      prerequisites: "能够安装普通桌面软件、管理文件，并愿意使用 Git 保存变化。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: false,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "AI 开发环境",
    },
    print: {
      enabled: false,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第九册《AI 开发环境》完整打印版。",
    },
  },
  {
    id: "10-server-security-operations",
    number: 10,
    slug: "10-server-security-operations",
    title: "守住并维护服务器：安全、备份与故障处理",
    shortTitle: "守住并维护服务器",
    subtitle: "安全、备份与故障处理",
    description: "面向已经运行服务的用户，建立最小权限、更新、备份、监控和故障响应的长期习惯。",
    status: "drafting",
    version: "0.0.0",
    updatedAt: "2026-09-11",
    featured: false,
    cover: {
      navigationLabel: "第十册",
      titleLines: ["守住并维护服务器", "安全、备份与运维"],
      learningPath: ["最小权限", "更新", "备份", "监控", "故障响应"],
      audience: "已经运行服务、需要长期维护服务器的用户。",
      outcome: "建立更新、备份、监控、故障响应和退役交接的基本闭环。",
      prerequisites: "能够登录服务器并理解正在运行的服务；高风险操作需准备可恢复备份。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: false,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "服务器安全与运维",
    },
    print: {
      enabled: false,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第十册《服务器安全与运维》完整打印版。",
    },
  },
];

const booksById = new Map(books.map((book) => [book.id, book]));
const booksBySlug = new Map(books.map((book) => [book.slug, book]));

export function getBookById(id: string): BookDefinition | undefined {
  return booksById.get(id);
}

export function getBookBySlug(slug: string): BookDefinition | undefined {
  return booksBySlug.get(slug);
}

export function requireBookById(id: string): BookDefinition {
  const book = getBookById(id);
  if (!book) throw new Error(`书籍注册表中不存在 ${id}`);
  return book;
}

export function isReadableBook(book: BookDefinition): boolean {
  return book.status === "release-candidate" || book.status === "published";
}

export function getReadableBooks(): BookDefinition[] {
  return books.filter(isReadableBook);
}

export function getFeaturedBook(): BookDefinition {
  const featured = books.find((book) => book.featured && isReadableBook(book));
  if (!featured) {
    throw new Error("书籍注册表中必须有一本可阅读的 featured 图书。");
  }
  return featured;
}

export function bookStatusLabel(status: BookStatus): string {
  const labels: Record<BookStatus, string> = {
    planned: "计划中",
    drafting: "编写中",
    "release-candidate": "发布候选",
    published: "已发布",
    archived: "已归档",
  };
  return labels[status];
}
