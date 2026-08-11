# 第三册样章台账

校订日期：2026-07-28

## 样章策略

本文件保留样章阶段的审阅记录。该阶段先验证最复杂的第 9 章“用 Compose 管理一套
服务”，再验证安装主线：

1. 第 9 章“用 Compose 管理一套服务”：已完成；
2. 第 3 章“从官方软件源安装 Docker Engine”：已完成；
3. “开始之前”：已完成；
4. 其他正式章节：样章轮未创建，后续已分批完成，见 `content-progress.md`。

样章必须验证：

- MDX 对中文长文和 YAML 是否易于维护；
- 命令显示值与复制值是否保持单一来源；
- 端口、目录映射和 Compose 对象关系能否被零基础读者理解；
- 终端、表格和流程图在手机端及打印时是否可读；
- 草稿不会进入 production build 和 Pagefind；
- 第一、二册路由与正文没有变化。

## 开始之前

| 项目 | 当前状态 |
| --- | --- |
| 文件 | `src/content/books/03-docker/00-introduction.mdx` |
| order | `0` |
| slug | `start` |
| chapterType | `introduction` |
| draft | `true` |
| 完成率 | 不计入，不写入 `completionId` |
| 操作范围 | 只读检查，不安装、不停止、不清理 |
| 技术校订日期 | 2026-07-28 |
| 作者审阅 | 已确认，2026-07-28 |

### 已覆盖的内容单元

- [x] 第三册交付物与不包含内容
- [x] 第一册为必需前置、第二册为可选前置
- [x] 本地终端与 VPS 终端区别
- [x] 第一册交接卡输入
- [x] 保留现有会话并重新验证 SSH
- [x] root / sudo 管理权限
- [x] Ubuntu 24.04 LTS 与 amd64
- [x] 根磁盘、内存与 CPU 清点
- [x] systemd 运行中服务清点
- [x] TCP / UDP 监听端口清点
- [x] 3X-UI / Xray 共用服务器边界
- [x] 现有 Docker 与对象只读清点
- [x] Docker 网络和防火墙提前提醒
- [x] `docker-labs`、`book03-` 与 Compose project 命名约定
- [x] 不含秘密的开始前清点表
- [x] “可以继续 / 需先处理 / 必须停止”三档决策
- [x] introduction 不进入完成率
- [x] 官方资料与校订日期

### 安全停点

出现以下任一情况，不进入安装章节：

- 无法通过第二个 SSH 窗口重新登录；
- 当前账户没有 root / sudo 管理权限；
- 系统或架构不是已校订主线；
- 根分区可用空间不足约 2 GB 或服务器正在异常；
- 存在无法辨认的业务服务或公网监听端口；
- 已有 Docker 容器、volume 或网络无法确认用途；
- 无法说明第二册面板、Xray 入站与 SSH 使用的端口。

### 当前有意不执行

- 安装、卸载或升级 Docker；
- 创建 `docker-labs` 目录；
- 启动、停止或禁用 systemd 服务；
- 修改 UFW、iptables、nftables、云防火墙或 Docker 网络；
- 清理容器、镜像、volume、日志或系统文件；
- 把现有 3X-UI / Xray 迁移进 Docker。

## 第 3 章

| 项目 | 当前状态 |
| --- | --- |
| 文件 | `src/content/books/03-docker/03-install-docker.mdx` |
| order | `3` |
| slug | `03-install-docker` |
| draft | `true` |
| 主线系统 | Ubuntu 24.04 LTS |
| 主线架构 | amd64 |
| 安装来源 | Docker 官方 APT 软件源 |
| 权限口径 | 保留 `sudo docker` |
| 首次验证 | `sudo docker run --rm hello-world` |
| 技术校订日期 | 2026-07-28 |
| 本地 Docker 实跑 | 待后续实机核验；当前开发机未安装 Docker |
| 作者审阅 | 已确认，2026-07-28 |

### 已覆盖的内容单元

- [x] 学习目标和交付状态
- [x] Ubuntu、架构、权限与磁盘检查
- [x] 冲突软件包只读检查
- [x] 仅在确认无业务时移除冲突包的停点
- [x] Docker 官方 GPG key
- [x] deb822 格式的 `docker.sources`
- [x] APT Candidate 与来源检查
- [x] Engine、CLI、containerd、Buildx 与 Compose plugin 职责
- [x] Docker 官方软件包安装
- [x] systemd 服务状态和失败日志
- [x] Client / Server / Compose / Buildx 版本验证
- [x] `hello-world` 端到端验证
- [x] `docker` 用户组 root 级权限边界
- [x] 便捷安装脚本不作为主线
- [x] UFW、firewalld 与 `DOCKER-USER` 提前提醒
- [x] 分层故障判断
- [x] 章节完成项
- [x] 官方资料与校订日期

### 当前有意不覆盖

- Docker 基本对象的完整概念解释：属于第 1—2 章；
- `docker run` 参数与容器生命周期：属于第 4—5 章；
- 实际发布容器端口：属于第 6 章；
- rootless Docker 的安装与迁移：超出第三册主线；
- 为当前用户加入 `docker` 用户组：主线保留 `sudo`，不隐藏 root 级权限；
- 版本锁定与升级策略：第 11 章统一处理；
- 来源不明的镜像加速器：不进入正文。

### 技术事实核验

