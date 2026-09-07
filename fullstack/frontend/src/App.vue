<script setup lang="ts">
// App.vue —— 根组件
// 把三个功能卡片拼成一个页面。每个卡片独立管自己的数据，互不干扰。

import TodoCard from "./components/TodoCard.vue";
// ↑ 待办卡片
import QuoteCard from "./components/QuoteCard.vue";
// ↑ 语录卡片
import CountdownCard from "./components/CountdownCard.vue";
// ↑ 倒计时卡片
</script>

<template>
  <!-- 页面骨架 -->
  <main class="page">
    <h1>🐳 鲸鱼娘的全栈小窝</h1>
    <p class="sub">Vue 3.5 前端 → Django API → SQLite 数据库</p>

    <!-- 三个功能卡片：各管一摊，全部数据来自后端 -->
    <TodoCard />
    <QuoteCard />
    <CountdownCard />

    <p class="foot">数据存服务器数据库，刷新页面不丢失~</p>
  </main>
</template>

<style scoped>
.page {
  max-width: 560px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, sans-serif;
}
h1 {
  color: #1e3a8a;
}
.sub {
  color: #64748b;
  margin-top: -8px;
}
.foot {
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}
</style>
