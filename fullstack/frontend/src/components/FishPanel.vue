<script setup lang="ts">
// FishPanel.vue —— 接住小鱼小游戏（对应原 fish.ts）
// requestAnimationFrame 游戏循环 + Canvas 绘制 + 碰撞检测 + 音效。
// 移动鼠标控制鲸鱼接鱼，漏 3 条结束。

import { ref, onMounted, onUnmounted } from "vue";
// ↑ 响应式 + 生命周期

import { playNote } from "../audio";
// ↑ 复用共享发声器（接住叮一声、漏鱼嘟一声）

const canvasRef = ref<HTMLCanvasElement | null>(null);
// ↑ 游戏画布引用

const score = ref(0);
// ↑ 得分（响应式，模板显示）

const lives = ref(3);
// ↑ 剩余生命

const status = ref("🐟 移动鼠标接小鱼，漏 3 条就结束！");
// ↑ 状态文字

const W = 720;
const H = 360;
// ↑ 画布内部逻辑尺寸

const bucket = { x: W / 2 - 40, w: 80, h: 26, y: H - 34 };
// ↑ 鲸鱼（接鱼桶）初始位置

const FISH_COLORS = ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#ef4444"];
// ↑ 小鱼可选颜色

interface Fish {
  x: number;
  y: number;
  r: number;
  speed: number;
  color: string;
  dead: boolean;
}
// ↑ 一条下落小鱼的类型

let fishes: Fish[] = [];
// ↑ 全部下落中的鱼
let over = false;
let lastT = 0;
let spawnTimer = 0;
let spawnGap = 1;
let rafId = 0;
// ↑ 内部游戏状态（非响应式，避免每帧触发渲染）

let ctx: CanvasRenderingContext2D | null = null;
// ↑ 画布画笔

function makeFish(): void {
  // ↑ 生一条鱼
  fishes.push({
    x: 20 + Math.random() * (W - 40),
    y: -15,
    r: 10 + Math.random() * 4,
    speed: 130 + Math.random() * 100,
    color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
    dead: false,
  });
}

function drawFish(f: Fish): void {
  // ↑ 画一条小鱼（身体椭圆 + 眼睛 + 尾巴）
  if (!ctx) return;
  ctx.fillStyle = f.color;
  ctx.beginPath();
  ctx.ellipse(f.x, f.y, f.r, f.r * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  // ↑ 身体
  ctx.beginPath();
  ctx.moveTo(f.x - f.r, f.y);
  ctx.lineTo(f.x - f.r - 8, f.y - 6);
  ctx.lineTo(f.x - f.r - 8, f.y + 6);
  ctx.closePath();
  ctx.fill();
  // ↑ 尾巴三角
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(f.x + f.r * 0.45, f.y - f.r * 0.15, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // ↑ 眼睛
}

function drawWhale(): void {
  // ↑ 画底部鲸鱼
  if (!ctx) return;
  const cx = bucket.x + bucket.w / 2;
  const cy = bucket.y + bucket.h / 2;
  ctx.fillStyle = "#1e40af";
  ctx.beginPath();
  ctx.moveTo(bucket.x, cy);
  ctx.lineTo(bucket.x - 16, cy - 9);
  ctx.lineTo(bucket.x - 16, cy + 9);
  ctx.closePath();
  ctx.fill();
  // ↑ 尾巴
  ctx.fillStyle = "#2563eb";
  ctx.beginPath();
  ctx.ellipse(cx, cy, bucket.w / 2, bucket.h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // ↑ 身体
  ctx.fillStyle = "#bfdbfe";
  ctx.beginPath();
  ctx.ellipse(cx - bucket.w * 0.08, cy + bucket.h * 0.12, bucket.w * 0.3, bucket.h * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  // ↑ 肚皮
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(bucket.x + bucket.w - 10, cy - 5, 3, 0, Math.PI * 2);
  ctx.fill();
  // ↑ 眼睛
}

function render(): void {
  // ↑ 画一整帧
  if (!ctx) return;
  ctx.fillStyle = "#e0f2fe";
  ctx.fillRect(0, 0, W, H);
  fishes.forEach(drawFish);
  drawWhale();
  if (over) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("游戏结束", W / 2, H / 2 - 12);
    ctx.font = "16px sans-serif";
    ctx.fillText(`得分 ${score.value}，点下方按钮重新开始`, W / 2, H / 2 + 24);
  }
}

function loop(t: number): void {
  // ↑ 游戏主循环：每帧调用一次
  const dt = lastT ? (t - lastT) / 1000 : 0;
  lastT = t;
  if (!over) {
    spawnTimer += dt;
    if (spawnTimer >= spawnGap) {
      spawnTimer -= spawnGap;
      makeFish();
    }
    fishes.forEach((f) => {
      f.y += f.speed * dt;
      if (f.y >= bucket.y - f.r) {
        // ↑ 鱼到达鲸鱼高度
        if (f.x > bucket.x - 6 && f.x < bucket.x + bucket.w + 6) {
          // ↑ 接住！
          score.value++;
          playNote(880, 0.12);
          spawnGap = Math.max(0.4, spawnGap * 0.97);
        } else {
          // ↑ 漏了
          lives.value--;
          playNote(150, 0.25);
          if (lives.value <= 0) {
            over = true;
            status.value = "💀 游戏结束啦！点下面按钮重开一局~";
          }
        }
        f.dead = true;
      }
    });
    fishes = fishes.filter((f) => !f.dead);
  }
  render();
  rafId = requestAnimationFrame(loop);
}

function restart(): void {
  // ↑ 重新开始
  fishes = [];
  score.value = 0;
  lives.value = 3;
  over = false;
  spawnTimer = 0;
  spawnGap = 1;
  bucket.x = W / 2 - bucket.w / 2;
  status.value = "🐟 移动鼠标接小鱼，漏 3 条就结束！";
}

function onMove(e: PointerEvent): void {
  // ↑ 鼠标控制鲸鱼
  const c = canvasRef.value;
  if (!c) return;
  const rect = c.getBoundingClientRect();
  const x = ((e.clientX - rect.left) * W) / rect.width;
  bucket.x = Math.max(0, Math.min(x - bucket.w / 2, W - bucket.w));
}

onMounted(() => {
  // ↑ 挂载后启动
  ctx = canvasRef.value?.getContext("2d") ?? null;
  restart();
  rafId = requestAnimationFrame(loop);
});

onUnmounted(() => cancelAnimationFrame(rafId));
// ↑ 卸载时停止循环
</script>

<template>
  <h2>接住小鱼</h2>
  <p class="intro">移动鼠标控制鲸鱼，接住掉落的小鱼；漏掉 3 条就结束啦~</p>
  <canvas
    ref="canvasRef"
    id="fishCanvas"
    @pointermove="onMove"
  ></canvas>
  <p id="fishStatus">{{ status }}</p>
  <p class="fish-score">得分 {{ score }} · 生命 {{ lives }}</p>
  <button id="btnFishRestart" @click="restart">🔄 重新开始</button>
</template>
