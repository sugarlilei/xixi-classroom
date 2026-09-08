# 嘻嘻小课堂 — 技术实现草案

## 1. 阶段划分

| 阶段 | 形态 | 目标 |
|------|------|------|
| v0.1（当前） | 静态 HTML/CSS/JS 原型 | 验证信息架构、文案、资源播放交互 |
| v0.2 | Vite + React + PWA | 正式个人可用版本 |
| v1.0 | 同上 + 增强 | 打卡、导入导出、封面、安装体验 |

## 2. 建议技术栈（v0.2）

| 层 | 选型 | 理由 |
|----|------|------|
| 构建 | Vite | 快、简单 |
| UI | React + TypeScript | 组件化清晰 |
| 样式 | Tailwind CSS | 快速出温暖圆角风格 |
| 路由 | React Router | 多页导航 |
| 状态 | 轻量 Context 或 Zustand | 进度/资源本地状态 |
| 持久化 | localStorage（可换 localforage） | 零后端 |
| PWA | vite-plugin-pwa | 主屏安装、离线读文档型页面 |
| 内容 | 静态 `series.json` | 与代码解耦 |

**备选**：若希望更轻，可用纯静态站点（继续演进当前 prototype），不引入 React。

## 3. 播放兼容实现要点

```
用户添加资源
    ↓
按 type 分支
    ├─ local  → <input type="file" accept="video/*">
    │            使用 URL.createObjectURL → <video controls>
    │            注意：刷新后 object URL 失效，需重新选择或未来桌面端记路径
    ├─ direct → 校验 URL → <video src> 或打开新标签
    ├─ web    → window.open(url) 外链（默认偏好 B 站收藏/正版页）
    └─ folder → 仅展示备忘路径文本（浏览器无法直接列目录）
```

**流畅体验**

- `<video>` 提供 `controls`、`playsInline`、足够大的触控区域
- 加载中 / 失败态文案明确，失败时提供「打开外部链接」降级
- 同一系列多资源按 `priority` 排序，默认选第一条
- **不存储、不请求任何第三方片源索引**

**浏览器限制说明（写入产品预期）**

- 浏览器安全策略下，网页无法永久记住本地绝对路径；每次会话可能需重新选择本地文件
- 若强需求「记住盘符路径」，v1 可考虑轻量桌面壳（Tauri）——列为可选，不阻塞 MVP

## 4. 目录约定（保持分类清晰）

```
kids-english-enlighten/
├── docs/product/     # 只放产品文档
├── docs/tech/        # 只放技术文档
├── data/             # 只放内容种子与 schema
├── prototype/        # 只放 v0.1 原型
├── assets/           # 只放图片/图标（用户自备）
└── app/              # （v0.2 新建）正式前端工程，勿与 prototype 混放
```

## 5. 实现切片建议（v0.2 PR 级）

1. **脚手架**：Vite React TS + Tailwind + 路由底栏
2. **内容层**：导入 `series.json`，系列库 + 详情只读
3. **进度层**：localStorage 进度/收藏 + 首页推荐算法
4. **资源层**：资源 CRUD + video/外链播放兼容
5. **PWA**：manifest、离线壳、加主屏
6. **打卡与导出**（可独立 PR）

## 6. 安全与合规

- 默认无后端、无账号、无分析 SDK
- 用户粘贴的 URL 仅存本地；打开外链时可用 `noopener`
- README / 详情页注明：仅供个人管理自有资源

## 7. 原型 → 正式版映射

| 原型文件 | 正式组件建议 |
|----------|----------------|
| `index.html` | `pages/Home` |
| `path.html` | `pages/Path` |
| `library.html` | `pages/Library` |
| `detail.html` | `pages/Detail` + `components/Player` + `ResourceEditor` |
| `mine.html` | `pages/Mine` |
| `guide.html` | `pages/Guide` |
| `js/storage.js` | `lib/storage.ts` |
| `js/data.js` / `data/series.json` | `data/series.json` |
