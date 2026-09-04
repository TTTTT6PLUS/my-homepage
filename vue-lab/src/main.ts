// main.ts —— Vue 应用的"总入口"
// 作用：创建 Vue 应用，挂载到 index.html 里的 #app 元素上

import { createApp } from "vue";
// ↑ 从 vue 导入 createApp：造一个"Vue 应用"的工厂函数

import App from "./App.vue";
// ↑ 导入根组件 App.vue（整个页面的"总设计师"）
//   注意：.vue 文件不是普通 JS，得靠 @vitejs/plugin-vue 才能被识别导入

import "./style.css";
// ↑ 引入全局样式

createApp(App).mount("#app");
// ↑ 创建以 App 为根的应用，并把它渲染(mount)到 <div id="app"> 里
//   从此刻起，页面上的内容就全由 Vue 接管了
