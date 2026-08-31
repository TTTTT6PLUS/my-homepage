// 待办清单（To-Do List）：增删改查 + 筛选排序 + 进度条 + localStorage 持久化

import { $, on, makeButton } from "./utils.js";
// ↑ 引入 $、on、makeButton 三个工具

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// ↑ 从 localStorage 读回已存的任务数组；若是第一次（null），则用空数组 [] 兜底。
//   JSON.parse 是把存进去的字符串还原成数组
let filterMode = "all";
// ↑ 记录"当前筛选模式"：all 全部 / active 未完成 / done 已完成
let showActiveFirst = false;
// ↑ 记录"是否开启未完成优先排序"

let draggedIndex = null;
// ↑ 记录"正在拖动的那条任务"的真实下标；没在拖时是 null。
//   （用模块级变量，因为拖拽的每一步事件都要共享"谁在被拖"这份信息）

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  // ↑ 把 tasks 数组转成字符串，存进 localStorage（因为 storage 只能存字符串）
}

function getVisibleTasks() {
  // ↑ 计算出"当前应该显示的"任务列表（筛选 + 排序后）
  let list = tasks.filter((t) => {
    // ↑ filter 会遍历每个任务 t，返回一个新的数组
    if (filterMode === "active") return !t.done;  // 只看未完成
    if (filterMode === "done") return t.done;     // 只看已完成
    return true;                                  // 其余情况：全部保留
  });

  if (showActiveFirst) {
    // ↑ 如果开启了"未完成优先"
    list.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0));
    // ↑ sort 排序：未完成的(0)排在已完成(1)前面
  }
  return list;
  // ↑ 返回处理好的列表
}

function addTodo() {
  // ↑ 添加一条待办
  const task = $("todoInput").value.trim();
  // ↑ 拿到输入框内容并去首尾空格
  if (!task) return;
  // ↑ 空内容直接忽略
  tasks.push({ text: task, done: false });
  // ↑ 往数组尾部加一个任务对象 { 文字, 是否完成 }
  $("todoInput").value = "";
  // ↑ 清空输入框
  saveTasks();
  // ↑ 存盘
  renderTodo();
  // ↑ 重新渲染列表
}

function deleteTodo(i) {
  // ↑ 删除下标为 i 的任务
  tasks.splice(i, 1);
  // ↑ splice(i, 1) 表示从位置 i 删除 1 个元素
  saveTasks();
  renderTodo();
}

function toggleDone(i) {
  // ↑ 切换第 i 条任务的完成状态
  tasks[i].done = !tasks[i].done;
  // ↑ 取反：完成↔未完成
  saveTasks();
  renderTodo();
}

function editTodo(i) {
  // ↑ 编辑第 i 条任务
  const newText = prompt("修改这条待办：", tasks[i].text);
  // ↑ prompt 弹出一个带输入框的对话框，返回用户输入的文字（取消则返回 null）
  if (newText !== null && newText.trim() !== "") {
    // ↑ 用户没取消、且新文字非空，才更新
    tasks[i].text = newText;
    // ↑ 替换文字（注意：这里直接存原值，不去空格，简单起见）
    saveTasks();
    renderTodo();
  }
}

function renderTodo() {
  // ↑ 把 tasks 画到页面上（核心渲染函数）
  const list = $("todoList");
  list.innerHTML = "";
  // ↑ 先清空列表，避免重复添加

  getVisibleTasks().forEach((item) => {
    // ↑ 遍历"当前要显示"的每个任务
    const i = tasks.indexOf(item);
    // ↑ 找到这条任务在原数组里的真实下标（因为显示顺序可能被排序改变）
    const li = document.createElement("li");
    // ↑ 为每条任务新建一个 <li>
    li.draggable = true;   
    // ↑ 设置这一项可以被拖起来（HTML5 拖拽开关）
    li.dataset.index = i;
    // ↑ 把"真实下标"记录在 li 的自定义属性 data-index 上，供点击时取回
    li.textContent = item.text;
    // ↑ 显示任务文字
    li.classList.toggle("todo-done", item.done);
    // ↑ 如果已完成，就给 li 加 .todo-done 类（加删除线）
    li.append(
      makeButton("完成", "btn-sm btn-done"),
      makeButton("删除", "btn-sm btn-del"),
      makeButton("编辑", "btn-sm btn-edit")
    );
    // ↑ 用 makeButton 造三个小按钮，append 一次性塞进 li；
    //   注意这里不传第三个参数，所以不单独绑事件（交给事件委托统一处理）
    list.appendChild(li);
    // ↑ 把这条 li 放进列表
  });
  updateCount();
  // ↑ 刷新计数和进度条
}

