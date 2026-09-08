# 嘻嘻小课堂 — Git 协作约定

远端：https://github.com/sugarlilei/xixi-classroom（私有）

## 分支

| 分支 | 用途 |
|------|------|
| `main` | 稳定主干，可构建可安装 |
| `feat/*` | 功能开发（参考 ParkingPay 的 `feat/parkingpay-v1`） |
| `fix/*` | 缺陷修复 |

当前默认在 `main` 上迭代；有较大功能时可切 `feat/xixi-v1`。

## 提交规范（Conventional Commits）

```
feat: 新功能
fix: 缺陷修复
docs: 文档
build: 构建/依赖
chore: 杂项脚手架
refactor: 重构（行为不变）
```

示例：

```bash
git add -A
git commit -m "fix: prevent detail page blank from zustand selector thrashing"
git push -u origin HEAD
```

## 入库 / 不入库

**入库：**

- `app/src`、`docs/`、`data/`、`prototype/`
- Capacitor 工程骨架（`app/android`、`app/ios` 源文件）
- `release/android/*.apk`、`release/*.zip`、安装说明

**不入库：**

- `node_modules/`、`app/dist/`
- `release/web-dist/`（由构建生成，只保留 zip）
- Android/iOS 本地 build、Capacitor sync 出来的 `assets/public` 等

## 常用命令

```powershell
cd "D:\aliyun ai\personal\kids-english-enlighten\app"
npm install
npm run smoke
npm run build
npm run release:web
npm run android:apk
```

打好的 APK 复制到：

`release/android/xixi-classroom-debug.apk`
