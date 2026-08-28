import { $, on } from "./utils.js";

let loading = false;   // 新增：记录"现在是不是正在请求"

async function getDog() {
  if (loading) return;
  loading = true;

  const btn = $("btnDog");
  btn.disabled = true;
  btn.textContent = "加载中...";

  $("dogStatus").innerText = "加载中...";

  // 【新增】造一个"中断器"，并定一个 5 秒的闹钟
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000); // 5 秒后自动"喊停"

  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random", {
      signal: controller.signal,   // 【新增】把中断信号交给 fetch
    });
    const data = await res.json();
    $("dogImg").src = data.message;
    $("dogImg").classList.remove("hidden");
    $("dogStatus").innerText = "这就是你的狗狗！";
  } catch (err) {
    // 【改动】区分是"超时"还是"别的错"
    $("dogStatus").innerText =
      err.name === "AbortError" ? "网络太慢，稍后再试~" : "抓狗失败，检查网络~";
  } finally {
    clearTimeout(timer);   // 【新增】不管成败，先取消那个5秒闹钟
    btn.disabled = false;
    btn.textContent = "来一只狗狗";
    loading = false;
  }
}
export function initDog() {
  on("btnDog", "click", getDog);
}