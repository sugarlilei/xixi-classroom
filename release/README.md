# 嘻嘻小课堂 — 发布包说明

当前交付的是 **Web / PWA 包**（浏览器可运行，可「添加到主屏幕」当 App 用），不是安卓 APK / iOS IPA。

## 包在哪

| 路径 | 说明 |
|------|------|
| `release/xixi-classroom-web-v0.2.zip` | 可分发的静态站点压缩包 |
| `release/web-dist/` | 解压后的静态文件（同 `app/dist`） |
| `app/dist/` | 构建产物源目录 |

## 怎么用

### 方式 A：本机预览（最快）

```powershell
cd "D:\aliyun ai\personal\kids-english-enlighten\app"
npm run preview
```

浏览器打开提示地址，在手机同网访问时可用 `--host`：

```powershell
npx vite preview --host
```

手机 Chrome / Edge / Safari：打开页面 → 菜单 → **添加到主屏幕 / 安装应用** → 即得到「嘻嘻小课堂」图标。

### 方式 B：解压静态包用任意静态服务

解压 `xixi-classroom-web-v0.2.zip` 后，用 Nginx / IIS / `npx serve` 托管根目录即可。

```powershell
cd "D:\aliyun ai\personal\kids-english-enlighten\release\web-dist"
npx --yes serve -p 4173
```

### 方式 C：开发态

```powershell
cd "D:\aliyun ai\personal\kids-english-enlighten\app"
npm run dev
```

## 若你要的是 APK（安卓安装包）

需要再包一层（如 Capacitor / PWABuilder）。说一声「要 APK」，我可以继续做安卓安装包。
