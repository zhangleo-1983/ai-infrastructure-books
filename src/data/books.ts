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
    title: "Docker 入门",
    shortTitle: "Docker 入门",
    subtitle: "理解容器、镜像与 Compose",
    description: "理解容器、镜像、端口、目录映射和 Compose。",
    status: "planned",
    version: "0.0.0",
    updatedAt: "2026-07-27",
    featured: false,
    cover: {
      navigationLabel: "第三册",
      titleLines: ["Docker 入门"],
      learningPath: [],
      audience: "准备使用容器部署服务的零基础用户。",
      outcome: "理解镜像、容器、端口和目录映射之间的关系。",
      prerequisites: "已经拥有一台可登录的服务器。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: false,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "Docker 入门",
    },
    print: {
      enabled: false,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第三册《Docker 入门》完整打印版。",
    },
  },
  {
    id: "04-cloudflare",
    number: 4,
    slug: "04-cloudflare",
    title: "域名与 Cloudflare",
    shortTitle: "域名与 Cloudflare",
    subtitle: "从域名、DNS 到 HTTPS",
    description: "理解域名、DNS、SSL、反向代理和基础安全设置。",
    status: "planned",
    version: "0.0.0",
    updatedAt: "2026-07-27",
    featured: false,
    cover: {
      navigationLabel: "第四册",
      titleLines: ["域名与 Cloudflare"],
      learningPath: [],
      audience: "需要用域名访问自己服务的普通用户。",
      outcome: "理解域名解析、HTTPS 和反向代理的基本关系。",
      prerequisites: "已经拥有一台服务器，并能够登录管理。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: false,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "域名与 Cloudflare",
    },
    print: {
      enabled: false,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第四册《域名与 Cloudflare》完整打印版。",
    },
  },
  {
    id: "05-open-webui",
    number: 5,
    slug: "05-open-webui",
    title: "Open WebUI",
    shortTitle: "Open WebUI",
    subtitle: "从部署到日常使用",
    description: "从部署到日常使用的零基础指南。",
    status: "planned",
    version: "0.0.0",
    updatedAt: "2026-07-27",
    featured: false,
    cover: {
      navigationLabel: "第五册",
      titleLines: ["Open WebUI"],
      learningPath: [],
      audience: "希望管理和使用自托管 AI 对话界面的用户。",
      outcome: "能够部署、访问和维护自己的 Open WebUI。",
      prerequisites: "具备服务器、Docker 和域名的基础知识。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: false,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "Open WebUI",
    },
    print: {
      enabled: false,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第五册《Open WebUI》完整打印版。",
    },
  },
  {
    id: "06-dify",
    number: 6,
    slug: "06-dify",
    title: "Dify",
    shortTitle: "Dify",
    subtitle: "搭建可维护的 AI 应用",
    description: "理解并搭建 AI 应用工作流。",
    status: "planned",
    version: "0.0.0",
    updatedAt: "2026-07-27",
    featured: false,
    cover: {
      navigationLabel: "第六册",
      titleLines: ["Dify"],
      learningPath: [],
      audience: "希望通过图形界面搭建 AI 应用的用户。",
      outcome: "理解模型、知识库和工作流之间的关系。",
      prerequisites: "具备基础的服务器和 Docker 使用经验。",
    },
    completion: standardCompletionRules,
    search: {
      enabled: false,
      indexedChapterTypes: allContentTypes,
      resultBookLabel: "Dify",
    },
    print: {
      enabled: false,
      includedChapterTypes: allContentTypes,
      noindex: true,
      description: "第六册《Dify》完整打印版。",
    },
  },
  {
    id: "07-n8n",
    number: 7,
    slug: "07-n8n",
    title: "n8n",
    shortTitle: "n8n",
    subtitle: "建立自己的自动化流程",
    description: "搭建可维护的自动化流程。",
    status: "planned",
    version: "0.0.0",
    updatedAt: "2026-07-27",
    featured: false,
    cover: {
      navigationLabel: "第七册",
      titleLines: ["n8n"],
      learningPath: [],
      audience: "希望把重复工作连接成自动化流程的用户。",
      outcome: "能够理解触发器、节点、凭证和执行记录。",
      prerequisites: "具备基础的服务器和 Docker 使用经验。",
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
    title: "Supabase",
    shortTitle: "Supabase",
    subtitle: "数据库、认证与存储入门",
    description: "理解数据库、认证、存储与应用连接。",
    status: "planned",
    version: "0.0.0",
    updatedAt: "2026-07-27",
    featured: false,
    cover: {
      navigationLabel: "第八册",
      titleLines: ["Supabase"],
      learningPath: [],
      audience: "需要为应用准备数据库和用户系统的普通用户。",
      outcome: "理解数据库、认证和文件存储的基本职责。",
      prerequisites: "理解网站、账号和数据库的基础概念。",
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
    title: "AI 开发环境",
    shortTitle: "AI 开发环境",
    subtitle: "建立稳定的本地工作环境",
    description: "建立适合 AI 工具与开发工作的本地环境。",
    status: "planned",
    version: "0.0.0",
    updatedAt: "2026-07-27",
    featured: false,
    cover: {
      navigationLabel: "第九册",
      titleLines: ["AI 开发环境"],
      learningPath: [],
      audience: "需要在本地使用 AI 开发工具的知识工作者。",
      outcome: "建立可维护的终端、编辑器和项目环境。",
      prerequisites: "能够安装普通桌面软件和管理文件。",
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
    title: "服务器安全与运维",
    shortTitle: "服务器安全与运维",
    subtitle: "更新、备份、监控与故障处理",
    description: "逐步建立更新、备份、监控和故障处理能力。",
    status: "planned",
    version: "0.0.0",
    updatedAt: "2026-07-27",
    featured: false,
    cover: {
      navigationLabel: "第十册",
      titleLines: ["服务器安全", "与运维"],
      learningPath: [],
      audience: "已经运行服务并需要长期维护服务器的用户。",
      outcome: "建立更新、备份、监控和故障响应的基本习惯。",
      prerequisites: "能够登录服务器并理解正在运行的服务。",
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
