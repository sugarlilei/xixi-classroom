# 嘻嘻小课堂 — 安装包说明

## 安卓 APK（可直接安装）✅

| 文件 | 路径 |
|------|------|
| 安装包 | `release/android/xixi-classroom-debug.apk` |
| 构建产物源 | `app/android/app/build/outputs/apk/debug/app-debug.apk` |

### 安装步骤

1. 把 `xixi-classroom-debug.apk` 传到手机（微信/QQ/USB 均可）
2. 手机打开「允许安装未知来源应用」
3. 点击 APK 安装
4. 打开 **嘻嘻小课堂**

> 这是 **debug 签名包**，适合个人自用直接安装。上架应用商店需要再打正式签名 release 包。

### 重新打包安卓

```powershell
$env:JAVA_HOME='D:\Dev\jdk-21'
$env:ANDROID_HOME='D:\Dev\Android\Sdk'
cd "D:\aliyun ai\personal\kids-english-enlighten\app"
npm run cap:sync
cd android
.\gradlew.bat assembleDebug --no-daemon
```

---

## iOS 包（本机 Windows 无法直接产出可安装 IPA）⚠️

Apple 规定：

- 编译 IPA **必须在 macOS + Xcode**
- 真机安装需要 **Apple 开发者账号** 签名（或用公司企业签 / TestFlight）

当前 Windows 环境 **不能** 生成可直接安装的 `.ipa`。

### 你有 Mac 时怎么出 IPA

1. 把整个 `app` 目录拷到 Mac  
2. 安装 Xcode、Node、CocoaPods  
3. 执行：

```bash
cd app
npm install
npm install @capacitor/ios
npm run build
npx cap add ios   # 若尚未添加
npx cap sync ios
npx cap open ios
```

4. 在 Xcode 中：
   - Signing & Capabilities 选择你的 Team
   - 真机或 Archive → Distribute App
   - 导出 IPA / 上传 TestFlight

### 没有 Mac 的替代方案

| 方案 | 说明 |
|------|------|
| 云构建（Codemagic / GitHub Actions macOS runner） | 把仓库接上，用云 Mac 出 IPA |
| TestFlight | 需要开发者账号 + 云/Mac 构建 |
| 先用安卓包 | 当前已可直接装 |

---

## Web / PWA 包（备用）

`release/xixi-classroom-web-v0.2.zip` — 浏览器/主屏幕安装用。
