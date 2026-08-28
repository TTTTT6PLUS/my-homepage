import { $, on } from "./utils.js";

async function getDog() {
  $("dogStatus").innerText = "加载中...";
  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await res.json();
    $("dogImg").src = data.message;
    $("dogImg").classList.remove("hidden");
    $("dogStatus").innerText = "这就是你的狗狗！";
  } catch (err) {
    $("dogStatus").innerText = "抓狗失败，检查网络~";
  }
}

export function initDog() {
  on("btnDog", "click", getDog);
}