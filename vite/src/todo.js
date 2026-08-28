import { $, on, makeButton } from "./utils.js";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// 新增两个状态变量，记住"现在筛什么、要不要排序"
let filterMode = "all";        // "all"全部 | "active"未完成 | "done"已完成
let showActiveFirst = false;   // true = 未完成的排前面

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getVisibleTasks() {
  // 1. 先按筛选模式过滤
  let list = tasks.filter((t) => {
    if (filterMode === "active") return !t.done;  // 只看未完成
    if (filterMode === "done") return t.done;     // 只看已完成
    return true;                                  // 其余情况：全部保留
  });

  // 2. 如果需要，再把未完成的排到前面
  if (showActiveFirst) {
    list.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0));
  }
  return list;
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
  getVisibleTasks().forEach((item) => {
    const i = tasks.indexOf(item);
    const li = document.createElement("li");
    li.dataset.index = i;              // ① 把"真实下标"刻在 li 身上
    li.textContent = item.text;
    li.classList.toggle("todo-done", item.done);
    li.append(
      makeButton("完成", "btn-sm btn-done"),   // ② 不再传第三个参数 → 不绑事件
      makeButton("删除", "btn-sm btn-del"),
      makeButton("编辑", "btn-sm btn-edit")
    );
    list.appendChild(li);
  });
  updateCount();
}

function handleTodoClick(e) {
  const btn = e.target.closest("button");   // 被点的到底是不是按钮？
  if (!btn) return;                          // 点的是 li 文字 → 不是按钮，忽略

  const li = btn.closest("li");              // 这个按钮属于哪一条任务
  const i = Number(li.dataset.index);        // 取回这条任务在 tasks 里的真实下标

  if (btn.classList.contains("btn-done")) toggleDone(i);
  else if (btn.classList.contains("btn-del")) deleteTodo(i);
  else if (btn.classList.contains("btn-edit")) editTodo(i);
}

function handleTodoDblclick(e) {
  const li = e.target.closest("li");         // 双击的是哪一条
  if (!li) return;
  toggleDone(Number(li.dataset.index));      // 双击 = 切换完成状态
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

function setFilter(mode) {
  filterMode = mode;      // 更新"筛选状态"
  renderTodo();           // 重新画一遍列表
}

function toggleSort() {
  showActiveFirst = !showActiveFirst;  // 翻转"排序"开关
  renderTodo();
}

export function initTodo() {
  on("btnAddTodo", "click", addTodo);
  on("btnCompleteAll", "click", completeAll);
  on("btnClearDone", "click", clearDone);
  on("btnExport", "click", exportTasks);
  on("todoInput", "keydown", (e) => { if (e.key === "Enter") addTodo(); });
  on("btnFilterAll", "click", () => setFilter("all"));
  on("btnFilterActive", "click", () => setFilter("active"));
  on("btnFilterDone", "click", () => setFilter("done"));
  on("btnSortActive", "click", toggleSort);
  on("todoList", "click", handleTodoClick);
  on("todoList", "dblclick", handleTodoDblclick);
  renderTodo();
}