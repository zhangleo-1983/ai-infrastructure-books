# 样章：完成首次 SSH 登录，进入第二册

> 第一册《15分钟搞定你的VPS》第 12 章样稿
>
> 样稿日期：2026-07-27
>
> 状态：最复杂样章，用于验证 Windows/macOS 与密码/密钥双路径，不是正式 MDX

付款成功不是本书的终点。

这一章要完成真正的交付验证：从自己的电脑进入刚刚创建的服务器，确认管理员身份，再
安全退出。

你只需要实际完成自己选择的认证路径：

- 创建服务器时选择了 SSH 密钥，就完成密钥路径；
- 创建服务器时使用密码，就完成密码路径。

另一条路径仍会完整展示，方便你知道两者的区别，但不要为了测试第二条路径重新安装或
重置已经正常运行的服务器。

## 开始前准备六项信息

先打开 Vultr 实例详情页和第一册交接卡。

| 项目 | 教学示例 | 你的真实信息在哪里 |
| --- | --- | --- |
| 实例状态 | Running | Vultr 实例详情页 |
| 公网 IPv4 | `203.0.113.10` | 实例 Overview |
| 地区 | Tokyo | 实例 Overview |
| 系统 | Ubuntu 24.04 LTS x64 | 实例系统信息 |
| 管理员用户名 | `root` | 实例登录信息 |
| 认证方式 | Password 或 SSH Key | 创建实例时的选择 |

`203.0.113.10` 是文档保留地址，不能用来登录。所有命令中的示例 IP 都必须替换成你的
真实公网 IPv4。

同时确认：

- 本地网络可以正常访问普通网站；
- 云防火墙允许 TCP 22；
- 你没有把服务器密码发到聊天窗口；
- 如果使用密钥，你知道私钥文件放在哪里；
- 实例不是 Pending、Installing、Stopped 或 Reinstalling。

如果实例还没有显示 Running，先等待或回到故障排查章，不要反复创建新服务器。

## SSH 和终端分别是什么

SSH 是 Secure Shell 的缩写，是一种加密远程登录协议。

终端是你输入文字命令的窗口。

它们的关系是：

```text
你的电脑终端
→
SSH 加密连接
→
公网 IPv4 的 22 端口
→
Ubuntu VPS
```

SSH 不是“黑客工具”，终端也不是服务器本身。你在本地终端输入 `ssh` 命令，命令才会
尝试建立通往远程服务器的连接。

## Windows：打开 PowerShell 或 Windows Terminal

1. 点击开始菜单；
2. 搜索 `PowerShell` 或 `Windows Terminal`；
3. 打开普通窗口，不需要先选择“以管理员身份运行”。

你会看到类似：

```text
PS C:\Users\YourName>
```

这说明终端已经打开，还没有进入服务器。

如果输入 `ssh` 后出现“无法识别命令”，先确认 Windows 已启用 OpenSSH Client。不要
从陌生网站下载一个名为 SSH 的程序。

## macOS：打开终端

1. 按 `Command + 空格`；
2. 输入“终端”或 `Terminal`；
3. 按回车打开。

你会看到类似：

```text
yourname@Mac ~ %
```

这同样是本地电脑，还不是 VPS。

## 第一次出现的主机提示

无论使用密码还是密钥，第一次连接某个 IP 时都可能看到：

