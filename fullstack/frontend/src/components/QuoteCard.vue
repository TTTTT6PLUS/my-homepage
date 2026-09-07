<script setup lang="ts">
// QuoteCard.vue —— 随机语录卡片
// 调用后端自定义接口 /quotes/random/：数据库里随机挑一条返回。
// 以前语录写死在 JS 数组里，现在存在 Django 数据库，后台可随时增删。

import { ref, onMounted } from "vue";
// ↑ 响应式变量 + 挂载回调

import { quoteApi } from "../api";
// ↑ 导入语录接口
import type { Quote } from "../api";
// ↑ 导入语录类型

const quote = ref<Quote | null>(null);
// ↑ 当前显示的语录（初始 null = 还没加载）

const errorMsg = ref("");
// ↑ 错误提示

async function fetchRandom(): Promise<void> {
  // ↑ 从后端随机取一条语录
  errorMsg.value = "";
  try {
    quote.value = await quoteApi.random();
    // ↑ 调用随机接口
  } catch (err) {
    errorMsg.value = (err as Error).message;
    // ↑ 失败显示错误
  }
}

onMounted(fetchRandom);
// ↑ 进页面先随机来一条
</script>

<template>
  <!-- 语录卡片的外观 -->
  <section class="card">
    <h2>💬 摸鱼语录 <span class="tag">后端随机</span></h2>

    <!-- 有语录时显示文字和作者 -->
    <blockquote v-if="quote">
      <p class="text">“{{ quote.text }}”</p>
      <footer>—— {{ quote.author }}</footer>
    </blockquote>

    <!-- 出错提示 / 加载提示 -->
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-else-if="!quote" class="hint">加载中...</p>

    <!-- 换一条按钮：每次点击都去后端重新随机 -->
    <button @click="fetchRandom">🎲 换一条</button>
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
  background: #0d9488;
  color: #fff;
  padding: 2px 8px;
  border-radius: 999px;
  vertical-align: middle;
}
.text {
  font-size: 18px;
  line-height: 1.6;
  margin: 8px 0;
}
footer {
  color: #64748b;
  font-size: 14px;
  text-align: right;
}
button {
  background: #0d9488;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
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
