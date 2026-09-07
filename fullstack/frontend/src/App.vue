<script setup lang="ts">
// App.vue —— 根组件：把整个"个人主页"拼起来
// 职责：
//   1) 根据 store 的 dark/green 设置 body 类（全局换肤）
//   2) 页面加载时从后端拉取全部设置（loadSettings）
//   3) 组装所有功能面板（GreetHeader + 8 个功能块 + 附加块）
//   4) 全局键盘快捷键（/ 聚焦GitHub、Ctrl+Enter 快速加待办、? 帮助、Esc 关闭）

import { watch, onMounted, ref } from "vue";
// ↑ watch 监听；onMounted 挂载；ref 响应式

import { settings, loadSettings, updateSetting } from "./store";
// ↑ 全局设置（dark/green/myName/bestScore）及其读写函数

import { emit } from "./bus";
// ↑ 事件总线（把快捷键广播给各面板）

// ---- 引入所有功能面板组件 ----
import GreetHeader from "./components/GreetHeader.vue";
import GreetPanel from "./components/GreetPanel.vue";
import QuotePanel from "./components/QuotePanel.vue";
import TodoPanel from "./components/TodoPanel.vue";
import TimerPanel from "./components/TimerPanel.vue";
import DrawPanel from "./components/DrawPanel.vue";
import DogPanel from "./components/DogPanel.vue";
import GithubPanel from "./components/GithubPanel.vue";
import GuessPanel from "./components/GuessPanel.vue";
import BoardPanel from "./components/BoardPanel.vue";
import TtsPanel from "./components/TtsPanel.vue";
import FishPanel from "./components/FishPanel.vue";
import SkillPanel from "./components/SkillPanel.vue";
import PianoPanel from "./components/PianoPanel.vue";
import BackupPanel from "./components/BackupPanel.vue";
// ↑ 顶部信息、互动功能、待办、倒计时、抽签、狗图、GitHub、猜数字、
//   涂鸦、语音、接小鱼、技能图、电子琴、数据备份

// ---- 挂载后：拉取后端设置，并应用 body 类 ----
onMounted(async () => {
  await loadSettings();
  // ↑ 从后端读名字/主题/绿肤/最佳成绩
  applyBodyClass();
  // ↑ 按读到的值应用一次
});

// ---- 监听主题与绿肤变化：同步给 body ----
watch(
  () => [settings.dark, settings.green] as const,
  () => {
    applyBodyClass();
    // ↑ 任一变化都重刷 body 类
    saveThemePrefs();
    // ↑ 并持久化到后端
  },
);

function applyBodyClass(): void {
  // ↑ 把 dark/green 类加到 body 上（CSS 变量切换皮肤）
  document.body.classList.toggle("dark", settings.dark);
  document.body.classList.toggle("green", settings.green);
}

async function saveThemePrefs(): Promise<void> {
  // ↑ 把主题/绿肤写回后端 Setting 表（薄封装，避免在 watch 里直接写异步）
  await updateSetting("dark", settings.dark);
  await updateSetting("green", settings.green);
}

// ---- 帮助面板开关 ----
const helpOpen = ref(false);
// ↑ 帮助面板是否显示

function openHelp(): void {
  helpOpen.value = true;
}
function closeHelp(): void {
  helpOpen.value = false;
}

// ---- 全局键盘快捷键（对应原 shortcut.ts）----
function onKeydown(e: KeyboardEvent): void {
  // ↑ 键盘按下事件
  const el = e.target as HTMLElement;
  const inInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA";
  // ↑ 焦点是否在输入框

  if (e.key === "Escape") {
    closeHelp();
    return;
    // ↑ Esc 关帮助
  }
  if (e.key === "?" && !inInput) {
    e.preventDefault();
    openHelp();
    return;
    // ↑ ? 开帮助（避开输入框内打字）
  }
  if (e.key === "/" && !inInput) {
    e.preventDefault();
    emit("focus-github");
    return;
    // ↑ / 聚焦 GitHub 搜索（广播给 GithubPanel）
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && inInput) {
    e.preventDefault();
    emit("quick-add-todo");
    // ↑ Ctrl/Cmd+Enter 快速加待办（广播给 TodoPanel）
  }
}

onMounted(() => document.addEventListener("keydown", onKeydown));
// ↑ 页面级键盘监听
</script>

<template>
  <!-- 最外层卡片容器（复用原版样式） -->
  <div class="card">
    <!-- 顶部：头像/主题/名字/关于我（含改名、换肤按钮所在的独立面板放功能区） -->
    <GreetHeader />

    <!-- 功能网格：两列排布各功能块 -->
    <div class="grid">
      <div class="block" v-reveal><GreetPanel /></div>
      <div class="block" v-reveal><QuotePanel /></div>
      <div class="block" v-reveal><TodoPanel /></div>
      <div class="block" v-reveal><TimerPanel /></div>
      <div class="block" v-reveal><DrawPanel /></div>
      <div class="block" v-reveal><DogPanel /></div>
      <div class="block" v-reveal><GithubPanel /></div>
      <div class="block" v-reveal><GuessPanel /></div>
    </div>

    <!-- 整行大块 -->
    <div class="block" v-reveal><BoardPanel /></div>
    <div class="block" v-reveal><TtsPanel /></div>
    <div class="block" v-reveal><FishPanel /></div>
    <div class="block" v-reveal><SkillPanel /></div>
    <div class="block" v-reveal><PianoPanel /></div>
    <div class="block" v-reveal><BackupPanel /></div>

    <p class="foot">
      🐳 Vue 3.5 + Django + SQLite 全栈重构版 · 数据存服务器数据库
    </p>
  </div>

  <!-- 键盘快捷键帮助浮层 -->
  <div v-if="helpOpen" class="help-overlay" @click.self="closeHelp">
    <div class="help-panel">
      <h2>⌨️ 键盘快捷键</h2>
      <ul class="help-list">
        <li><kbd>/</kbd> 聚焦 GitHub 搜索框</li>
        <li><kbd>Ctrl</kbd> + <kbd>Enter</kbd> 快速添加待办</li>
        <li><kbd>?</kbd> 打开此帮助面板</li>
        <li><kbd>Esc</kbd> 关闭帮助面板</li>
      </ul>
      <button @click="closeHelp">知道了</button>
    </div>
  </div>
</template>

<style>
/* 页面底部说明与网格块标题微调（不覆盖原版样式） */
.foot {
  margin-top: 24px;
  color: var(--text);
  font-size: 13px;
  opacity: 0.75;
}
</style>