function handleTodoClick(e) {
  // ↑ 事件委托：整个列表只绑一个点击监听，命中哪个小按钮就做对应操作
  const btn = e.target.closest("button");
  // ↑ e.target 是真正被点的元素；closest 向上找最近的 button
  if (!btn) return;
  // ↑ 点的不是按钮（是 li 文字），直接忽略

  const li = btn.closest("li");
  // ↑ 找到这个按钮所属的 li
  const i = Number(li.dataset.index);
  // ↑ 取回之前记录的真实下标（记得转成数字）

  if (btn.classList.contains("btn-done")) toggleDone(i);
  // ↑ 如果按钮带 btn-done 类 → 切换完成状态
  else if (btn.classList.contains("btn-del")) deleteTodo(i);
  // ↑ 如果带 btn-del 类 → 删除
  else if (btn.classList.contains("btn-edit")) editTodo(i);
  // ↑ 如果带 btn-edit 类 → 编辑
}

function handleTodoDblclick(e) {
  // ↑ 双击一条待办，也切换完成状态
  const li = e.target.closest("li");
  if (!li) return;
  toggleDone(Number(li.dataset.index));
}

function handleDragStart(e) {
  // ↑ 开始拖拽时触发：记下"拖的是哪一条"，给它加个半透明效果
  const li = e.target.closest("li");
  // ↑ 被拖的元素可能是 li 也可能是里面的小按钮，closest 统一找到所属的 li
  if (!li) return;
  draggedIndex = Number(li.dataset.index);
  // ↑ 读回真实下标，存进模块变量，后面 drop 时要用
  li.classList.add("dragging");
  // ↑ 加 .dragging 类 → CSS 把它变半透明，用户一眼看出拖的是谁
  e.dataTransfer.effectAllowed = "move";
  // ↑ 告诉系统这次操作是"移动"，鼠标会显示移动图标
}

function handleDragOver(e) {
  // ↑ 拖到别的条目上方时反复触发（高频事件）
  e.preventDefault();
  // ↑ 关键一步！浏览器默认"禁止把东西放下"，必须阻止这个默认行为，
  //   drop 事件才有机会触发
  const li = e.target.closest("li");
  if (!li) return;
  document.querySelectorAll("#todoList li").forEach((el) => el.classList.remove("drag-over"));
  // ↑ 先把所有条目的"即将放入"标记清掉，保证同一时刻只有一个高亮
  if (Number(li.dataset.index) !== draggedIndex) {
    // ↑ 只有悬停在自己以外的条目上，才给放入提示
    li.classList.add("drag-over");
    // ↑ 给目标条目加 .drag-over → 顶部画一条蓝线，示意"会落到这里"
  }
}

function handleDrop(e) {
  // ↑ 松手放下的瞬间触发：真正把任务从原位置挪到目标位置
  e.preventDefault();
  const li = e.target.closest("li");
  if (!li || draggedIndex === null) return;
  // ↑ 找不到目标、或压根没在拖，就啥也不做

  let targetIndex = Number(li.dataset.index);
  // ↑ 读出"要放到哪"，先记下目标下标

  const [moved] = tasks.splice(draggedIndex, 1);
  // ↑ splice(下标,1) 从原位删掉 1 个元素，并返回"被删元素组成的数组"；
  //   [moved] 用解构语法把数组里那一个元素取出来
  if (targetIndex > draggedIndex) targetIndex--;
  // ↑ 因为刚删掉一个，它后面的下标整体前移了一位，所以这里要减 1 校准
  tasks.splice(targetIndex, 0, moved);
  // ↑ 把 moved 插到目标位置；第二个参数 0 表示"只插入、不删除"

  draggedIndex = null;
  saveTasks();
  // ↑ 存盘，让新顺序刷新网页后也能保留
  renderTodo();
  // ↑ 按新顺序重新渲染
}

