<script setup lang="ts">
// ===== App.vue 的"大脑"（逻辑区）=====
// <script setup> 是 Vue 3 的组合式 API 写法：
//   这里写的变量/函数，可以直接在下面的 <template> 里使用

import { ref, computed } from "vue";
// ↑ ref: 造一个"响应式变量"——它一变，界面自动跟着变
//   computed: 造一个"自动计算的值"——依赖变了它自动重算

import WhaleCard from "./components/WhaleCard.vue";
// ↑ 导入子组件（组件化：把页面拆成一个个积木块）

// --- 体验 1：响应式计数 ---
const count = ref(0);
// ↑ ref(0) 包了一个初始值 0；注意读写要用 .value
//   在模板里写 {{ count }} 会自动展开，不用写 .value

function addOne(): void {
  count.value++;
  // ↑ 在 JS 里改数据要 .value；改完界面自动更新，不用碰 DOM！
}

// --- 体验 2：双向绑定 v-model ---
const nickname = ref("鲸鱼娘");
// ↑ 一个响应式字符串

// --- 体验 3：computed 自动计算 ---
const mood = computed(() => {
  // ↑ computed 像"会算的表"：依赖的 count 一变，它自动重新算
  if (count.value === 0) return "还没开始摸鱼";
  if (count.value < 5) return "摸鱼中...";
  return "鱼都被主人摸秃啦！";
});

// --- 体验 4：子组件发事件，父组件接收 ---
const waveMsg = ref("");
// ↑ 用来存放"子组件传来的消息"

function onWhaleWave(message: string): void {
  // ↑ 子组件挥鳍时，父组件会收到这个回调（消息从子组件传上来了）
  waveMsg.value = message;
}
</script>

<template>
  <!-- ===== App.vue 的"脸面"（模板区）=====
       这里写的是 HTML 的"增强版"：可以插入 {{ 变量 }} 和指令 -->

  <main class="lab">
    <h1>🐳 鲸鱼娘的 Vue 实验室</h1>

    <section class="card">
      <h2>体验一：响应式计数（对比手写 DOM！）</h2>
      <p>点一下按钮，count 变了，下面三处界面自动更新：</p>

      <!-- @click 是"点击事件"的简写；{{ count }} 是插值 -->
      <button @click="addOne">戳我一下 (+1)</button>

      <!-- 同一份数据，多处使用，全部自动同步 -->
      <p class="big">当前数字：{{ count }}</p>
      <p class="mood">状态：{{ mood }}</p>
      <!-- ↑ mood 是 computed，count 一变它自动重算 -->

      <!-- 你可能会想：要是手写 DOM，得写多少行才能同步这三处？ -->
    </section>

    <section class="card">
      <h2>体验二：双向绑定 v-model</h2>
      <p>输入框和文字"互相绑定"——改一边，另一边自动跟上：</p>

      <!-- v-model 是"双向绑定"魔法：输入框改了 → nickname 变；
           nickname 变了 → 输入框和文字都自动更新 -->
      <input v-model="nickname" placeholder="输入你的昵称" />
      <p>你好呀，{{ nickname }}！</p>
    </section>

    <!-- 组件化：把"鲸鱼卡片"拆成独立组件 WhaleCard，
         通过 prop 传名字进去，像给函数传参一样；
         @wave="onWhaleWave" 表示：子组件发 wave 事件时，调用父组件的方法 -->
    <WhaleCard :name="nickname" @wave="onWhaleWave" />

    <!-- 显示子组件传来的消息（体验 4 的成果） -->
    <p v-if="waveMsg" class="wave-msg">{{ waveMsg }}</p>
  </main>
</template>

<style scoped>
/* ===== App.vue 的"衣服"（样式区）=====
   scoped 意思是"样式只作用于本组件"，不会泄漏污染别的组件 */
.lab {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, sans-serif;
}
.card {
  border: 1px solid #c7d2fe;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 16px 0;
  background: #eef2ff;
}
.big {
  font-size: 32px;
  font-weight: bold;
  color: #4f46e5;
}
.mood {
  color: #9333ea;
  font-weight: 600;
}
button {
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background: #4f46e5;
  color: white;
  cursor: pointer;
}
input {
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #c7d2fe;
}
.wave-msg {
  margin-top: 12px;
  padding: 10px 14px;
  background: #fef3c7;
  border-radius: 10px;
  color: #92400e;
  font-weight: 600;
}
</style>
