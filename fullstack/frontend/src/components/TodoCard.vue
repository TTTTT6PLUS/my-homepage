<script setup lang="ts">
// TodoCard.vue —— 待办卡片
// 全链路演示：Vue 组件 → api.ts → fetch → Django API → SQLite
// 相比 localStorage 版：数据存在服务器数据库里，任何设备都能访问同一份。

import { ref, onMounted } from "vue";
// ↑ ref：响应式变量；onMounted：组件挂载到页面后自动执行的回调

import { todoApi } from "../api";
// ↑ 导入待办接口
import type { Todo } from "../api";
// ↑ 导入待办类型（纯类型导入）

const todos = ref<Todo[]>([]);
// ↑ 待办列表（初始空数组，onMounted 时从后端拉取）

const newTitle = ref("");
// ↑ 新增输入框的文字（v-model 双向绑定）

const loading = ref(false);
// ↑ 加载中标记：请求期间禁用按钮，防止重复点击

const errorMsg = ref("");
// ↑ 错误提示文字（请求失败时显示）

async function loadTodos(): Promise<void> {
  // ↑ 从后端拉取全部待办
  loading.value = true;
  // ↑ 打开加载中
  errorMsg.value = "";
  // ↑ 清空上次错误
  try {
    todos.value = await todoApi.list();
    // ↑ 调用 API，把返回的数组存进 todos
  } catch (err) {
    errorMsg.value = (err as Error).message;
    // ↑ 失败则显示错误信息（比如后端没启动）
  } finally {
    loading.value = false;
    // ↑ 无论成败都关闭加载中
  }
}

async function addTodo(): Promise<void> {
  // ↑ 新增一条待办
  const title = newTitle.value.trim();
  // ↑ 去首尾空格
  if (!title) return;
  // ↑ 空内容不提交
  await todoApi.create(title);
  // ↑ 调后端创建（真正存进 SQLite！）
  newTitle.value = "";
  // ↑ 清空输入框
  await loadTodos();
  // ↑ 重新拉取列表（让新数据显示出来）
}

async function toggleTodo(t: Todo): Promise<void> {
  // ↑ 切换完成状态
  await todoApi.toggle(t);
  // ↑ 通知后端把这条的 done 取反
  await loadTodos();
  // ↑ 刷新列表
}

async function removeTodo(id: number): Promise<void> {
  // ↑ 删除一条待办
  await todoApi.remove(id);
  // ↑ 通知后端删除
  await loadTodos();
  // ↑ 刷新列表
}

onMounted(loadTodos);
// ↑ 组件一出现在页面上就自动加载数据（页面刷新后数据不丢，因为存服务器）
</script>

<template>
  <!-- 待办卡片的外观 -->
  <section class="card">
    <h2>📝 待办清单 <span class="tag">存数据库</span></h2>

    <!-- 新增区：输入框 + 按钮 -->
    <div class="row">
      <input
        v-model="newTitle"
        placeholder="加一条待办，回车提交"
        @keyup.enter="addTodo"
        :disabled="loading"
      />
      <button @click="addTodo" :disabled="loading">添加</button>
    </div>

    <!-- 错误提示 -->
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-else-if="loading" class="hint">加载中...</p>

    <!-- 列表：v-for 循环渲染每条待办 -->
    <ul v-if="todos.length" class="list">
      <li v-for="t in todos" :key="t.id" :class="{ done: t.done }">
        <!-- 复选框：点击切换完成状态 -->
        <input type="checkbox" :checked="t.done" @change="toggleTodo(t)" />
        <span class="text" @click="toggleTodo(t)">{{ t.title }}</span>
        <!-- 删除按钮 -->
        <button class="del" @click="removeTodo(t.id)">删除</button>
      </li>
    </ul>
    <p v-else class="hint">还没有待办，添加一条吧~</p>
  </section>
</template>

<style scoped>
.card {
  border: 1px solid #c7d2fe;
  border-radius: 12px;
  padding: 16px 20px;
  background: #f8fafc;
  margin-bottom: 16px;
}
.tag {
  font-size: 12px;
  background: #4f46e5;
  color: #fff;
  padding: 2px 8px;
  border-radius: 999px;
  vertical-align: middle;
}
.row {
  display: flex;
  gap: 8px;
}
.row input {
  flex: 1;
  padding: 8px;
  border: 1px solid #c7d2fe;
  border-radius: 8px;
}
.row button {
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}
.list {
  list-style: none;
  padding: 0;
}
.list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed #e2e8f0;
}
.text {
  flex: 1;
  cursor: pointer;
}
.done .text {
  text-decoration: line-through;
  color: #94a3b8;
}
.del {
  background: #f43f5e;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}
.error {
  color: #dc2626;
  font-size: 13px;
}
.hint {
  color: #94a3b8;
  font-size: 13px;
}
</style>
