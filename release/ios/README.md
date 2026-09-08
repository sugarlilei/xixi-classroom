# iOS 包说明

本目录 **不能** 在 Windows 上直接生成可安装的 `.ipa`。

原因：Apple 要求必须使用 **macOS + Xcode + 开发者签名** 才能产出真机可装包。

## 已具备的前置

- Web 工程：`app/`（Vite + React + Capacitor）
- 安卓 APK 已可直接安装：`../android/xixi-classroom-debug.apk`

## 在 Mac 上出 IPA（摘要）

详见上级目录 `../INSTALL.md` 的 iOS 章节。

核心命令：

```bash
cd app
npm install
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

然后在 Xcode 里选 Team 签名 → Archive → 导出 IPA / TestFlight。
