// 滚动显现：用 IntersectionObserver 盯着每个功能块，滚进视口才淡入上移

export function initReveal() {
  const blocks = document.querySelectorAll(".block");
  // ↑ 用 querySelectorAll 选出所有 .block 功能块（注意：这不是 $，
  //   $ 只能按 id 选一个，这里要选"一批"，所以用 querySelectorAll）

  if (!("IntersectionObserver" in window)) {
    // ↑ 特性检测：浏览器不支持 IntersectionObserver 时（很老的环境）
    blocks.forEach((b) => b.classList.add("show"));
    // ↑ 直接给全部块加 .show，保证内容照常显示，不让它"永远透明"
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    // ↑ 创建监视器；entries 是"交叉情况发生变化"的那批元素
    entries.forEach((entry) => {
      // ↑ 逐个处理
      if (entry.isIntersecting) {
        // ↑ 这个元素滚进视口了
        entry.target.classList.add("show");
        // ↑ 加 .show 触发淡入动画
        observer.unobserve(entry.target);
        // ↑ 显现一次后就不再盯它，节省性能、避免反复触发
      }
    });
  });

  blocks.forEach((b) => observer.observe(b));
  // ↑ 让监视器开始盯着每一个功能块
}