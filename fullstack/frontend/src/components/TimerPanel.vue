<script setup lang="ts">
// TimerPanel.vue —— 倒计时器（对应原 timer.ts）
// 纯前端逻辑：输入秒数倒计时。不涉及后端（临时数据，无需存储）。

import { ref, onUnmounted } from "vue";
// ↑ ref 响应式；onUnmounted 卸载回调（清理定时器）

const seconds = ref("");
// ↑ 输入框内容（字符串）

const display = ref("0 秒");
// ↑ 显示文字

const invalid = ref(false);
// ↑ 输入是否非法（控制红框）

let timerId: number | null = null;
// ↑ 定时器句柄

function validate(): void {
  // ↑ 校验输入：必须是正整数
  invalid.value = !/^\d+$/.test(seconds.value) || Number(seconds.value) <= 0;
}

function start(): void {
  // ↑ 开始倒计时
  if (!/^\d+$/.test(seconds.value) || Number(seconds.value) <= 0) {
    display.value = "请输入一个正整数（秒）";
    return;
  }
  if (timerId !== null) clearInterval(timerId);
  // ↑ 先清掉旧定时器
  let left = Number(seconds.value);
  // ↑ 剩余秒数
  display.value = left + " 秒";
  timerId = window.setInterval(() => {
    // ↑ 每秒触发一次
    left--;
    display.value = left + " 秒";
    if (left <= 0) {
      // ↑ 归零
      if (timerId !== null) clearInterval(timerId);
      timerId = null;
      display.value = "时间到！";
    }
  }, 1000);
}

function reset(): void {
  // ↑ 重置
  if (timerId !== null) clearInterval(timerId);
  timerId = null;
  seconds.value = "";
  display.value = "0 秒";
  invalid.value = false;
}

onUnmounted(() => {
  // ↑ 组件卸载时清理定时器
  if (timerId !== null) clearInterval(timerId);
});
</script>

<template>
  <h2>倒计时器</h2>
  <input
    v-model="seconds"
    id="timerInput"
    type="text"
    placeholder="输入秒数"
    :class="{ invalid }"
    @input="validate"
    @keyup.enter="start"
  />
  <button id="btnStartTimer" @click="start">开始</button>
  <button id="btnResetTimer" @click="reset">重置</button>
  <p id="timerDisplay">{{ display }}</p>
</template>
