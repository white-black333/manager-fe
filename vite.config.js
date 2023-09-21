import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')//__dirname 的值是 vite.config.js 文件所在的目录
    }
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import '@/assets/style/base.scss';`
  //     }
  //   }
  // },
  server: {
    host: 'localhost',
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      }
    }
  },
  plugins: [vue()],
});
