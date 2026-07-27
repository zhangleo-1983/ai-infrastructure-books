export interface Book01SearchSample {
  query: string;
  expectedSlugs: string[];
  knownLimitation?: string;
}

export const book01SearchSamples: Book01SearchSample[] = [
  { query: "VPS", expectedSlugs: ["01-what-is-vps", "start"] },
  { query: "公网 IPv4", expectedSlugs: ["02-read-a-plan", "10-instance-ready"] },
  { query: "Shared CPU", expectedSlugs: ["02-read-a-plan", "08-create-server"] },
  { query: "东京", expectedSlugs: ["05-choose-region", "08-create-server"] },
  { query: "支付宝", expectedSlugs: ["06-account-payment-verification"] },
  { query: "实名认证", expectedSlugs: ["06-account-payment-verification"] },
  { query: "SSH 密钥", expectedSlugs: ["07-login-method", "12-first-login-and-handoff"] },
  { query: "公钥", expectedSlugs: ["07-login-method"] },
  { query: "Firewall", expectedSlugs: ["08-create-server"] },
  { query: "Deploy", expectedSlugs: ["08-create-server", "09-order-and-billing"] },
  { query: "自动备份", expectedSlugs: ["09-order-and-billing"] },
  { query: "Running", expectedSlugs: ["10-instance-ready"] },
  { query: "付款失败", expectedSlugs: ["11-purchase-troubleshooting"] },
  { query: "Permission denied", expectedSlugs: ["12-first-login-and-handoff"] },
  { query: "whoami", expectedSlugs: ["12-first-login-and-handoff"] },
  { query: "交接卡", expectedSlugs: ["12-first-login-and-handoff", "appendix"] },
];
