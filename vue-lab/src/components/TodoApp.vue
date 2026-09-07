<script setup lang="ts">
// ===== TodoApp.vue（父组件：待办清单的"总管"）=====
// 对应手写版主页的 todo.ts，但这次用 Vue 的响应式方式重写
// 父组件负责：管数据、管逻辑、管持久化；显示交给子组件 TodoItem

import { ref, computed, watch } from "vue";
// ↑ 从 vue 导入三个工具：
//   ref：创建响应式数据
//   computed：创建自动计算值
//   watch：监视数据变化，变化时执行回调

import TodoItem from "./TodoItem.vue";
// ↑ 引入子组件（父组件 import 子组件，就像搭积木）

import type { Task } from "./TodoItem.vue";
// ↑ 复用子组件里定义的 Task 类型（从 .vue 里 import type 是可以的）
//   加 type 关键字：这是"纯类型导入"，编译后会被删掉，不产生多余代码

const KEY = "vue-todo";
// ↑ localStorage 的存取钥匙（注意：跟手写版的 "tasks" 分开，避免互相干扰！）

// --- 1. 数据：任务列表（响应式） ---
function loadTasks(): Task[] {
  // ↑ 定义读取函数，返回值类型是 Task 数组
  // 作用：从 localStorage 读回上次的待办；没有或解析失败就返回空数组
  const raw = localStorage.getItem(KEY);
  // ↑ 从 localStorage 按 KEY 取出原始字符串；没存过会是 null
  if (!raw) return [];
  // ↑ 如果 raw 是 null 或空串 → 直接返回空数组（第一次使用）
  try {
    // ↑ 尝试解析 JSON（可能失败，所以要 try-catch）
    return JSON.parse(raw) as Task[];
    // ↑ 把 JSON 字符串还原成 Task 数组（as 断言告诉 TS 它的类型）
  } catch {
    // ↑ 如果 JSON.parse 抛错（数据损坏等）
    return [];
    // ↑ 返回空数组兜底，不让程序崩溃
  }
}

const tasks = ref<Task[]>(loadTasks());
// ↑ 创建响应式数组 tasks，初始值 = loadTasks() 读回来的数据
//   注意：在 JS 里操作数组要写 tasks.value（如 tasks.value.push）

// --- 2. 持久化：任务一变，自动存盘 ---
watch(
  tasks,
  // ↑ watch 第一个参数：要监视的数据（这里是 tasks 数组）
  (val) => {
    // ↑ 第二个参数：变化时执行的回调，val 是最新的数组
    localStorage.setItem(KEY, JSON.stringify(val));
    // ↑ 把最新数组序列化成 JSON 字符串，存进 localStorage
  },
  { deep: true }
  // ↑ 第三个参数：配置项
  //   deep: true 表示"数组里面的内容变了也算变"（比如勾选 done）
);

// --- 3. 输入框的新任务文字 ---
const newText = ref("");
// ↑ 创建响应式字符串 newText，初始为空
//   它和模板里的输入框通过 v-model 双向绑定

function addTask(): void {
  // ↑ 定义"添加任务"函数
  const text = newText.value.trim();
  // ↑ 读取输入框内容并去掉首尾空格
  if (!text) return;
  // ↑ 如果去空格后是空的 → 直接返回，不添加空任务
  tasks.value.push({ text, done: false });
  // ↑ 往任务数组尾部推一条新任务（初始未完成）
  newText.value = "";
  // ↑ 清空输入框，方便输入下一条
}

// --- 4. 子组件喊话的处理函数（父组件拍板） ---
function toggleTask(index: number): void {
  // ↑ 处理子组件传来的"切换完成"事件，参数 index 是第几条
  tasks.value[index].done = !tasks.value[index].done;
  // ↑ 找到第 index 条，把它的 done 取反（true 变 false，false 变 true）
}
function removeTask(index: number): void {
  // ↑ 处理子组件传来的"删除"事件，参数 index 是第几条
  tasks.value.splice(index, 1);
  // ↑ splice(index, 1)：从第 index 个位置开始，删除 1 个元素
}