```text
The authenticity of host '203.0.113.10' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

这里显示的是服务器主机密钥指纹，不是你的登录私钥。

### 先做什么

1. 再次核对命令中的 IP 与 Vultr 实例详情页一致；
2. 确认这是你第一次连接这台新实例；
3. 如果服务商控制台提供主机指纹，进一步核对指纹；
4. 确认无误后输入：

```text
yes
```

SSH 会把主机记录到本地 `known_hosts`，然后继续密码或密钥认证。

### 什么时候不能直接输入 yes

- 你输入的 IP 与实例详情页不同；
- 这不是第一次连接，却突然提示主机密钥变化；
- 你刚删除旧实例，而新实例复用了同一个 IP；
- 提示中显示的地址不是你准备连接的服务器。

如果出现：

```text
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
```

先停止。它可能只是服务器重装或 IP 被复用，也可能表示连接目标与以前不同。确认当前 IP
确实属于新实例后，Windows PowerShell 和 macOS 终端都可以执行：

```bash
ssh-keygen -R 203.0.113.10
```

把示例 IP 换成已经从 Vultr 控制台重新核对的真实 IP。这条命令只删除本地保存的旧主机
记录，不会修改服务器。重新连接时，再次检查新出现的 IP 和指纹提示。

如果无法确认服务器是否重装、IP 是否被复用或提示是否合理，不要删除记录，也不要继续
输入密码或私钥口令。

## 路径 A：使用 SSH 密钥登录

SSH 密钥包含：

- 公钥：可以放到服务器或 Vultr 账户中；
- 私钥：只保存在你自己的电脑中。

私钥像不能补发的实体钥匙。不要把它粘贴到 Vultr 的 SSH Key 文本框；那里需要的是
以 `.pub` 结尾的公钥内容。

本书第 7 章已经生成 ED25519 密钥，并在创建实例前把公钥加入 Vultr。

### Windows 密钥路径

如果使用默认文件名，私钥通常位于：

```text
C:\Users\你的用户名\.ssh\id_ed25519
```

在 PowerShell 输入：

```powershell
ssh -i "$env:USERPROFILE\.ssh\id_ed25519" root@203.0.113.10
```

需要替换的只有 IP。如果你的私钥使用了不同名称，也要把路径替换成真实文件。

### macOS 密钥路径

如果使用默认文件名，私钥通常位于：

```text
~/.ssh/id_ed25519
```

在终端输入：

```bash
ssh -i ~/.ssh/id_ed25519 root@203.0.113.10
```

### 如果密钥设置了口令

终端可能显示：

```text
Enter passphrase for key '/.../.ssh/id_ed25519':
```

这里需要输入的是创建密钥时设置的私钥口令，不是 Vultr 账户密码，也不是服务器 root
密码。

输入时屏幕可能不会显示字符。输入完成后直接按回车。

### 密钥路径的成功状态

你没有看到服务器密码提示，而是直接进入 Ubuntu，或只要求输入私钥口令。

终端会出现类似：

```text
Welcome to Ubuntu 24.04 LTS

