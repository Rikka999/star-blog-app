import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // 确保别名配置正确
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,  // 设置端口为 3000
    open: true,   // 启动时自动打开浏览器
  },
})