<script setup lang="ts">
// DogPanel.vue —— 随机狗狗（对应原 dog.ts）
// 数据来源：第三方公开 API dog.ceo（无需后端转发，浏览器直连）。
// 保留了原版的防连点 + 超时提示。

import { ref } from "vue";
// ↑ ref 响应式

import { fetchRandomDog } from "../api";
// ↑ 狗狗 API

const img = ref("");
// ↑ 当前狗狗图 URL（空 = 还没加载）

const status = ref("点按钮，从互联网抓一只狗~");
// ↑ 状态文字

const loading = ref(false);
// ↑ 防连点开关

async function getDog(): Promise<void> {
  if (loading.value) return;
  loading.value = true;
  status.value = "加载中...";
  try {
    img.value = await fetchRandomDog();
    status.value = "这就是你的狗狗！";
  } catch {
    status.value = "抓狗失败，检查网络~";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h2>随机狗狗</h2>
  <button id="btnDog" :disabled="loading" @click="getDog">来一只狗狗</button>
  <p id="dogStatus">{{ status }}</p>
  <img
    v-if="img"
    id="dogImg"
    class="dog-img"
    :src="img"
    alt="随机狗狗"
    @load="status = '这就是你的狗狗！'"
  />
  <p v-if="img" class="tip">右键图片可保存哦~</p>
</template>

<style scoped>
.tip {
  font-size: 12px;
  color: var(--text);
  opacity: 0.7;
}
</style>
