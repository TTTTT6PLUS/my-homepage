<script setup lang="ts">
// ===== App.vue 的"大脑"（逻辑区）=====
// <script setup> 是 Vue 3 的组合式 API 写法：
//   这里写的变量/函数，可以直接在下面的 <template> 里使用

import { ref, computed } from "vue";
// ↑ 从 vue 导入两个"魔法工具"：
//   ref：造一个"响应式变量"——它一变，界面自动跟着变
//   computed：造一个"自动计算的值"——依赖变了它自动重算

import WhaleCard from "./components/WhaleCard.vue";
// ↑ 导入子组件"鲸鱼卡片"（组件化 = 把页面拆成一块块积木）

import TodoApp from "./components/TodoApp.vue";
// ↑ 第 44 关：导入"待办清单"组件（用 Vue 重写主页的 todo 模块）

// --- 体验 1：响应式计数 ---
const count = ref(0);
// ↑ ref(0)：创建响应式变量 count，初始值是 0
//   注意：在 JS 里读写要用 count.value；在模板里直接写 {{ count }} 即可

function addOne(): void {
  // ↑ 定义一个"加一"函数，返回值类型是 void（什么都不返回）
  count.value++;
  // ↑ 让 count 的值 +1
  //   关键点：改完这一行，界面上用到 count 的地方全部自动更新，不用碰 DOM！
}
// ↑ 函数结束

// --- 体验 2：双向绑定 v-model ---
const nickname = ref("鲸鱼娘");
// ↑ 创建响应式变量 nickname，初始值是"鲸鱼娘"（一个字符串）

// --- 体验 3：computed 自动计算 ---
const mood = computed(() => {
  // ↑ computed(() => {...})：传入一个"计算函数"
  //   它的返回值会变成一个"自动更新的响应式值"
  if (count.value === 0) return "还没开始摸鱼";
  // ↑ 如果 count 是 0 → 返回这句话
  if (count.value < 5) return "摸鱼中...";
  // ↑ 如果 count 小于 5 → 返回这句话
  return "鱼都被主人摸秃啦！";
  // ↑ 其余情况（count ≥ 5）→ 返回这句话
});
// ↑ computed 结束；mood 会自动跟随 count 变化

// --- 体验 4：子组件发事件，父组件接收 ---
const waveMsg = ref("");
// ↑ 创建响应式变量 waveMsg，初始值是空字符串
//   用来存放"子组件传来的消息"

function onWhaleWave(message: string): void {
  // ↑ 定义"收到挥鳍"的处理函数，参数 message 是子组件传来的消息
  waveMsg.value = message;
  // ↑ 把消息存进 waveMsg，界面上会自动显示出来
}
</script>

