// 小工具：缩短 getElementById 和事件绑定
const $ = (id) => document.getElementById(id);
const on = (id, event, fn) => $(id).addEventListener(event, fn);

// ---------- 状态 ----------
const quotes = [
  "摸鱼一时爽，一直摸鱼一直爽",
  "写代码累了，就喝口水歇一歇",
  "今天的你，也很棒哦",
  "白饭是世界上最美好的东西",
  "吃白饭的蓝色大肥鱼我爱你"
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isGreen = false;
let timerId = null;
let leftTime = 0;
let pool = [];
let secret = Math.floor(Math.random() * 100) + 1;
let guessCount = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;

// ---------- 通用：创建小按钮 ----------
function makeButton(text, className, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  btn.addEventListener("click", onClick);
  return btn;
}

// ---------- 待办清单 ----------
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTodo() {
  const task = $("todoInput").value.trim();
  if (!task) return;
  tasks.push({ text: task, done: false });
  $("todoInput").value = "";
  saveTasks();
  renderTodo();
}

function deleteTodo(i) {
  tasks.splice(i, 1);
  saveTasks();
  renderTodo();
}

function toggleDone(i) {
  tasks[i].done = !tasks[i].done;
  saveTasks();
  renderTodo();
}

function editTodo(i) {
  const newText = prompt("修改这条待办：", tasks[i].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[i].text = newText;
    saveTasks();
    renderTodo();
  }
}

function renderTodo() {
  const list = $("todoList");
  list.innerHTML = "";
  tasks.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = item.text;
    li.classList.toggle("todo-done", item.done);

    li.append(
      makeButton("完成", "btn-sm btn-done", () => toggleDone(i)),
      makeButton("删除", "btn-sm btn-del", () => deleteTodo(i)),
      makeButton("编辑", "btn-sm btn-edit", () => editTodo(i))
    );
    li.addEventListener("dblclick", () => toggleDone(i));
    list.appendChild(li);
  });
  updateCount();
}

function updateCount() {
  const active = tasks.filter((t) => !t.done).length;
  $("todoCount").innerText = `未完成：${active} 件`;
  updateProgress();
}

function updateProgress() {
  const done = tasks.reduce((acc, t) => acc + (t.done ? 1 : 0), 0);
  const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
  $("todoPercent").innerText = `完成率：${percent}%`;
  $("todoBar").style.width = percent + "%";
}

function clearDone() {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  renderTodo();
}

function completeAll() {
  tasks.forEach((t) => (t.done = true));
  saveTasks();
  renderTodo();
}

function exportTasks() {
  if (tasks.length === 0) {
    $("exportResult").innerText = "还没有待办哦";
    return;
  }
  $("exportResult").innerText = tasks
    .map((t) => (t.done ? "[✓] " : "[ ] ") + t.text)
    .join(" · ");
}

// ---------- 打招呼 / 名字 / 肤色 ----------
function sayHello() {
  alert("你好呀！欢迎来到我的主页~");
}

function changeName() {
  $("myName").innerText = "你好，我是TTTTT6！";
}

function changeColor() {
  isGreen = !isGreen;
  document.body.classList.toggle("green", isGreen);
}

function useInput() {
  const name = $("nameInput").value.trim();
  if (!name) return;
  $("myName").innerText = "你好，我是" + name;
  $("nameInput").value = "";
}

// ---------- 摸鱼语录 ----------
function randomQuote() {
  const i = Math.floor(Math.random() * quotes.length);
  $("quoteText").innerText = quotes[i];
}

// ---------- 倒计时器 ----------
function startTimer() {
  const seconds = Number($("timerInput").value);
  if (timerId !== null) clearInterval(timerId);

  if (isNaN(seconds) || seconds <= 0) {
    $("timerDisplay").innerText = "请输入一个正数";
    return;
  }

  leftTime = seconds;
  $("timerDisplay").innerText = leftTime + " 秒";
  timerId = setInterval(() => {
    leftTime--;
    $("timerDisplay").innerText = leftTime + " 秒";
    if (leftTime <= 0) {
      clearInterval(timerId);
      timerId = null;
      $("timerDisplay").innerText = "时间到！";
    }
  }, 1000);
}

function resetTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  leftTime = 0;
  $("timerDisplay").innerText = "0 秒";
  $("timerInput").value = "";
}

// ---------- 幸运抽签 ----------
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

// ---------- 随机狗狗 ----------
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

// ---------- GitHub 用户查询 ----------
async function searchUser() {
  const name = $("ghName").value.trim();
  if (!name) {
    $("ghResult").innerText = "先输入一个用户名";
    return;
  }
  $("ghResult").innerText = "查询中...";
  try {
    const res = await fetch(`https://api.github.com/users/${name}`);
    if (!res.ok) throw new Error("没找到");
    const data = await res.json();
    $("ghAvatar").src = data.avatar_url;
    $("ghAvatar").classList.remove("hidden");
    $("ghResult").innerText =
      `用户名：${data.login}，公开仓库：${data.public_repos} 个，粉丝：${data.followers} 人`;
  } catch (err) {
    $("ghResult").innerText = "没找到这个用户，检查名字~";
    $("ghAvatar").classList.add("hidden");
  }
}

// ---------- 猜数字 ----------
function guessNumber() {
  const guess = Number($("guessInput").value);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    $("guessResult").innerText = "请输入 1~100 之间的数字";
    return;
  }
  guessCount++;
  if (guess > secret) {
    $("guessResult").innerText = guess + " 太大了，再小一点~";
  } else if (guess < secret) {
    $("guessResult").innerText = guess + " 太小了，再大一点~";
  } else {
    $("guessResult").innerText = "猜对了！你用了 " + guessCount + " 次";
    if (bestScore === 0 || guessCount < bestScore) {
      bestScore = guessCount;
      localStorage.setItem("bestScore", guessCount);
    }
    $("bestScore").innerText = "最佳成绩：" + bestScore + " 次";
  }
  $("guessInput").value = "";
}

function restartGame() {
  secret = Math.floor(Math.random() * 100) + 1;
  guessCount = 0;
  $("guessResult").innerText = "";
  $("guessInput").value = "";
}

// ---------- 事件绑定 ----------
on("btnHello", "click", sayHello);
on("btnRename", "click", changeName);
on("btnSkin", "click", changeColor);
on("btnConfirmName", "click", useInput);
on("btnQuote", "click", randomQuote);
on("btnAddTodo", "click", addTodo);
on("btnCompleteAll", "click", completeAll);
on("btnClearDone", "click", clearDone);
on("btnExport", "click", exportTasks);
on("btnStartTimer", "click", startTimer);
on("btnResetTimer", "click", resetTimer);
on("btnAddName", "click", addName);
on("btnDraw", "click", startDraw);
on("btnDog", "click", getDog);
on("btnSearchUser", "click", searchUser);
on("btnGuess", "click", guessNumber);
on("btnRestart", "click", restartGame);
on("todoInput", "keydown", (e) => { if (e.key === "Enter") addTodo(); });
on("ghName", "keydown", (e) => { if (e.key === "Enter") searchUser(); });

// ---------- 初始化 ----------
renderTodo();
if (bestScore !== 0) {
  $("bestScore").innerText = "最佳成绩：" + bestScore + " 次";
}