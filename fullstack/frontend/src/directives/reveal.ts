// reveal.ts —— 全局自定义指令 v-reveal（移植原 reveal.ts 的滚动显现）
// Vue 里"指令" = 一种给元素附加行为的特殊语法，用 v-名字 使用。
// 这里实现：元素一进入视口就加 .show 类，触发淡入上移动画（原 CSS .block 默认透明）。

import type { Directive } from "vue";
// ↑ 导入 Vue 的指令类型（让 v-reveal 有类型提示）

const reveal: Directive<HTMLElement> = {
  // ↑ 定义一个指令对象，作用于 HTMLElement
  mounted(el) {
    // ↑ mounted：元素被挂载到页面后执行（el 是这个元素）
    if (!("IntersectionObserver" in window)) {
      // ↑ 老浏览器不支持 IntersectionObserver
      el.classList.add("show");
      // ↑ 直接显示，不让内容永远透明
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      // ↑ 创建交叉观察器
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // ↑ 该元素滚进视口
          el.classList.add("show");
          // ↑ 加 .show 触发动画
          observer.unobserve(el);
          // ↑ 显现一次后停止观察（省性能）
        }
      });
    });
    observer.observe(el);
    // ↑ 开始观察这个元素
  },
};

export default reveal;
// ↑ 导出指令，供 main.ts 注册为全局 v-reveal