// --- 5. 筛选状态 + 计算属性 ---
type Filter = "all" | "active" | "done";
// ↑ 定义一个联合类型：筛选条件只能是这三种字符串之一
const filter = ref<Filter>("all");
// ↑ 创建响应式筛选条件，默认 "all"（全部）
//   （用 <Filter> 限定：只能赋 "all"/"active"/"done"）

const visibleTasks = computed<Task[]>(() => {
  // ↑ 计算属性：根据筛选条件，自动算出"该显示哪些任务"
  if (filter.value === "active") return tasks.value.filter((t) => !t.done);
  // ↑ 如果是"未完成" → 过滤出 done 为 false 的任务
  if (filter.value === "done") return tasks.value.filter((t) => t.done);
  // ↑ 如果是"已完成" → 过滤出 done 为 true 的任务
  return tasks.value;
  // ↑ 否则（"全部"）→ 返回整个数组
});

const remaining = computed(() => {
  // ↑ 计算属性：还有几件没完成（用于进度展示）
  return tasks.value.filter((t) => !t.done).length;
  // ↑ 过滤出未完成的任务，取它的长度（个数）
});

function setFilter(f: Filter): void {
  // ↑ 切换筛选条件的函数，参数 f 是新的筛选条件
  filter.value = f;
  // ↑ 把 filter 设为用户点选的类型
  //   因为 visibleTasks 依赖 filter，这里一变，列表自动刷新
}
</script>

<template>
  <!-- ===== 待办清单的"长相"（模板区）===== -->
  <section class="todo-app">
    <!-- ↑ 最外层容器，class="todo-app" 套用样式 -->

    <h2>📝 待办清单（Vue 重写版）</h2>
    <!-- ↑ 卡片标题 -->

    <!-- 输入 + 添加按钮 -->
    <div class="add-row">
      <!-- ↑ 放输入框和按钮的一行容器 -->

      <input
        v-model="newText"
        placeholder="要干点啥？"
        @keyup.enter="addTask"
      />
      <!-- ↑ 输入框（写成多行方便阅读）
           v-model="newText"：输入内容和 newText 双向绑定
           placeholder="要干点啥？"：空输入框时显示的灰色提示
           @keyup.enter="addTask"：在输入框里按回车 → 执行 addTask
           （.enter 是 Vue 的"按键修饰符"，只监听回车键） -->
      <!-- ↑ @keyup.enter：按回车就添加（Vue 的事件修饰符） -->
      <button @click="addTask">添加</button>
      <!-- ↑ 添加按钮：点击执行 addTask -->
    </div>

    <!-- 筛选按钮组 -->
    <div class="filters">
      <!-- ↑ 放三个筛选按钮的容器 -->
      <button
        v-for="f in (['all', 'active', 'done'] as Filter[])"
        :key="f"
        :class="{ active: filter === f }"
        @click="setFilter(f)"
      >
        <!-- ↑ v-for：循环渲染三个按钮，每次循环 f 取一个值
             in (['all','active','done'] as Filter[])：遍历这个数组
               （as Filter[] 是告诉 TS 数组元素都是 Filter 类型）
             :key="f"：给每个按钮一个唯一标识（Vue 要求 v-for 必须带 key）
             :class="{ active: filter === f }"：当前选中的按钮加 active 类高亮
             @click="setFilter(f)"：点击时把筛选条件设为 f -->
        <!-- v-for 循环渲染三个筛选按钮；:class 高亮当前选中的 -->
        {{ f === "all" ? "全部" : f === "active" ? "未完成" : "已完成" }}
        <!-- ↑ 三元表达式：把英文条件翻译成中文按钮文字 -->
      </button>
    </div>

    <!-- 统计信息 -->
    <p class="stats">
      <!-- ↑ 统计文字段落，class="stats" 套小灰字样式 -->
      共 {{ tasks.length }} 件，还剩 {{ remaining }} 件没做
      <!-- ↑ 插值：tasks.length 是总件数，remaining 是未完成件数 -->
    </p>

    <!-- 任务列表：v-for 把数组变成一排子组件 -->
    <ul class="todo-list">
      <!-- ↑ 无序列表容器，class="todo-list" 去掉默认圆点 -->
      <TodoItem
        v-for="(task, i) in visibleTasks"
        :key="task.text + i"
        :task="task"
        :index="i"
        @toggle="toggleTask"
        @remove="removeTask"
      />
      <!-- ↑ 使用子组件 TodoItem，并让它循环渲染
           v-for="(task, i) in visibleTasks"：遍历该显示的数组
             每次循环：task = 当前这条任务，i = 它的序号
           :key="task.text + i"：唯一标识（文字+序号，避免重复文字冲突）
           :task="task"：把当前任务传给子组件的 task prop
           :index="i"：把序号传给子组件的 index prop
           @toggle="toggleTask"：子组件喊 toggle 时 → 父组件执行 toggleTask
           @remove="removeTask"：子组件喊 remove 时 → 父组件执行 removeTask -->
      <!-- ↑ v-for 每循环一次就"生"一个 TodoItem 子组件
            :task 和 :index 是传给子组件的 props
            @toggle / @remove 是监听子组件喊话 -->
    </ul>

    <!-- 空列表提示 -->
    <p v-if="visibleTasks.length === 0" class="empty">
      <!-- ↑ v-if 条件渲染：当该显示的列表为空时才显示这行提示 -->
      （这里空空如也~）
      <!-- ↑ 提示文案 -->
    </p>
  </section>
