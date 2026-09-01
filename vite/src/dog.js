// 随机狗狗：从互联网 API 抓一张狗图显示，带防连点、加载锁定、超时提示

import { $, on, fetchJSON } from "./utils.js";

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

  try {
    const data = await fetchJSON("https://dog.ceo/api/breeds/image/random");
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