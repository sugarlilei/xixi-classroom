# 嘻嘻小课堂

个人自用的英语启蒙内容导航 App：按年龄与听力基础，帮家长决定「今天该播哪套」，并按推荐顺序推进。

## 目录结构

```
kids-english-enlighten/
├── README.md
├── docs/product/             # 产品文档
├── docs/tech/                # 技术草案 + Git 约定
├── data/series.json          # 内容种子
├── prototype/                # v0.1 HTML 原型
├── app/                      # v0.2 正式版（Vite React PWA + Capacitor）
├── assets/                   # 封面等预留
└── release/                  # 可安装产物（APK / Web zip / 说明）
```

## 安装包（release）

| 平台 | 状态 | 路径 |
|------|------|------|
| **安卓 APK** | ✅ 可直接安装 | `release/android/xixi-classroom-debug.apk` |
| **iOS IPA** | ⚠️ 需 Mac 签名 | 工程在 `app/ios/`，说明见 `release/INSTALL.md` |
| Web/PWA | ✅ | `release/xixi-classroom-web-v0.2.zip` |

Git 约定见 [docs/tech/GIT.md](docs/tech/GIT.md)。

## 启动正式版（开发）

```powershell
cd "D:\aliyun ai\personal\kids-english-enlighten\app"
npm install
npm run dev
```

浏览器打开终端提示地址（默认 `http://localhost:5173`）。

## 打开旧原型（可选）

```powershell
cd "D:\aliyun ai\personal\kids-english-enlighten\prototype"
npx --yes serve -p 5174
```

## 产品定位摘要

- **做**：策展导航、年龄筛选、三阶段路径、进度/收藏、个人资源多源播放兼容
- **不做**：账号体系、盗版片源分发、社区订阅
- **播放**：仅对接你自己已有的清晰资源（本地文件 / 网盘直链 / **B 站收藏入口优先**），不内置任何不明来源内容

## 文档入口

| 文档 | 路径 |
|------|------|
| 产品需求 | [docs/product/PRD.md](docs/product/PRD.md) |
| 一页总览 | [docs/product/OVERVIEW.md](docs/product/OVERVIEW.md) |
| 技术草案 | [docs/tech/TECH-OUTLINE.md](docs/tech/TECH-OUTLINE.md) |
