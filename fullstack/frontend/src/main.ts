// main.ts —— Vue 全栈版个人主页入口
import { createApp } from "vue";
// ↑ 创建 Vue 应用的工厂函数
import App from "./App.vue";
// ↑ 根组件（组装整个主页）
import "./style.css";
// ↑ 全局样式（复用原版 style.css：变量/布局/按钮/动画/暗色主题）

import reveal from "./directives/reveal";
// ↑ 滚动显现指令

const app = createApp(App);
// ↑ 创建应用实例
app.directive("reveal", reveal);
// ↑ 全局注册 v-reveal 指令（模板里 <div v-reveal> 即可用）
app.mount("#app");
// ↑ 挂载到 index.html 的 #app 元素
