<script setup lang="ts">
// PianoPanel.vue —— 迷你电子琴（对应原 audio.ts 的钢琴部分）
// 用 Web Audio API 发声；波形与音量状态放在共享的 audio.ts 里，
// 这样"接小鱼"游戏也能复用同一套音色设置发声。

import { playNote, waveType, volume } from "../audio";
// ↑ 共享发声函数 + 波形/音量响应式状态

const keys = [
  // ↑ 琴键配置：显示名 + 频率（Hz）
  { label: "Do", freq: 261.63 },
  { label: "Re", freq: 293.66 },
  { label: "Mi", freq: 329.63 },
  { label: "Fa", freq: 349.23 },
  { label: "Sol", freq: 392.0 },
  { label: "La", freq: 440.0 },
  { label: "Si", freq: 493.88 },
  { label: "Do'", freq: 523.25 },
];

function press(freq: number): void {
  // ↑ 点琴键：发声 0.6 秒
  playNote(freq, 0.6);
}
</script>

<template>
  <h2>迷你电子琴</h2>
  <p class="intro">可以弹奏的线上电子琴（Web Audio API）</p>

  <div id="piano">
    <button
      v-for="k in keys"
      :key="k.freq"
      class="piano-key"
      @click="press(k.freq)"
    >
      {{ k.label }}
    </button>
  </div>

  <select v-model="waveType">
    <option value="sine">正弦（柔）</option>
    <option value="square">方波（复古）</option>
    <option value="triangle">三角（空灵）</option>
    <option value="sawtooth">锯齿（电音）</option>
  </select>

  <input v-model.number="volume" type="range" min="0" max="1" step="0.05" />
</template>