function handleDragEnd(e) {
  // ↑ 拖拽结束（无论有没有成功放下）都会触发，专门用来收尾清理
  document.querySelectorAll(".dragging, .drag-over").forEach((el) =>
    el.classList.remove("dragging", "drag-over")
  );
  // ↑ 把页面上所有拖拽相关样式一次性清掉
  draggedIndex = null;
  // ↑ 重置"谁在被拖"的记录
}

function updateCount() {
  // ↑ 更新"未完成几件"
  const active = tasks.filter((t) => !t.done).length;
  // ↑ 数一下还有多少未完成
  $("todoCount").innerText = `未完成：${active} 件`;
  updateProgress();
  // ↑ 顺便更新进度条
}

function updateProgress() {
  // ↑ 更新完成率和进度条
  const done = tasks.reduce((acc, t) => acc + (t.done ? 1 : 0), 0);
  // ↑ reduce 累加"已完成"的数量
  const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
  // ↑ 完成率 = 已完成 / 总数 * 100；任务为空时直接 0（避免除以 0）
  $("todoPercent").innerText = `完成率：${percent}%`;
  $("todoBar").style.width = percent + "%";
  // ↑ 把进度条内层的宽度设成对应百分比
}

function clearDone() {
  // ↑ 清除所有已完成的任务
  tasks = tasks.filter((t) => !t.done);
  // ↑ 只保留"未完成"的
  saveTasks();
  renderTodo();
}

function completeAll() {
  // ↑ 全部标记为完成
  tasks.forEach((t) => (t.done = true));
  // ↑ 每个任务的 done 都设为 true
  saveTasks();
  renderTodo();
}

function exportTasks() {
  // ↑ 把任务导出成一行文字
  if (tasks.length === 0) {
    $("exportResult").innerText = "还没有待办哦";
    return;
  }
  $("exportResult").innerText = tasks
    .map((t) => (t.done ? "[✓] " : "[ ] ") + t.text)
    // ↑ map 把每条任务变成 "[✓] 文字" 或 "[ ] 文字"
    .join(" · ");
  // ↑ join 用一个分隔符把数组连成一个字符串
}

function setFilter(mode) {
  // ↑ 切换筛选模式
  filterMode = mode;
  renderTodo();
}

function toggleSort() {
  // ↑ 切换"未完成优先"排序
  showActiveFirst = !showActiveFirst;
  renderTodo();
}

export function initTodo() {
  // ↑ 启动函数：main.js 会调用它

  on("btnAddTodo", "click", addTodo);
  on("btnCompleteAll", "click", completeAll);
  on("btnClearDone", "click", clearDone);
  on("btnExport", "click", exportTasks);
  on("todoInput", "keydown", (e) => { if (e.key === "Enter") addTodo(); });
  // ↑ 在待办输入框按回车，等价于点"添加"
  on("btnFilterAll", "click", () => setFilter("all"));
  on("btnFilterActive", "click", () => setFilter("active"));
  on("btnFilterDone", "click", () => setFilter("done"));
  on("btnSortActive", "click", toggleSort);
  on("todoList", "click", handleTodoClick);
  // ↑ 事件委托：列表上点任何按钮都由 handleTodoClick 统一分发
  on("todoList", "dblclick", handleTodoDblclick);
  // ↑ 双击列表项也切换完成状态

  on("todoList", "dragstart", handleDragStart);
  on("todoList", "dragover", handleDragOver);
  on("todoList", "drop", handleDrop);
  on("todoList", "dragend", handleDragEnd);
  // ↑ 拖拽四件套（开始→经过→放下→结束），都走事件委托绑到整个列表上

  renderTodo();
  // ↑ 首次渲染：把 localStorage 里读到的任务画出来
}