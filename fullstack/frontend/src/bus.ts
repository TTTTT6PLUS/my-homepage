// bus.ts —— 极简"事件总线"
// 用途：让互不相干的组件能互相喊话（原版靠全局 id 直接操作 DOM，
//       Vue 组件之间不方便这样搞，于是用一个小型发布/订阅代替）。
// 例如：App.vue 捕获键盘 Ctrl+Enter → 广播 "quick-add-todo" →
//       TodoBlock 组件收到后执行添加。

type Handler = (...args: unknown[]) => void;
// ↑ 事件处理函数类型：收任意参数、无返回值

const handlers = new Map<string, Handler[]>();
// ↑ 事件名 → 处理函数列表 的映射表

export function on(event: string, fn: Handler): void {
  // ↑ 订阅：组件挂载时调用，告诉总线"这个事件发生时叫我"
  const list = handlers.get(event) ?? [];
  // ↑ 取该事件现有的处理函数列表（没有则建空数组）
  list.push(fn);
  // ↑ 追加新处理函数
  handlers.set(event, list);
}

export function off(event: string, fn: Handler): void {
  // ↑ 退订：组件卸载时调用，防止内存泄漏
  const list = handlers.get(event);
  if (!list) return;
  handlers.set(
    event,
    list.filter((h) => h !== fn),
  );
  // ↑ 过滤掉要移除的函数
}

export function emit(event: string, ...args: unknown[]): void {
  // ↑ 广播：触发某个事件，把参数传给所有订阅者
  (handlers.get(event) ?? []).forEach((fn) => fn(...args));
  // ↑ 逐个调用（没有订阅者就什么都不做）
}
