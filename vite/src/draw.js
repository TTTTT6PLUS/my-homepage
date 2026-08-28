import { $, on } from "./utils.js";

let pool = [];

function renderPool() {
  const list = $("poolList");
  list.innerHTML = "";
  pool.forEach((n) => {
    const li = document.createElement("li");
    li.textContent = n;
    list.appendChild(li);
  });
}

function addName() {
  const name = $("namePool").value.trim();
  if (!name) return;
  pool.push(name);
  $("namePool").value = "";
  renderPool();
}

function startDraw() {
  if (pool.length === 0) {
    $("drawResult").innerText = "名单是空的，先加几个人吧";
    return;
  }
  $("drawResult").innerText = "抽签中...";
  setTimeout(() => {
    const i = Math.floor(Math.random() * pool.length);
    $("drawResult").innerText = "恭喜 🎉 " + pool[i] + " 中奖！";
  }, 2000);
}

export function initDraw() {
  on("btnAddName", "click", addName);
  on("btnDraw", "click", startDraw);
}