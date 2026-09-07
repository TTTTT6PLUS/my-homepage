<script setup lang="ts">
// QuotePanel.vue —— 随机摸鱼语录（对应原 quote.ts）
// 原版语录是写死在 JS 数组里；现在数据存 Django 数据库，
// 点按钮调用 /api/quotes/random/ 由后端随机返回一条。

import { ref } from "vue";
// ↑ ref：响应式数据

import { quoteApi } from "../api";
// ↑ 语录接口

const text = ref("点下面的按钮，抽一句摸鱼语录~");
// ↑ 当前显示的语录文字（初始为提示语）

const author = ref("");
// ↑ 当前语录作者

const loading = ref(false);
// ↑ 请求中标记（防连点）

async function randomQuote(): Promise<void> {
  // ↑ 抽一条语录（异步：要等后端返回）
  if (loading.value) return;
  // ↑ 正在请求就忽略（防连点）
  loading.value = true;
  // ↑ 打开加载标记
  try {
    const q = await quoteApi.random();
    // ↑ 调用后端随机接口
    text.value = q.text;
    // ↑ 更新文字
    author.value = q.author;
    // ↑ 更新作者
  } catch {
    text.value = "语录加载失败，检查后端是否启动~";
    // ↑ 后端没启动等异常情况给个提示
  } finally {
    loading.value = false;
    // ↑ 无论成败都关掉加载标记
  }
}

async function copyQuote(): Promise<void> {
  // ↑ 复制当前语录到剪贴板
  try {
    await navigator.clipboard.writeText(text.value);
    // ↑ 写入剪贴板（需 HTTPS 或 localhost）
    alert("已复制到剪贴板~");
  } catch {
    alert("复制失败");
  }
}
</script>

<template>
  <h2>摸鱼语录</h2>
  <p id="quoteText">{{ text }}</p>
  <p v-if="author" class="quote-author">—— {{ author }}</p>
  <button id="btnQuote" :disabled="loading" @click="randomQuote">
    {{ loading ? "抽取中..." : "随机摸鱼语录" }}
  </button>
  <button id="btnCopyQuote" @click="copyQuote">📋 复制语录</button>
</template>

<style scoped>
.quote-author {
  color: var(--text);
  font-size: 13px;
  text-align: right;
}
</style>
