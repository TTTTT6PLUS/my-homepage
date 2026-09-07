<script setup lang="ts">
// TtsPanel.vue —— 语音朗读（对应原 tts.ts）
// 使用浏览器 Web Speech API：把文字读出来，可选中文语音、调语速/音调。

import { ref, onMounted, onUnmounted } from "vue";
// ↑ 响应式 + 生命周期

const text = ref("");
// ↑ 要朗读的文字

const rate = ref(1);
// ↑ 语速（0.5~2）

const pitch = ref(1);
// ↑ 音调（0~2）

const voices = ref<SpeechSynthesisVoice[]>([]);
// ↑ 可选语音列表

const chosenVoice = ref("");
// ↑ 选中的语音名（空 = 默认）

const status = ref("");
// ↑ 状态文字

function loadVoices(): void {
  // ↑ 从浏览器取语音列表
  const all = speechSynthesis.getVoices();
  // ↑ 首次调用可能为空
  if (all.length === 0) return;
  const zh = all.filter((v) => v.lang.toLowerCase().startsWith("zh"));
  // ↑ 优先中文
  voices.value = zh.length ? zh : all;
}

function speak(): void {
  // ↑ 开始朗读
  const t = text.value.trim();
  if (!t) return;
  if (speechSynthesis.speaking) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.rate = rate.value;
  u.pitch = pitch.value;
  const v = voices.value.find((x) => x.name === chosenVoice.value);
  u.voice = v ?? null;
  u.onend = () => (status.value = "✅ 念完啦");
  u.onerror = () => (status.value = "❌ 朗读出错了");
  status.value = "🔊 正在朗读…";
  speechSynthesis.speak(u);
}

function stop(): void {
  speechSynthesis.cancel();
  status.value = "⏹ 已停止";
}

onMounted(() => {
  loadVoices();
  speechSynthesis.addEventListener("voiceschanged", loadVoices);
  // ↑ 语音异步加载完成后会触发此事件
});

onUnmounted(() => {
  speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  speechSynthesis.cancel();
});
</script>

<template>
  <h2>语言朗诵</h2>
  <p class="intro">按下按钮，可以朗读输入的文字~</p>
  <p id="ttsStatus">{{ status }}</p>
  <div class="speak-tools">
    <label>文本内容 <input v-model="text" id="ttsText" type="text" /></label>
    <label>
      语速滑块
      <input v-model.number="rate" id="ttsRate" type="range" min="0.5" max="2" step="0.1" />
    </label>
    <label>
      音调滑块
      <input v-model.number="pitch" id="ttsPitch" type="range" min="0" max="2" step="0.1" />
    </label>
    <select v-model="chosenVoice" id="ttsVoice">
      <option value="">默认语音</option>
      <option v-for="v in voices" :key="v.name" :value="v.name">
        {{ v.name }}（{{ v.lang }}）
      </option>
    </select>
    <button id="btnSpeak" @click="speak">🔊 朗读</button>
    <button id="btnStop" @click="stop">⏹ 停止</button>
  </div>
</template>
