import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Capacitor / 原生 WebView 需要相对路径
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '嘻嘻小课堂',
        short_name: '嘻嘻小课堂',
        description: '英语启蒙内容导航与个人资源播放',
        theme_color: '#3cb89a',
        background_color: '#fff8ee',
        display: 'standalone',
        lang: 'zh-CN',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
