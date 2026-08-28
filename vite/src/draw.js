import { $, on } from "./utils.js";

let pool = [];

function renderPool() {
  const list = $("poolList");
  list.innerHTML = "";
  pool.forEach((n, i) => {
    const li = document.createElement("li");
    li.dataset.index = i;                        // 打标记：这条是第几个
    li.textContent = n;
    li.append(makeButton("删除", "btn-sm btn-del")); // 加删除按钮，不绑事件
    list.appendChild(li);
  });
}

function deleteName(i) {
  pool.splice(i, 1);
  renderPool();
}

function handlePoolClick(e) {
  const btn = e.target.closest("button");   // 点的是不是按钮
  if (!btn) return;
  const li = btn.closest("li");             // 属于哪一条
  const i = Number(li.dataset.index);       // 取回下标
  if (btn.classList.contains("btn-del")) deleteName(i);
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
  on("poolList", "click", handlePoolClick);   // ← 新增这一行
}