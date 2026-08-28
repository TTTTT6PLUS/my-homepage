import { $, on, makeButton } from "./utils.js";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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

export function initTodo() {
  on("btnAddTodo", "click", addTodo);
  on("btnCompleteAll", "click", completeAll);
  on("btnClearDone", "click", clearDone);
  on("btnExport", "click", exportTasks);
  on("todoInput", "keydown", (e) => { if (e.key === "Enter") addTodo(); });
  renderTodo();
}