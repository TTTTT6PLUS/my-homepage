import { $, on, makeButton, loadJSON, saveJSON } from "./utils.js";
// ↑ 引入 $、on、makeButton 三个工具

const KEY = "pool";

let pool = loadJSON(KEY, []);
// ↑ 从 localStorage 读回名单数组；第一次没存过则为空数组 [] 兜底

function savePool() {
  saveJSON(KEY, pool);
}

function renderPool() {
  // ↑ 把名单画到页面上
  const list = $("poolList");
  list.innerHTML = "";
  // ↑ 先清空，避免重复

  pool.forEach((n, i) => {
    // ↑ 遍历名单，n 是名字，i 是下标
    const li = document.createElement("li");
    // ↑ 为每个名字建一个 <li>
    li.dataset.index = i;
    // ↑ 把下标记录在 data-index 上，删除时能取回来
    li.textContent = n;
    // ↑ 显示名字
    li.append(makeButton("删除", "btn-sm btn-del"));
    // ↑ 造一个"删除"小按钮塞进去（不绑事件，交给事件委托）
    list.appendChild(li);
    // ↑ 放进列表
  });
}

function deleteName(i) {
  // ↑ 删除下标为 i 的名字
  pool.splice(i, 1);
  // ↑ 从数组里移除这一项
  savePool();
  // ↑ 存盘
  renderPool();
  // ↑ 重新渲染
}

function handlePoolClick(e) {
  // ↑ 事件委托：整个名单只绑一个点击监听
  const btn = e.target.closest("button");
  // ↑ 找到被点的按钮
  if (!btn) return;
  // ↑ 点的不是按钮就忽略

  const li = btn.closest("li");
  // ↑ 找到这个按钮所在的 li
  const i = Number(li.dataset.index);
  // ↑ 取回之前记录的下标

  if (btn.classList.contains("btn-del")) deleteName(i);
  // ↑ 如果是"删除"按钮，就删除对应名字
}

function addName() {
  // ↑ 点"加入名单"时执行
  const name = $("namePool").value.trim();
  if (!name) return;
  // ↑ 空输入直接忽略
  pool.push(name);
  // ↑ 把名字加进数组尾部
  $("namePool").value = "";
  // ↑ 清空输入框
  savePool();
  renderPool();
}

function startDraw() {
  // ↑ 点"开始抽签"时执行
  if (pool.length === 0) {
    // ↑ 名单是空的情况
    $("drawResult").innerText = "名单是空的，先加几个人吧";
    return;
  }
  $("drawResult").innerText = "抽签中...";
  setTimeout(() => {
    // ↑ 延迟 2000 毫秒（2 秒）后执行，模拟"抽签过程"
    const i = Math.floor(Math.random() * pool.length);
    // ↑ 随机取一个合法下标
    $("drawResult").innerText = "恭喜 🎉 " + pool[i] + " 中奖！";
    // ↑ 宣布中奖者
  }, 2000);
}

export function initDraw() {
  on("btnAddName", "click", addName);
  on("btnDraw", "click", startDraw);
  on("poolList", "click", handlePoolClick);
  // ↑ 事件委托：处理名单里的删除按钮
  renderPool();
  // ↑ 首次渲染：把 localStorage 里读到的名字画出来
}