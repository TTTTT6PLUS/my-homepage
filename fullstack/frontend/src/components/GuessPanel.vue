<script setup lang="ts">
// GuessPanel.vue —— 猜数字游戏（对应原 guess.ts）
// 原版最佳成绩存 localStorage；现在存 Django Setting.bestScore。

import { ref } from "vue";
// ↑ ref 响应式

import { settings, updateSetting } from "../store";
// ↑ 全局设置（bestScore 在里面）

const input = ref("");
// ↑ 猜测输入

const hint = ref("我想了一个 1~100 之间的数字，来猜猜看！");
// ↑ 提示文字

const result = ref("");
// ↑ 猜测反馈

const bestScore = ref(settings.bestScore);
// ↑ 本地缓存最佳成绩（避免每次读取都请求后端）

let secret = Math.floor(Math.random() * 100) + 1;
// ↑ 秘密数字：1~100 随机
let count = 0;
// ↑ 已猜次数

function guess(): void {
  // ↑ 猜一次
  const n = Number(input.value);
  if (Number.isNaN(n) || n < 1 || n > 100) {
    result.value = "请输入 1~100 之间的数字";
    return;
  }
  count++;
  if (n > secret) {
    result.value = n + " 太大了，再小一点~";
  } else if (n < secret) {
    result.value = n + " 太小了，再大一点~";
  } else {
    result.value = "猜对了！你用了 " + count + " 次";
    if (bestScore.value === 0 || count < bestScore.value) {
      bestScore.value = count;
      updateSetting("bestScore", count);
      // ↑ 写回后端 Setting 表持久化
    }
  }
  input.value = "";
}

function restart(): void {
  // ↑ 重新开始
  secret = Math.floor(Math.random() * 100) + 1;
  count = 0;
  result.value = "";
  input.value = "";
}
</script>

<template>
  <h2>猜数字游戏</h2>
  <p id="guessHint">{{ hint }}</p>
  <input
    v-model="input"
    id="guessInput"
    type="text"
    placeholder="输入你的猜测"
    @keyup.enter="guess"
  />
  <button id="btnGuess" @click="guess">猜！</button>
  <button id="btnRestart" @click="restart">重新开始</button>
  <p id="guessResult">{{ result }}</p>
  <p id="bestScore">
    最佳成绩：{{ bestScore === 0 ? "暂无" : bestScore + " 次" }}
  </p>
</template>
