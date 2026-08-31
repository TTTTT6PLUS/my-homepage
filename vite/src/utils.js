// 公共小工具：很多模块都会用到，所以集中放在这里，别处 import 即可复用

export const $ = (id) => document.getElementById(id);
// ↑ 定义 $ 函数：传入元素的 id（注意：不带 # 号），返回对应的 DOM 元素。
//   例如 $("btnHello") 就等价于 document.getElementById("btnHello")

export const on = (id, event, fn) => $(id).addEventListener(event, fn);
// ↑ 定义 on 函数：给"某个 id 的元素"绑定"某个事件"，触发时执行 fn。
//   例如 on("btnDog", "click", getDog) = 点狗狗按钮时执行 getDog

export function makeButton(text, className, onClick) {
  // ↑ 定义 makeButton 函数：动态创建一个按钮，返回它
  const btn = document.createElement("button");
  // ↑ 新建一个 <button> 元素
  btn.textContent = text;
  // ↑ 设置按钮上显示的文字
  btn.className = className;
  // ↑ 设置按钮的 CSS 类名（决定它的样式，如 btn-sm btn-del）
  if (onClick) btn.addEventListener("click", onClick);
  // ↑ 如果传了第三个参数 onClick，才给它绑定点击事件
  return btn;
  // ↑ 把做好的按钮返回给调用者
}

// 防抖：连续触发时，等"停顿" delay 毫秒后才真正执行一次
export function debounce(fn, delay) {
  let timer = null;
  // ↑ 用外层变量记住"定时器"的编号（闭包：内层函数能访问它）
  return function (...args) {
    // ↑ 返回一个新函数，调用者绑定的就是这个新函数
    clearTimeout(timer);
    // ↑ 每次触发都先取消上一次的定时器，实现"重新计时"
    timer = setTimeout(() => fn.apply(this, args), delay);
    // ↑ 重新定一个闹钟：delay 毫秒后如果没再被取消，才真正执行 fn
  };
}

// 节流：固定间隔 delay 毫秒内，最多执行一次
export function throttle(fn, delay) {
  let last = 0;
  // ↑ 记录"上一次真正执行"的时间戳（闭包变量）
  return function (...args) {
    const now = Date.now();
    // ↑ 拿到"现在"的时间戳
    if (now - last >= delay) {
      // ↑ 距离上次执行已经超过 delay 毫秒，才放行
      last = now;
      // ↑ 更新"上次执行时间"为现在
      fn.apply(this, args);
      // ↑ 真正执行原函数
    }
  };
}