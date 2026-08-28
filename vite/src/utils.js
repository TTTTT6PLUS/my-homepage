// 公共小工具：各功能模块都会用到，统一从这里 import
export const $ = (id) => document.getElementById(id);
export const on = (id, event, fn) => $(id).addEventListener(event, fn);

export function makeButton(text, className, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  if (onClick) btn.addEventListener("click", onClick);   // 有传 onClick 才绑
  return btn;
}

// 防抖：连续触发时，等"停顿" delay 毫秒后才真正执行一次
export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流：固定间隔 delay 毫秒内，最多执行一次
export function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}