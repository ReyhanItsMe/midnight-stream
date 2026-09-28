import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
    registerType: 'autoUpdate',
      devOptions: { enabled: false },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,ttf}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Midnight Stream',
        short_name: 'MidnightStream',
        description: 'Game Pixel Horror Story',
        theme_color: '#0b0b0d',
        background_color: '#0b0b0d',
        display: 'fullscreen',           // Menghilangkan status bar & address bar total
        orientation: 'landscape',        // Otomatis kunci orientasi Landscape
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0', // Membuka akses agar bisa dibaca dari loopback internal
    port: 5173,      // Mengunci port selalu di 5173
    strictPort: true // Kalau port 5173 sibuk, jangan auto ganti ke 5174 (biar ga meleset)
  }
});
