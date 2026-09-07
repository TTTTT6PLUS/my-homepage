// 让 TypeScript 认识 .vue 文件：声明"所有 .vue 文件都是 Vue 组件"
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
