export interface SearchQualitySample {
  query: string;
  expectedSlugs: string[];
  knownLimitation?: string;
}

export const book02SearchSamples: SearchQualitySample[] = [
  { query: "SSH", expectedSlugs: ["02-login-server", "12-security-maintenance"] },
  { query: "root", expectedSlugs: ["02-login-server", "12-security-maintenance"] },
  { query: "IP 地址", expectedSlugs: ["01-after-vps", "02-login-server"] },
  { query: "3X-UI", expectedSlugs: ["03-understand-3x-ui", "04-install-3x-ui"] },
  { query: "VLESS", expectedSlugs: ["05-create-reality-node"] },
  { query: "Reality", expectedSlugs: ["05-create-reality-node"] },
  { query: "公钥", expectedSlugs: ["appendix"] },
  {
    query: "私钥",
    expectedSlugs: ["05-create-reality-node"],
    knownLimitation: "Pagefind zh-cn 索引未返回仅出现在仿真字段说明中的“私钥”。",
  },
  { query: "Clash", expectedSlugs: ["07-clash-verge-rev"] },
  { query: "Shadowrocket", expectedSlugs: ["08-shadowrocket"] },
  { query: "订阅", expectedSlugs: ["06-subscription"] },
  { query: "连接失败", expectedSlugs: ["11-troubleshooting"] },
  { query: "端口", expectedSlugs: ["04-install-3x-ui", "05-create-reality-node", "11-troubleshooting"] },
  { query: "防火墙", expectedSlugs: ["11-troubleshooting"] },
  { query: "更新面板", expectedSlugs: ["12-security-maintenance"] },
  { query: "备份", expectedSlugs: ["12-security-maintenance"] },
];
