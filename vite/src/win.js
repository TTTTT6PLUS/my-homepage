import { $, throttle } from "./utils.js";

function updateWidth() {
  $("winWidth").innerText = `窗口宽度：${window.innerWidth}px`;
}

export function initWin() {
  updateWidth();                                        // 页面加载时先显示一次
  window.addEventListener("resize", throttle(updateWidth, 200));
}