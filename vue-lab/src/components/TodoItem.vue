<script setup lang="ts">
// ===== TodoItem.vue（子组件：单条任务的"显示工人"）=====
// 原则：子组件不直接改数据，只"报告"发生了什么，让父组件决定怎么改
// 这叫"单向数据流"：数据往下传（props），事件往上喊（emit）

// 声明这条任务长什么样（和手写版 todo.ts 里的 Task 类型一样）
export interface Task {
  // ↑ export：把这个类型导出，让父组件也能 import 复用
  text: string;
  // ↑ 任务文字（类型 string）
  done: boolean;
  // ↑ 是否完成（类型 boolean）
}

// defineProps：声明这个组件"接收哪些参数"（父组件传进来的）
const props = defineProps<{
  // ↑ 泛型写法：描述 props 的形状
  task: Task;
  // ↑ 这条任务本身（对象）
  index: number;
  // ↑ 它在父组件数组里的位置（第几条）
}>();

// defineEmits：声明本组件能向外发送的事件（子 → 父 的"喊话通道"）
const emit = defineEmits<{
  // ↑ 泛型写法：列出所有允许发出的事件
  (e: "toggle", index: number): void;
  // ↑ 事件1："toggle"（切换完成），附带参数 index（第几条）
  (e: "remove", index: number): void;
  // ↑ 事件2："remove"（删除），附带参数 index（第几条）
}>();

function onToggle(): void {
  // ↑ 处理"用户点了复选框/文字"的函数
  emit("toggle", props.index);
  // ↑ 发出 toggle 事件，把"第几条被点了"告诉父组件
  //   注意：不自己改 task.done！等父组件来改（单向数据流）
}

function onRemove(): void {
  // ↑ 处理"用户点了删除按钮"的函数
  emit("remove", props.index);
  // ↑ 发出 remove 事件，把"第几条要删"告诉父组件
}
</script>

<template>
  <!-- 一条任务的"长相"。
       :class 里根据 done 动态加"完成"样式（对象写法：键是类名，值是布尔） -->
  <li class="todo-item" :class="{ done: task.done }">
    <!-- ↑ 列表项容器
         class="todo-item"：基础样式
         :class="{ done: task.done }"：task.done 为 true 时就多加一个 done 类 -->

    <!-- 复选框：勾选状态和 task.done 双向一致，勾选/取消时触发 onToggle -->
    <input type="checkbox" :checked="task.done" @change="onToggle" />
    <!-- ↑ type="checkbox"：这是一个复选框
         :checked="task.done"：是否打勾由 task.done 决定（单向显示）
         @change="onToggle"：勾选状态变化时执行 onToggle -->

    <!-- 任务文字：点它也能切换（更顺手） -->
    <span class="todo-text" @click="onToggle">{{ task.text }}</span>
    <!-- ↑ class="todo-text"：文字样式
         @click="onToggle"：点击文字也执行 onToggle（方便用户）
         {{ task.text }}：显示任务文字 -->

    <!-- 删除按钮 -->
    <button class="del" @click="onRemove">删除</button>
    <!-- ↑ class="del"：删除按钮样式
         @click="onRemove"：点击执行 onRemove -->
  </li>
</template>

<style scoped>
/* scoped：样式只作用于本组件 */
.todo-item {
  /* ↑ 每一条任务的容器样式 */
  display: flex; /* 弹性布局：复选框/文字/按钮排成一行 */
  align-items: center; /* 垂直居中 */
  gap: 10px; /* 子元素间距 10px */
  padding: 8px 4px; /* 上下8 左右4 的内边距 */
  border-bottom: 1px dashed #c7d2fe; /* 底部淡紫虚线分隔线 */
}
/* done 类加在 li 上时，文字变灰加删除线 */
.todo-text {
  /* ↑ 任务文字的样式 */
  flex: 1; /* 占据剩余宽度（把删除按钮挤到最右） */
  cursor: pointer; /* 鼠标变小手（提示可点击） */
}
.done .todo-text {
  /* ↑ 当 li 有 done 类时，里面的文字样式 */
  text-decoration: line-through; /* 加删除线（划掉） */
  color: #94a3b8; /* 变灰色 */
}
.del {
  /* ↑ 删除按钮的样式 */
  background: #f43f5e; /* 玫红色背景 */
  border: none; /* 去掉默认边框 */
  color: white; /* 白字 */
  border-radius: 6px; /* 小圆角 */
  padding: 4px 10px; /* 内边距 */
  font-size: 13px; /* 小号字 */
  cursor: pointer; /* 鼠标变小手 */
}
</style>
