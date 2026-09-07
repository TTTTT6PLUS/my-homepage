// main.ts —— 前端应用入口
import { createApp } from "vue";
// ↑ 从 vue 导入 createApp（创建应用的工厂函数）
import App from "./App.vue";
// ↑ 导入根组件（页面总设计师）
import "./style.css";
// ↑ 引入全局样式

createApp(App).mount("#app");
// ↑ 创建应用并挂载到 index.html 的 #app 元素