</template>

<style scoped>
/* scoped：这套样式只属于待办清单组件，不会漏到外面 */
.todo-app {
  /* ↑ 整个待办卡片的容器样式 */
  border: 1px solid #a5b4fc; /* 紫色边框 */
  border-radius: 16px; /* 大圆角 */
  padding: 16px 20px; /* 内边距 */
  background: white; /* 白底 */
  margin-top: 16px; /* 和上方内容拉开距离 */
}
.add-row {
  /* ↑ 输入框+按钮那一行的布局 */
  display: flex; /* 弹性布局排成一行 */
  gap: 8px; /* 间距 8px */
  margin-bottom: 12px; /* 下方留白 */
}
.add-row input {
  /* ↑ 输入框样式 */
  flex: 1; /* 占满剩余宽度 */
  padding: 8px 12px; /* 内边距 */
  border: 1px solid #c7d2fe; /* 淡紫边框 */
  border-radius: 8px; /* 圆角 */
}
.add-row button {
  /* ↑ 添加按钮样式 */
  background: #059669; /* 绿色背景 */
  border: none; /* 去边框 */
  color: white; /* 白字 */
  border-radius: 8px; /* 圆角 */
  padding: 8px 16px; /* 内边距 */
  cursor: pointer; /* 手型光标 */
}
.filters {
  /* ↑ 筛选按钮组的布局 */
  display: flex; /* 弹性布局排成一行 */
  gap: 8px; /* 间距 */
  margin-bottom: 8px; /* 下方留白 */
}
.filters button {
  /* ↑ 筛选按钮的默认样式 */
  background: #eef2ff; /* 淡紫背景 */
  border: 1px solid #c7d2fe; /* 淡紫边框 */
  border-radius: 999px; /* 超大圆角 = 胶囊形 */
  padding: 4px 14px; /* 内边距 */
  font-size: 13px; /* 小号字 */
  cursor: pointer; /* 手型光标 */
}
.filters button.active {
  /* ↑ 当前选中的筛选按钮样式（多了 active 类） */
  background: #4f46e5; /* 变成靛蓝背景 */
  color: white; /* 白字 */
}
.stats {
  /* ↑ 统计文字样式 */
  font-size: 13px; /* 小号字 */
  color: #64748b; /* 灰蓝色 */
}
.todo-list {
  /* ↑ 任务列表的容器样式 */
  list-style: none; /* 去掉 <ul> 默认的项目符号圆点 */
  padding: 0; /* 去掉默认左内边距 */
  margin: 0; /* 去掉默认外边距 */
}
.empty {
  /* ↑ 空列表提示文字样式 */
  text-align: center; /* 居中 */
  color: #94a3b8; /* 灰色 */
  padding: 12px; /* 内边距 */
}
</style>
