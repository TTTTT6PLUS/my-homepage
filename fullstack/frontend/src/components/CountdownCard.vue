<script setup lang="ts">
// CountdownCard.vue —— 倒计时卡片
// 从后端读取"目标时间"，前端每秒计算剩余时间并实时刷新显示。

import { ref, computed, onMounted, onUnmounted } from "vue";
// ↑ ref / computed / 挂载与卸载回调

import { countdownApi } from "../api";
// ↑ 导入倒计时接口
import type { Countdown } from "../api";
// ↑ 导入倒计时类型

const countdown = ref<Countdown | null>(null);
// ↑ 当前倒计时（后端只存了一条"考研倒计时"）

const now = ref(Date.now());
// ↑ 当前时间戳（每秒更新一次，用来驱动倒计时跳动）

const errorMsg = ref("");
// ↑ 错误提示

const remainText = computed(() => {
  // ↑ 计算剩余时间文字（依赖 now 每秒刷新 → 自动重算）
  if (!countdown.value) return "";
  // ↑ 还没有数据就不显示
  const target = new Date(countdown.value.target_time).getTime();
  // ↑ 把后端返回的目标时间字符串转成时间戳
  const diff = target - now.value;
  // ↑ 剩余毫秒 = 目标 - 当前
  if (diff <= 0) return "时间到啦！🎉";
  // ↑ 已过目标时间
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  // ↑ 天 = 毫秒 ÷ (一天多少毫秒)，向下取整
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // ↑ 小时：取余一天的毫秒后 ÷ 一小时
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  // ↑ 分钟
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  // ↑ 秒
  return `${days} 天 ${hours} 小时 ${mins} 分 ${secs} 秒`;
  // ↑ 拼成"X 天 X 小时 X 分 X 秒"
});

let timer: number | undefined;
// ↑ 定时器句柄（存起来方便卸载时清除）

async function loadCountdown(): Promise<void> {
  // ↑ 从后端拉取倒计时
  try {
    const list = await countdownApi.list();
    // ↑ 获取全部倒计时
    countdown.value = list[0] ?? null;
    // ↑ 取第一条（没有就 null）
  } catch (err) {
    errorMsg.value = (err as Error).message;
    // ↑ 失败显示错误
  }
}

onMounted(async () => {
  // ↑ 组件挂载后：
  await loadCountdown();
  // 先拉一次后端数据
  timer = window.setInterval(() => {
    // ↑ 然后每秒更新一次 now
    now.value = Date.now();
    // ↑ now 一变，remainText 自动重算 → 倒计时数字跳动
  }, 1000);
});

onUnmounted(() => {
  // ↑ 组件被销毁时清理定时器（防止内存泄漏）
  if (timer) clearInterval(timer);
});
</script>

<template>
  <!-- 倒计时卡片的外观 -->
  <section class="card">
    <h2>⏳ {{ countdown ? countdown.name : "倒计时" }}</h2>

    <!-- 巨大的剩余时间 -->
    <p class="big" v-if="countdown">{{ remainText }}</p>

    <!-- 错误 / 加载提示 -->
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-else-if="!countdown && !errorMsg" class="hint">加载中...</p>
    <p v-if="countdown" class="hint">
      目标：{{ new Date(countdown.target_time).toLocaleString("zh-CN") }}
    </p>
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
.big {
  font-size: 28px;
  font-weight: bold;
  color: #e11d48;
  font-variant-numeric: tabular-nums;
  margin: 8px 0;
}
.hint {
  color: #94a3b8;
  font-size: 13px;
}
.error {
  color: #dc2626;
  font-size: 13px;
}
</style>
