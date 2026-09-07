// vite.config.ts —— Vite 构建配置
import { defineConfig } from "vite";
// ↑ 从 vite 导入配置助手（让编辑器有类型提示）
import vue from "@vitejs/plugin-vue";
// ↑ 导入 Vue 插件：让 Vite 能编译 .vue 文件

export default defineConfig({
  plugins: [vue()],
  // ↑ 启用 Vue 插件
  server: {
    port: 5174,
    // ↑ 用 5174 端口（5173 可能被 vue-lab 占用，错开避免打架）
  },
});
