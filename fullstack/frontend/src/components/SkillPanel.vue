<script setup lang="ts">
// SkillPanel.vue —— 我的技能树（对应原 skill.ts）
// 用 Chart.js 画柱状图；跟随深色主题自动换配色。

import { ref, onMounted, onUnmounted, watch } from "vue";
// ↑ 响应式 + 生命周期 + 监听主题

import Chart from "chart.js/auto";
// ↑ Chart.js 主类（auto 自动注册所有常用图表）

import { settings } from "../store";
// ↑ 全局设置（dark 用于换色）

const canvasRef = ref<HTMLCanvasElement | null>(null);
// ↑ 指向图表的 canvas

let chart: Chart | null = null;
// ↑ 图表实例句柄（销毁时用）

const SKILLS = [
  // ↑ 技能数据（以后可换成从后端读取真实统计）
  { name: "HTML", score: 90, color: "#ef4444" },
  { name: "CSS", score: 85, color: "#3b82f6" },
  { name: "JavaScript", score: 80, color: "#f59e0b" },
  { name: "ES6+", score: 78, color: "#10b981" },
  { name: "TypeScript", score: 72, color: "#8b5cf6" },
  { name: "Vue", score: 66, color: "#22d3ee" },
  { name: "Django", score: 58, color: "#0f766e" },
];

function textColor(): string {
  // ↑ 读 CSS 变量取文字颜色（跟随主题）
  return getComputedStyle(document.body).getPropertyValue("--text").trim() || "#475569";
}

function buildChart(): void {
  // ↑ 创建/重建图表
  if (chart) chart.destroy();
  // ↑ 先销毁旧实例（换主题重建）
  const el = canvasRef.value;
  if (!el) return;
  chart = new Chart(el, {
    type: "bar",
    data: {
      labels: SKILLS.map((s) => s.name),
      datasets: [
        {
          label: "熟练度",
          data: SKILLS.map((s) => s.score),
          backgroundColor: SKILLS.map((s) => s.color),
          borderRadius: 8,
          maxBarThickness: 42,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (item) => ` ${item.parsed.y} / 100` } },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { color: textColor() },
          grid: { color: "rgba(148, 163, 184, 0.18)" },
        },
        x: {
          ticks: { color: textColor() },
          grid: { display: false },
        },
      },
    },
  });
}

onMounted(buildChart);
// ↑ 挂载后画图

watch(
  () => settings.dark,
  () => buildChart(),
  // ↑ 主题一变就重建（换文字颜色）
);

onUnmounted(() => chart?.destroy());
// ↑ 卸载时销毁图表
</script>

<template>
  <h2>我的技能树</h2>
  <p class="intro">边学边记，用一张图看看前端技能成长~（Vue 重构版）</p>
  <div class="skill-box">
    <canvas ref="canvasRef" id="skillChart"></canvas>
  </div>
</template>
