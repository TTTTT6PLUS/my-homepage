<script setup lang="ts">
// TodoPanel.vue —— 待办清单（对应原 todo.ts）
// 原版用 localStorage 存 tasks；现在增删改全部走 Django /api/todos/，数据入 SQLite。

import { ref, computed, onMounted, onUnmounted, watch } from "vue";
// ↑ ref 响应式；computed 自动计算；onMounted 挂载回调；watch 监视

import { todoApi } from "../api";
// ↑ 待办接口
import type { Todo } from "../api";
// ↑ 待办类型
import { on, off } from "../bus";
// ↑ 事件总线（接收 App.vue 发来的 Ctrl+Enter 快速添加指令）

const tasks = ref<Todo[]>([]);
// ↑ 待办数组（从后端拉取）

const input = ref("");
// ↑ 输入框内容

const filter = ref<"all" | "active" | "done">("all");
// ↑ 筛选状态：全部/未完成/已完成

const sortActiveFirst = ref(false);
// ↑ 是否"未完成优先"

const errorMsg = ref("");
// ↑ 错误信息

// ---- 计算属性：可见任务（筛选 + 排序后的结果）----
const visible = computed<Todo[]>(() => {
  let list = tasks.value.filter((t) => {
    if (filter.value === "active") return !t.done;
    if (filter.value === "done") return t.done;
    return true;
  });
  // ↑ 按筛选条件过滤
  if (sortActiveFirst.value) {
    list = [...list].sort((a, b) => Number(a.done) - Number(b.done));
    // ↑ 未完成(false=0)排前面
  }
  return list;
});

// ---- 计算属性：完成统计（进度条 + 环形图用）----
const total = computed(() => tasks.value.length);
const doneCount = computed(() => tasks.value.filter((t) => t.done).length);
const percent = computed(() =>
  total.value === 0 ? 0 : Math.round((doneCount.value / total.value) * 100),
);
// ↑ 完成百分比 0~100
const ringOffset = computed(() => 326.7 * (1 - percent.value / 100));
// ↑ 环形图"隐藏弧长"：周长约 326.7，弧长按百分比露出

// ---- 拉取列表 ----
async function load(): Promise<void> {
  try {
    tasks.value = await todoApi.list();
    // ↑ GET /todos/
  } catch (err) {
    errorMsg.value = (err as Error).message;
  }
}

// ---- 添加 ----
async function addTodo(): Promise<void> {
  const title = input.value.trim();
  if (!title) return;
  await todoApi.create(title);
  input.value = "";
  await load();
}

// ---- 切换完成 / 删除 / 编辑 ----
async function toggleTodo(t: Todo): Promise<void> {
  await todoApi.update({ ...t, done: !t.done });
  await load();
}

async function removeTodo(t: Todo): Promise<void> {
  await todoApi.remove(t.id);
  await load();
}

async function editTodo(t: Todo): Promise<void> {
  const txt = prompt("修改这条待办：", t.title);
  if (txt && txt.trim()) {
    await todoApi.update({ ...t, title: txt.trim() });
    await load();
  }
}

// ---- 批量操作 ----
async function completeAll(): Promise<void> {
  for (const t of tasks.value) if (!t.done) await toggleTodo(t);
}

async function clearDone(): Promise<void> {
  for (const t of tasks.value) if (t.done) await removeTodo(t);
}

// ---- 快捷键联动：Ctrl+Enter 快速添加 ----
function onQuickAdd(): void {
  addTodo();
}

onMounted(async () => {
  await load();
  on("quick-add-todo", onQuickAdd);
  // ↑ 订阅总线事件
});
onUnmounted(() => off("quick-add-todo", onQuickAdd));
// ↑ 卸载时退订
</script>

<template>
  <h2>待办清单</h2>
  <p v-if="errorMsg" class="err">{{ errorMsg }}</p>

  <div class="todo-row">
    <input
      v-model="input"
      id="todoInput"
      type="text"
      placeholder="输入要做的事"
      @keyup.enter="addTodo"
    />
    <button id="btnAddTodo" @click="addTodo">添加</button>
    <button id="btnCompleteAll" @click="completeAll">全部完成</button>
    <button id="btnClearDone" @click="clearDone">清除已完成</button>
  </div>

  <!-- 筛选 + 排序按钮 -->
  <div class="todo-row">
    <button id="btnFilterAll" @click="filter = 'all'">全部</button>
    <button id="btnFilterActive" @click="filter = 'active'">未完成</button>
    <button id="btnFilterDone" @click="filter = 'done'">已完成</button>
    <button id="btnSortActive" @click="sortActiveFirst = !sortActiveFirst">
      {{ sortActiveFirst ? "取消优先" : "未完成优先" }}
    </button>
  </div>

  <p class="count">未完成：{{ total - doneCount }} 件</p>

  <!-- 进度条 -->
  <div class="progress">
    <div :style="{ width: percent + '%' }"></div>
  </div>

  <!-- 完成率环形图 -->
  <div class="ring-wrap">
    <svg class="ring" viewBox="0 0 120 120">
      <circle class="ring-bg" cx="60" cy="60" r="52"></circle>
      <circle
        class="ring-fg"
        cx="60"
        cy="60"
        r="52"
        :style="{ strokeDashoffset: ringOffset }"
      ></circle>
    </svg>
    <span class="ring-label">{{ percent }}%</span>
  </div>

  <!-- 列表（带小按钮） -->
  <ul id="todoList">
    <li v-for="item in visible" :key="item.id" :class="{ 'todo-done': item.done }">
      <span class="t-text">{{ item.title }}</span>
      <button class="btn-sm btn-done" @click="toggleTodo(item)">
        {{ item.done ? "恢复" : "完成" }}
      </button>
      <button class="btn-sm btn-del" @click="removeTodo(item)">删除</button>
      <button class="btn-sm btn-edit" @click="editTodo(item)">编辑</button>
    </li>
  </ul>
  <p v-if="visible.length === 0" class="empty">（这里空空如也~）</p>
</template>

<style scoped>
.todo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin: 6px 0;
}
.count {
  color: var(--text);
  font-size: 14px;
}
.err {
  color: var(--red);
  font-size: 13px;
}
.empty {
  color: var(--text);
  font-size: 13px;
  opacity: 0.6;
}
#todoList li {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.t-text {
  flex: 1;
  min-width: 120px;
}
</style>
