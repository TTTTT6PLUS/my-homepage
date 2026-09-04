// 窗口宽度显示：实时把浏览器窗口的宽度显示在页面上，并用节流优化性能

import { $, throttle } from "./utils.js";
// ↑ 引入 $（找元素）和 throttle（节流）两个工具

function updateWidth() {
  // ↑ 定义一个"更新宽度文字"的函数
  const el = $("winWidth") as HTMLElement;
  // ↑ $ 返回"元素或 null"，TS 严格模式下不允许直接对可能 null 的值操作
  //   用 as HTMLElement 断言：我确定这个元素一定存在（HTML 里写死了 id）
  el.innerText = `窗口宽度：${window.innerWidth}px`;
  // ↑ 把元素文字改成当前窗口宽度（window.innerWidth 即窗口像素宽）
}

export function initWin() {
  // ↑ 启动函数：main.js 会调用它

  updateWidth();
  // ↑ 页面加载时先显示一次，否则文字一直是占位的 --px
  window.addEventListener("resize", throttle(updateWidth, 200));
  // ↑ 监听窗口缩放（resize）事件；用 throttle 包一层，
  //   表示 200 毫秒内最多执行一次 updateWidth，避免拖拽时疯狂执行拖慢页面
}