<template>
  <!-- ===== App.vue 的"脸面"（模板区）=====
       这里写的是 HTML 的"增强版"：可以插入 {{ 变量 }} 和各种指令
       指令：以 v- 开头（或 @ / : 简写），是 Vue 给 HTML 加的"超能力" -->

  <main class="lab">
    <!-- ↑ 页面主容器，class="lab" 用于套用下面的 .lab 样式 -->

    <h1>🐳 鲸鱼娘的 Vue 实验室</h1>
    <!-- ↑ 页面大标题 -->

    <section class="card">
      <!-- ↑ 第一张卡片（体验一） -->
      <h2>体验一：响应式计数（对比手写 DOM！）</h2>
      <!-- ↑ 卡片小标题 -->
      <p>点一下按钮，count 变了，下面三处界面自动更新：</p>
      <!-- ↑ 说明文字 -->

      <!-- @click 是"点击事件"的简写；{{ count }} 是插值（显示变量的值） -->
      <button @click="addOne">戳我一下 (+1)</button>
      <!-- ↑ @click="addOne"：点击按钮就执行 addOne 函数 -->

      <!-- 同一份数据，多处使用，全部自动同步 -->
      <p class="big">当前数字：{{ count }}</p>
      <!-- ↑ 插值显示 count；class="big" 套大字样式 -->
      <p class="mood">状态：{{ mood }}</p>
      <!-- ↑ 插值显示 computed 值 mood -->
      <!-- ↑ mood 是 computed，count 一变它自动重算 -->

      <!-- 你可能会想：要是手写 DOM，得写多少行才能同步这三处？ -->
    </section>

    <section class="card">
      <!-- ↑ 第二张卡片（体验二） -->
      <h2>体验二：双向绑定 v-model</h2>
      <!-- ↑ 卡片小标题 -->
      <p>输入框和文字"互相绑定"——改一边，另一边自动跟上：</p>
      <!-- ↑ 说明文字 -->

      <!-- v-model 是"双向绑定"魔法：输入框改了 → nickname 变；
           nickname 变了 → 输入框和文字都自动更新 -->
      <input v-model="nickname" placeholder="输入你的昵称" />
      <!-- ↑ v-model="nickname"：输入框的内容和 nickname 双向同步
           placeholder：输入框为空时显示的灰色提示 -->
      <p>你好呀，{{ nickname }}！</p>
      <!-- ↑ 插值显示 nickname，输入时会实时变化 -->
    </section>

    <!-- 组件化：把"鲸鱼卡片"拆成独立组件 WhaleCard，
         通过 prop 传名字进去，像给函数传参一样；
         @wave="onWhaleWave" 表示：子组件发 wave 事件时，调用父组件的方法 -->
    <WhaleCard :name="nickname" @wave="onWhaleWave" />
    <!-- ↑ 使用子组件 WhaleCard
         :name="nickname"：把 nickname 传给子组件的 name prop（父传子）
         @wave="onWhaleWave"：监听子组件的 wave 事件，收到就执行 onWhaleWave（子传父） -->

    <!-- 显示子组件传来的消息（体验 4 的成果） -->
    <p v-if="waveMsg" class="wave-msg">{{ waveMsg }}</p>
    <!-- ↑ v-if="waveMsg"：只有 waveMsg 非空时才显示这行
         （v-if 是"条件渲染"指令，条件为真才渲染元素）
         class="wave-msg"：套黄色提示条样式 -->

    <!-- 第 44 关：用 Vue 重写主页的待办清单模块 -->
    <TodoApp />
    <!-- ↑ 使用待办清单组件（它内部还套着 TodoItem 子组件，
         形成了"组件树"：App → TodoApp → TodoItem） -->
  </main>
  <!-- ↑ 主容器结束 -->
</template>

<style scoped>
/* ===== App.vue 的"衣服"（样式区）=====
   scoped 意思是"样式只作用于本组件"，不会泄漏污染别的组件 */
.lab {
  /* ↑ 整个页面容器的样式 */
  max-width: 640px; /* 最大宽度 640px，窄屏自适应 */
  margin: 0 auto; /* 水平居中（上下 0，左右自动） */
  padding: 24px; /* 四周内边距 24px */
  font-family: system-ui, sans-serif; /* 字体：系统默认 + 无衬线兜底 */
}
.card {
  /* ↑ 卡片的通用样式 */
  border: 1px solid #c7d2fe; /* 淡紫色 1px 边框 */
  border-radius: 12px; /* 圆角 12px */
  padding: 16px 20px; /* 内边距 */
  margin: 16px 0; /* 上下外边距 16px */
  background: #eef2ff; /* 淡紫背景 */
}
.big {
  /* ↑ 大数字样式 */
  font-size: 32px; /* 字号 32px */
  font-weight: bold; /* 加粗 */
  color: #4f46e5; /* 靛蓝色文字 */
}
.mood {
  /* ↑ 状态文字样式 */
  color: #9333ea; /* 紫色文字 */
  font-weight: 600; /* 半粗 */
}
button {
  /* ↑ 页面里所有按钮的通用样式 */
  padding: 8px 16px; /* 内边距 */
  font-size: 16px; /* 字号 */
  border-radius: 8px; /* 圆角 */
  border: none; /* 去掉默认边框 */
  background: #4f46e5; /* 靛蓝背景 */
  color: white; /* 白字 */
  cursor: pointer; /* 鼠标变小手 */
}
input {
  /* ↑ 页面里所有输入框的通用样式 */
  padding: 8px 12px; /* 内边距 */
  font-size: 16px; /* 字号 */
  border-radius: 8px; /* 圆角 */
  border: 1px solid #c7d2fe; /* 淡紫边框 */
}
.wave-msg {
  /* ↑ 挥鳍消息提示条样式 */
  margin-top: 12px; /* 上方间距 */
  padding: 10px 14px; /* 内边距 */
  background: #fef3c7; /* 淡黄背景 */
  border-radius: 10px; /* 圆角 */
  color: #92400e; /* 棕色文字 */
  font-weight: 600; /* 半粗 */
}
</style>
