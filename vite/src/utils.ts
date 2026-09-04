// 公共小工具：很多模块都会用到，所以集中放在这里，别处 import 即可复用

export const $ = <T extends HTMLElement = HTMLElement>(id: string): T =>
  document.getElementById(id) as T;
// ↑ 定义 $ 函数：传入元素的 id（注意：不带 # 号），返回对应的 DOM 元素。
//   例如 $("btnHello") 就等价于 document.getElementById("btnHello")
//   （TypeScript 版：泛型 T 默认 HTMLElement，返回"非空"的该类型元素，
//     需要精确类型时可写 $<HTMLInputElement>("id") 这样的调用形式）

export const on = (
  id: string,
  event: string,
  fn: (...args: any[]) => void
): void => {
  $(id).addEventListener(event, fn);
};
// ↑ 定义 on 函数：给"某个 id 的元素"绑定"某个事件"，触发时执行 fn。
//   例如 on("btnDog", "click", getDog) = 点狗狗按钮时执行 getDog

export function makeButton(
  text: string,
  className: string,
  onClick?: () => void
): HTMLButtonElement {
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
export function debounce<A extends any[]>(
  fn: (...args: A) => void,
  delay: number
): (...args: A) => void {
  let timer: number | null = null;
  // ↑ 用外层变量记住"定时器"的编号（闭包：内层函数能访问它）
  return function (this: void, ...args: A): void {
    // ↑ 返回一个新函数，调用者绑定的就是这个新函数
    if (timer !== null) clearTimeout(timer);
    // ↑ 每次触发都先取消上一次的定时器，实现"重新计时"
    timer = setTimeout(() => fn.apply(this, args), delay);
    // ↑ 重新定一个闹钟：delay 毫秒后如果没再被取消，才真正执行 fn
  };
}

// 节流：固定间隔 delay 毫秒内，最多执行一次
export function throttle<A extends any[]>(
  fn: (...args: A) => void,
  delay: number
): (...args: A) => void {
  let last = 0;
  // ↑ 记录"上一次真正执行"的时间戳（闭包变量）
  return function (this: void, ...args: A): void {
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

// 弹系统通知：title 是标题，body 是正文
export function notify(title: string, body: string): void {
  // ↑ 判断：如果浏览器不支持通知，就退回 alert
  if (!("Notification" in window)) {
    alert(title + "：" + body);
    return;
    // ↑ 没这功能就走人，不往下执行
  }
  // ↑ 权限已经是"允许"，直接弹
  if (Notification.permission === "granted") {
    new Notification(title, { body });
    // ↑ 真正发出系统通知
  } else if (Notification.permission !== "denied") {
    // ↑ 还没问过（default），去申请权限
    Notification.requestPermission().then((perm) => {
      // ↑ 弹出"允许/阻止"确认框，拿到用户选择 perm
      if (perm === "granted") {
        // ↑ 用户点"允许"才发
        new Notification(title, { body });
      }
    });
  }
  // ↑ 被拒过（denied）就安静跳过
}

// ===== 第 30 关新增：通用存储 / 网络 / 输入工具 =====

// 从 localStorage 读一个值，自动 JSON 解析；键不存在或解析失败时返回兜底值
export function loadJSON<T = any>(key: string, fallback: T = null as any): any {
  const raw = localStorage.getItem(key);
  // ↑ 先原始读出来（可能是 null）
  if (raw === null) return fallback;
  // ↑ 没存过，直接用兜底值
  try {
    return JSON.parse(raw);
    // ↑ 把字符串还原成数组/对象/数字等
  } catch {
    return raw;
    // ↑ 解析失败：说明存的是"裸字符串"（不是 JSON），直接原样返回，兼容旧数据
  }
}

// 把一个值 JSON 序列化后写进 localStorage（数字/布尔/数组/对象都能存）
export function saveJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
  // ↑ JSON.stringify 把任意值转成字符串，再存
}

// 删除某个键（和上面两个凑成一套，语义更统一）
export function removeKey(key: string): void {
  localStorage.removeItem(key);
}

// 带超时的 fetch：请求 JSON，超过 timeout 毫秒自动中断
export async function fetchJSON(url: string, timeout = 5000): Promise<any> {
  const controller = new AbortController();
  // ↑ 造一个"中断器"
  const timer = setTimeout(() => controller.abort(), timeout);
  // ↑ 到点没完成就主动 abort
  try {
    const res = await fetch(url, { signal: controller.signal });
    // ↑ 请求，signal 让 abort() 能中断它
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // ↑ 响应不 ok（如 404），主动抛错
    return await res.json();
    // ↑ 解析并返回 JSON 结果
  } finally {
    clearTimeout(timer);
    // ↑ 无论成功失败，都要关掉那个超时闹钟
  }
}

// 回车提交：在某个输入框按 Enter 键，就执行 fn
export function onEnter(id: string, fn: () => void): void {
  on(id, "keydown", (e: KeyboardEvent) => {
    // ↑ 复用咱们自己的 on 绑定 keydown
    if (e.key === "Enter") fn();
    // ↑ 命中回车才执行
  });
}

// 输入校验：读输入框 → 按 tester 判断 → 自动挂"红框 + 禁用按钮"，返回是否合法
export function validateField(
  inputId: string,
  btnId: string,
  tester: (val: string) => boolean
): boolean {
  const val = $<HTMLInputElement>(inputId).value.trim();
  // ↑ 取输入并去首尾空格
  const ok = tester(val);
  // ↑ 用调用者传来的 tester 函数判断"合不合法"
  $(inputId).classList.toggle("invalid", !ok);
  // ↑ 不合法就加红框
  $<HTMLButtonElement>(btnId).disabled = !ok;
  // ↑ 不合法就禁用按钮
  return ok;
  // ↑ 返回结果供调用者判断
}

// lazyInit：传入一个"加载函数"，返回一个"启动函数"。
// 第一次调用"启动函数"才真正加载并初始化；之后再调用直接走缓存，绝不会重复下载、重复绑定。
export function lazyInit(
  loadFn: () => Promise<unknown>
): () => Promise<unknown> {
  let promise: Promise<unknown> | null = null;
  // ↑ 用外层变量缓存"加载+初始化"的 Promise（闭包：内部箭头函数能一直访问它）
  return (): Promise<unknown> => {
    // ↑ 返回一个"启动函数"，将来点按钮时就调它
    if (!promise) {
      // ↑ 第一次进来 promise 还是 null，说明从没加载过
      promise = loadFn();
      // ↑ 执行真正的加载（下载模块 + 初始化），把结果 Promise 存进缓存
    }
    // ↑ 第二次及以后进来，promise 已经存在，直接跳过 if，复用缓存
    return promise;
    // ↑ 把 Promise 返回给调用方，方便它 .then 等待加载完成
  };
}
