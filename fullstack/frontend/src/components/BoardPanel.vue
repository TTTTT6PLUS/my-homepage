<script setup lang="ts">
// BoardPanel.vue —— 涂鸦板（对应原 board.ts）
// 纯前端 Canvas 绘图：按住拖动画画，可调颜色/粗细、清空、导出 PNG。
// 原版画作不存库（导出图片即保存），此处保持一致。

import { ref, onMounted } from "vue";
// ↑ ref 响应式；onMounted 挂载后初始化画布

const canvasRef = ref<HTMLCanvasElement | null>(null);
// ↑ 指向模板中 <canvas> 的引用

const color = ref("#2563eb");
// ↑ 画笔颜色（绑定取色器）

const penWidth = ref(4);
// ↑ 画笔粗细 1~20（绑定滑块）

let ctx: CanvasRenderingContext2D | null = null;
// ↑ 画布 2D 上下文（拿画笔）
let drawing = false;
// ↑ 是否正在画

function resizeCanvas(): void {
  // ↑ 让画布内部像素尺寸匹配显示尺寸，避免模糊
  const c = canvasRef.value;
  if (!c) return;
  const rect = c.getBoundingClientRect();
  // ↑ 拿到 CSS 显示尺寸
  const prev = c.toDataURL();
  // ↑ 保存当前画作
  c.width = rect.width * 2;
  c.height = rect.height * 2;
  // ↑ 用 2 倍像素提高清晰度（devicePixelRatio 的简化版）
  const img = new Image();
  img.onload = () => ctx?.drawImage(img, 0, 0);
  img.src = prev;
  // ↑ 缩放后把旧画作画回来
}

function applyStyle(): void {
  // ↑ 应用画笔样式
  if (!ctx) return;
  ctx.strokeStyle = color.value;
  ctx.fillStyle = color.value;
  ctx.lineWidth = penWidth.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

function pos(e: PointerEvent): { x: number; y: number } {
  // ↑ 把鼠标/手指屏幕坐标换算成画布坐标
  const c = canvasRef.value!;
  const rect = c.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) * c.width) / rect.width,
    y: ((e.clientY - rect.top) * c.height) / rect.height,
  };
}

function onDown(e: PointerEvent): void {
  // ↑ 按下：开始一笔
  drawing = true;
  applyStyle();
  const p = pos(e);
  ctx?.beginPath();
  ctx?.moveTo(p.x, p.y);
  canvasRef.value?.setPointerCapture(e.pointerId);
  ctx?.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx?.fill();
  // ↑ 点一下也画个圆点（原版行为）
}

function onMove(e: PointerEvent): void {
  // ↑ 移动：画线
  if (!drawing) return;
  const p = pos(e);
  ctx?.lineTo(p.x, p.y);
  ctx?.stroke();
}

function onUp(): void {
  drawing = false;
}

function clearBoard(): void {
  // ↑ 清空画布
  const c = canvasRef.value;
  if (!c || !ctx) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
}

function exportPng(): void {
  // ↑ 导出 PNG
  const c = canvasRef.value;
  if (!c) return;
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png");
  a.download = "my-homepage-doodle.png";
  a.click();
}

onMounted(() => {
  // ↑ 挂载后初始化
  ctx = canvasRef.value?.getContext("2d") ?? null;
  if (!ctx) return;
  resizeCanvas();
  applyStyle();
  window.addEventListener("resize", resizeCanvas);
});
</script>

<template>
  <h2>涂鸦板</h2>
  <p class="intro">按住鼠标（或手指）在画布上拖动画画，画完可以导出成 PNG 存下来~</p>
  <canvas
    ref="canvasRef"
    id="boardCanvas"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
  ></canvas>
  <div class="board-tools">
    <label>🎨 颜色 <input v-model="color" type="color" @input="applyStyle" /></label>
    <label>
      🖊 粗细
      <input v-model.number="penWidth" type="range" min="1" max="20" @input="applyStyle" />
    </label>
    <button id="btnBoardClear" @click="clearBoard">🗑 清空</button>
    <button id="btnBoardExport" @click="exportPng">📥 导出 PNG</button>
  </div>
</template>
