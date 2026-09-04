import { defineConfig } from "vite";
// ↑ 引入 Vite 的配置助手
import vue from "@vitejs/plugin-vue";
// ↑ 引入 Vue 插件：它负责把 .vue 文件"翻译"成浏览器能懂的 JS

export default defineConfig({
  plugins: [vue()],
  // ↑ 告诉 Vite："遇到 .vue 文件就交给 Vue 插件处理"
});
