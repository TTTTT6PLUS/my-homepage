// 公共小工具：各功能模块都会用到，统一从这里 import
export const $ = (id) => document.getElementById(id);
export const on = (id, event, fn) => $(id).addEventListener(event, fn);

export function makeButton(text, className, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  btn.addEventListener("click", onClick);
  return btn;
}