// 随机狗狗：从互联网 API 抓一张狗图显示，带防连点、加载锁定、超时提示

import { $, on } from "./utils.js";

let loading = false;
// ↑ 开关：记录"现在是不是正在请求"，防止用户连点导致重复请求

async function getDog() {
  // ↑ async 函数：里面可以用 await 等待异步操作
  if (loading) return;
  // ↑ 正在请求中就直接返回，挡掉连点
  loading = true;
  // ↑ 标记为"请求中"

  const btn = $("btnDog");
  btn.disabled = true;
  // ↑ 禁用按钮
  btn.textContent = "加载中...";
  // ↑ 按钮文字改成"加载中"

  $("dogStatus").innerText = "加载中...";
  // ↑ 状态提示也改

  const controller = new AbortController();
  // ↑ 造一个"中断器"，可以手动喊停请求
  const timer = setTimeout(() => controller.abort(), 5000);
  // ↑ 定一个 5 秒闹钟，超时就调用 abort() 主动中断请求

  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random", {
      signal: controller.signal,
      // ↑ 把中断信号交给 fetch，这样 abort() 才能中断它
    });
    // ↑ await 等待请求完成，res 是响应对象
    const data = await res.json();
    // ↑ 把响应体解析成 JSON 对象（里面有图片地址 data.message）
    $("dogImg").src = data.message;
    // ↑ 把图片地址设给 img 元素
    $("dogImg").classList.remove("hidden");
    // ↑ 去掉 hidden 类，让图片显示出来
    $("dogStatus").innerText = "这就是你的狗狗！";
  } catch (err) {
    // ↑ 出错（超时或断网）会跳到这里
    $("dogStatus").innerText =
      err.name === "AbortError" ? "网络太慢，稍后再试~" : "抓狗失败，检查网络~";
    // ↑ 区分：超时的错误名是 AbortError，其它则是普通失败
  } finally {
    // ↑ finally 无论成功失败都会执行，用来做"收尾清理"
    clearTimeout(timer);
    // ↑ 取消那个 5 秒闹钟
    btn.disabled = false;
    // ↑ 恢复按钮可用
    btn.textContent = "来一只狗狗";
    // ↑ 恢复按钮文字
    loading = false;
    // ↑ 关闭"请求中"开关
  }
}

export function initDog() {
  on("btnDog", "click", getDog);
  // ↑ 绑定：点按钮 → 抓狗
}