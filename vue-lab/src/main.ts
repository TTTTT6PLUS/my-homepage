// main.ts —— Vue 应用的"总入口"（整个应用从这里启动）
// 作用：创建 Vue 应用，挂载到 index.html 里的 #app 元素上

import { createApp } from "vue";
// ↑ 从 vue 框架导入 createApp
//   createApp 是"造 Vue 应用"的工厂函数：调用它就能得到一个应用实例

import App from "./App.vue";
// ↑ 导入根组件 App.vue（整个页面的"总设计师"）
//   注意：.vue 文件不是普通 JS，必须靠 @vitejs/plugin-vue 才能被识别和导入

import "./style.css";
// ↑ 引入全局样式文件（对所有组件生效，因为没加 scoped）

createApp(App).mount("#app");
// ↑ createApp(App)：用 App 组件创建一个 Vue 应用
//   .mount("#app")：把应用"安装"到 index.html 里 <div id="app"> 这个位置
//   从这一行起，页面内容就完全交给 Vue 管理了
