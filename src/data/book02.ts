export type ChapterType =
  | "introduction"
  | "chapter"
  | "appendix"
  | "sources";

export interface Book02ChapterPlanItem {
  order: number;
  slug: string;
  title: string;
  shortTitle: string;
  chapterType: ChapterType;
  migrated: boolean;
}

export const book02Id = "02-overseas-network";

export const book02ChapterPlan: Book02ChapterPlanItem[] = [
  {
    order: 0,
    slug: "start",
    title: "开始之前",
    shortTitle: "开始之前",
    chapterType: "introduction",
    migrated: true,
  },
  {
    order: 1,
    slug: "01-after-vps",
    title: "VPS 已经买好了，然后呢？",
    shortTitle: "买好 VPS，然后呢",
    chapterType: "chapter",
    migrated: true,
  },
  {
    order: 2,
    slug: "02-login-server",
    title: "登录你的第一台服务器",
    shortTitle: "登录服务器",
    chapterType: "chapter",
    migrated: true,
  },
  {
    order: 3,
    slug: "03-understand-3x-ui",
    title: "认识 3X-UI",
    shortTitle: "认识 3X-UI",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 4,
    slug: "04-install-3x-ui",
    title: "安装 3X-UI",
    shortTitle: "安装 3X-UI",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 5,
    slug: "05-create-reality-node",
    title: "创建第一个 VLESS Reality 节点",
    shortTitle: "创建 Reality 节点",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 6,
    slug: "06-subscription",
    title: "生成并理解订阅",
    shortTitle: "生成订阅",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 7,
    slug: "07-clash-verge-rev",
    title: "在电脑上使用 Clash Verge Rev",
    shortTitle: "Clash Verge Rev",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 8,
    slug: "08-shadowrocket",
    title: "在 iPhone 上使用 Shadowrocket",
    shortTitle: "Shadowrocket",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 9,
    slug: "09-verify-connection",
    title: "验证是否真正成功",
    shortTitle: "验证连接",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 10,
    slug: "10-daily-use",
    title: "多设备与日常使用",
    shortTitle: "多设备与日常使用",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 11,
    slug: "11-troubleshooting",
    title: "常见故障排查",
    shortTitle: "故障排查",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 12,
    slug: "12-security-maintenance",
    title: "安全、备份与长期维护",
    shortTitle: "安全与维护",
    chapterType: "chapter",
    migrated: false,
  },
  {
    order: 13,
    slug: "appendix",
    title: "速查表与术语",
    shortTitle: "附录",
    chapterType: "appendix",
    migrated: false,
  },
  {
    order: 14,
    slug: "sources",
    title: "版本说明与官方资料",
    shortTitle: "资料来源",
    chapterType: "sources",
    migrated: false,
  },
];