root@book01-vps:~#
```

### 密钥路径的失败判断

```text
Warning: Identity file ... not accessible
```

表示命令中的私钥路径不正确，或文件已经被移动。不要改服务器，先在本地确认文件。

```text
Permission denied (publickey)
```

常见原因包括：

- 使用了错误的私钥；
- 公钥没有在创建实例时加入；
- 用户名不是 `root`；
- 连接到了错误的 IP；
- 服务商镜像使用其他管理员用户。

Vultr 官方提醒：实例创建后通过控制台“重新安装 SSH Keys”可能重装并清除服务器数据。
不要把这个按钮当成普通的“再试一次”。

macOS 如果提示私钥文件权限过宽，可以确认文件确实是自己的私钥后执行：

```bash
chmod 600 ~/.ssh/id_ed25519
```

这个命令只调整本地私钥文件权限，不会修改服务器。

## 路径 B：使用密码登录

如果创建实例时使用密码，Windows 和 macOS 使用同一条 SSH 命令：

```bash
ssh root@203.0.113.10
```

把示例 IP 换成真实公网 IPv4。

终端可能显示：

```text
root@203.0.113.10's password:
```

复制服务器的 root 密码，粘贴后按回车。

### 输入密码时为什么什么都看不到

终端通常不会显示：

- 字母；
- 圆点；
- 星号；
- 光标移动。

这是正常的安全行为，不代表粘贴失败。

不要因为看不到字符就连续粘贴多次。粘贴一次，按回车，等待结果。

### 密码路径的成功状态

看到 Ubuntu 欢迎信息和类似下面的提示符：

```text
root@book01-vps:~#
```

### 密码路径的失败判断

```text
Permission denied, please try again.
```

先检查：

1. 用户名是否真的是 `root`；
2. IP 是否来自当前实例；
3. 复制密码时是否带入了前后空格；
4. 实例是否刚刚重装或重置过密码；
5. 当前镜像是否只允许密钥登录。

不要高速重复尝试。连续错误可能触发安全限制，也容易让你忘记自己改过什么。

## 验证你以什么身份登录

进入服务器后输入：

```bash
whoami
```

主线应返回：

```text
root
```

这说明你当前是 root 管理员。

### 如果使用 Limited User

如果第 8 章明确选择了 Limited User，`whoami` 可能返回：

```text
linuxuser
```

继续检查该用户是否有 sudo 管理权限：

```bash
sudo whoami
```

预期返回：

```text
root
```

如果 `sudo` 不存在、用户不在 sudoers 中，或你不知道它要求哪个密码，这台服务器还
没有满足第二册的管理员账户交付条件。

## 正常退出服务器

验证完成后输入：

```bash
exit
```

你应该回到本地提示符。

Windows 示例：

```text
PS C:\Users\YourName>
```

macOS 示例：

```text
yourname@Mac ~ %
```

看到本地提示符，说明 SSH 会话已经结束。关闭终端窗口也会断开，但养成使用 `exit`
退出的习惯，更容易判断自己当前是在本地还是服务器里。

## 连接失败时按层判断

不要同时重置密码、重装服务器、换 IP 和修改防火墙。一次只检查一层。

### 1. 一直等待，最后超时

可能显示：

```text
ssh: connect to host 203.0.113.10 port 22: Operation timed out
```

按顺序检查：

1. 实例是否 Running；
2. IP 是否正确；
3. Vultr Firewall 是否允许 TCP 22；
4. 防火墙来源是否只允许了一个已经变化的本地公网 IP；
5. 本地网络是否限制 SSH；
6. 是否误选了只有 IPv6 或 NAT 的实例。

### 2. 连接被拒绝

```text
ssh: connect to host 203.0.113.10 port 22: Connection refused
```

它通常表示已经到达目标地址，但 SSH 服务没有在该端口接受连接。实例可能仍在初始化，
SSH 服务可能异常，或端口配置与预期不同。

先使用 Vultr Web Console 查看实例状态，不要立即开放所有端口。

### 3. 密码被拒绝

```text
Permission denied, please try again.
```

检查用户名、密码、IP 和镜像认证方式。不要输入 Vultr 网站账户密码。

### 4. 密钥被拒绝

```text
Permission denied (publickey).
```

检查私钥文件、公钥绑定、用户名和 IP。不要把私钥重新上传到公钥字段。

### 5. 本地找不到私钥

```text
Identity file ... not accessible
```

这是本地文件路径问题。服务器和防火墙可能都没有问题。

## 整理第二册交接卡

首次登录成功后，再填写交接卡：

```text
服务商：Vultr
实例名称或 ID：
服务器地区：Tokyo
公网 IPv4：
操作系统：Ubuntu 24.04 LTS
CPU 架构：amd64
管理员用户名：root / 实际 sudo 用户
认证方式：SSH 密钥 / 密码
凭证保存位置：
云防火墙：名称与 TCP 22 规则
创建日期：
持续费用与币种：
停止计费的方法：Destroy 实例，并检查其他独立资源
首次 SSH 登录：已成功
```

不要在交接卡中填写：

- root 密码；
- SSH 私钥正文；
- 银行卡或支付宝信息；
- 身份证件号码；
- Vultr 账户恢复代码。

## 本章完成检查

- [ ] 实例状态为 Running；
- [ ] 我使用的是真实独立公网 IPv4；
- [ ] 云防火墙允许 TCP 22；
- [ ] 我已经完成密钥或密码路径中的一条；
- [ ] 第一次主机提示中的 IP 已核对；
- [ ] `whoami` 返回预期用户；
- [ ] 如果不是 root，`sudo whoami` 返回 root；
- [ ] 我使用 `exit` 回到本地终端；
- [ ] 交接卡完整，但没有写入密码或私钥；
- [ ] 我知道服务器停止后仍可能继续计费。

全部完成后，你已经达到第一册的最终交付状态：

- 一台正在运行、已经实际验证可登录的 Ubuntu VPS；
- 一个独立公网 IPv4；
- 一个 root 或可 sudo 的管理员账户；
- 一种已经测试成功的登录凭证；
- 一个明确的服务器地区；
- 一份可以继续使用的安全交接记录。

下一步进入第二册《拥有自己的海外网络》。第二册会保留独立阅读所需的登录说明；如果
你从第一册连续阅读，第 2 章将用于重新登录和复习，并继续带你安装 3X-UI。

## 本章事实来源

- [Vultr：使用 OpenSSH 连接 Cloud Compute](https://docs.vultr.com/products/compute/instances/cloud-compute/connection/openssh)；
- [Vultr：添加和管理 SSH Keys](https://docs.vultr.com/products/orchestration/ssh-keys/add-ssh-keys)；
- [Ubuntu Server：OpenSSH 与 ED25519 密钥](https://ubuntu.com/server/docs/how-to/security/openssh-server/)；
- [Vultr：Cloud Compute 部署流程](https://docs.vultr.com/products/compute/instances/cloud-compute/provisioning)。

正式 MDX 迁移时，Windows/macOS 必须保持渐进增强：JavaScript 正常时可以切换标签，
JavaScript 关闭时两套内容都必须可读。密码、私钥、IP 和主机指纹都只能使用文档示例。