| 事实 | 2026-07-28 结论 | 官方依据 | RC 前复核 |
| --- | --- | --- | --- |
| Ubuntu 24.04 LTS | 仍在 Docker Engine 官方支持列表 | Docker Ubuntu install | [ ] |
| amd64 | 仍为受支持架构 | Docker Ubuntu install | [ ] |
| 软件源格式 | 当前官方示例使用 deb822 `docker.sources` | Docker Ubuntu install | [ ] |
| 签名密钥 | `docker.asc` 位于 `/etc/apt/keyrings/` | Docker Ubuntu install | [ ] |
| 安装包 | `docker-ce`、CLI、`containerd.io`、Buildx、Compose plugin | Docker Ubuntu install | [ ] |
| Ubuntu 服务启动 | 安装后通常启动，且 Debian/Ubuntu 默认开机启动 | Docker install / post-install | [ ] |
| `docker` 用户组 | 成员具有 root 级权限 | Docker Linux post-install | [ ] |
| 发布端口与防火墙 | Docker 发布端口可能绕过 UFW/firewalld 直觉 | Docker Ubuntu install | [ ] |
| 便捷脚本 | 只推荐测试与开发，不作为生产主线 | Docker Ubuntu install | [ ] |

### 后续实机核验

当前开发机没有 Docker Engine，本项目也未创建需要持续计费的新 VPS，因此本轮没有执行
APT 安装和 `hello-world`。进入正文批量撰写前，应在不承载重要业务的 Ubuntu 24.04
LTS amd64 VPS 上从全新系统完整执行本章，并记录：

- 软件源文件实际内容与 APT Candidate；
- 官方软件包的实际版本；
- 安装前后的磁盘占用；
- Docker service 是否自动启动并处于 enabled；
- Client、Server、Compose 与 Buildx 的实际输出；
- `hello-world` 拉取、运行、退出和残留对象；
- 中国大陆用户所购不同地区 VPS 到 Docker 官方源与 Docker Hub 的连接表现；
- 失败后重复执行各组命令是否保持可恢复；
- 与已安装 3X-UI / Xray 的服务器共用时是否出现端口或防火墙退化。

## 第 9 章

| 项目 | 当前状态 |
| --- | --- |
| 文件 | `src/content/books/03-docker/09-docker-compose.mdx` |
| order | `9` |
| slug | `09-docker-compose` |
| draft | `true` |
| 贯穿镜像 | `nginx:1.30.4-alpine` |
| Compose project | `book03-compose-demo` |
| 主机监听 | `127.0.0.1:8080` |
| 容器端口 | `80/tcp` |
| 数据方式 | `./site` 只读 bind mount |
| 技术校订日期 | 2026-07-28 |
| 本地 Docker 实跑 | 待后续实机核验；当前开发机未安装 Docker |
| 作者审阅 | 已确认，2026-07-28 |

### 已覆盖的内容单元

- [x] 学习目标
- [x] 开始前检查
- [x] Compose 对象关系
- [x] 固定项目目录
- [x] 可观察网页文件
- [x] 完整 `compose.yaml`
- [x] 字段逐项解释
- [x] `docker compose config -q`
- [x] `docker compose up -d`
- [x] `docker compose ps`
- [x] 服务器本机 `curl`
- [x] bind mount 修改验证
- [x] `docker compose logs`
- [x] stop / start / down / recreate
- [x] 高风险 `down -v` 边界
- [x] 常见失败分层判断
- [x] 章节完成项
- [x] 官方资料与校订日期

### 当前有意不覆盖

- 公网开放的完整步骤：属于第 6 章，本章只保留边界提醒；
- named volume 实操：属于第 7 章；
- secrets 实操：属于第 8 章；
- 日志轮转、镜像更新和备份：属于第 11 章；
- 域名、HTTPS 和反向代理：属于第四册；
- Dockerfile 构建：第三册只做最小认读。

### 后续实机核验

当前开发机没有 Docker Engine，用户也没有为本项目创建需持续计费的 VPS，因此本轮没有
实际拉取或运行 Nginx。进入正文批量撰写前，应在不承载重要业务的 Ubuntu 24.04 LTS
amd64 VPS 上完整执行本章，并记录：

- Docker Engine 与 Compose 的实际版本；
- `nginx:1.30.4-alpine` 的 amd64 镜像摘要；
- `docker compose config` 的解析结果；
- `up`、`ps`、`logs`、`stop`、`start`、`down` 与重新创建的真实输出；
- `127.0.0.1:8080` 的实际监听范围；
- bind mount 修改后的页面变化；
- 主机重启后的 `unless-stopped` 行为；
- 与 UFW、云防火墙及第二册现有端口共存时的边界。

## 官方来源

- <https://docs.docker.com/engine/install/ubuntu/>
- <https://docs.docker.com/engine/install/linux-postinstall/>
- <https://docs.docker.com/engine/security/>
- <https://docs.docker.com/engine/network/packet-filtering-firewalls/#docker-and-ufw>
- <https://docs.docker.com/compose/gettingstarted/>
- <https://docs.docker.com/reference/cli/docker/compose/config/>
- <https://docs.docker.com/reference/cli/docker/compose/up/>
- <https://docs.docker.com/reference/cli/docker/compose/down/>
- <https://docs.docker.com/compose/how-tos/networking/>
- <https://hub.docker.com/_/nginx>
