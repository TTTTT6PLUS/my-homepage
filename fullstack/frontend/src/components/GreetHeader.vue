<script setup lang="ts">
// GreetHeader.vue —— 页面顶部信息（头像/主题/名字/自我介绍/关于我/窗口宽度/标签/联系方式）
// 对应原 index.html 的卡片头部 + theme.ts + win.ts。
// 名字与主题数据存后端 Setting 表，经 store 全局共享（App.vue 里管理 body 的 dark/green 类）。

import { ref, onMounted, onUnmounted } from "vue";
// ↑ ref 创建响应式数据；onMounted/onUnmounted 是挂载/卸载生命周期钩子

import { settings } from "../store";
// ↑ 全局设置 store（名字/主题等，见 store.ts）

// ===== 主题切换（原 theme.ts）=====
function toggleTheme(): void {
  // ↑ 点主题按钮时切换深色/白天
  settings.dark = !settings.dark;
  // ↑ 翻转深色标记；App.vue 里 watch 到变化会自动给 body 加 dark 类
}

// ===== 窗口宽度显示（原 win.ts）=====
const width = ref(window.innerWidth);
// ↑ 用 ref 记录当前窗口宽度，初始取页面加载时的值

function updateWidth(): void {
  // ↑ 窗口缩放时更新宽度
  width.value = window.innerWidth;
}

onMounted(() => window.addEventListener("resize", updateWidth));
// ↑ 挂载后监听 resize（缩放）事件

onUnmounted(() => window.removeEventListener("resize", updateWidth));
// ↑ 卸载时移除监听，防止内存泄漏
</script>

<template>
  <!-- 顶部内容区（class 全部沿用原版样式） -->
  <img class="avatar" src="/avatar.svg" alt="我的头像" />
  <!-- ↑ 头像图片（放在 public/ 下，用根路径引用） -->

  <button id="btnTheme" @click="toggleTheme">
    {{ settings.dark ? "☀️ 切回白天" : "🌙 切换主题" }}
  </button>
  <!-- ↑ 主题按钮文字随状态变化 -->

  <h1 id="myName">你好，我是 {{ settings.myName }}</h1>
  <!-- ↑ 显示名字（读 store 里的 myName，数据在后端） -->

  <p class="intro">
    我是一名正在学习全栈开发的新手，喜欢把想法变成好看的网页。这里是重构为
    Vue + Django 的个人主页，请多多指教。
  </p>

  <h2>关于我</h2>
  <ul class="about-list">
    <li>🎓 正在学：HTML / CSS / JavaScript / Vue / Django</li>
    <li>🌟 目标：成为一名全栈工程师</li>
    <li>🏠 坐标：中国</li>
    <li>💬 一句话：热爱学习，乐于分享</li>
  </ul>

  <p id="winWidth">窗口宽度：{{ width }}px</p>
  <!-- ↑ 响应式显示窗口宽度 -->

  <div>
    <span class="tag">睡觉</span>
    <span class="tag">游戏</span>
    <span class="tag">音乐</span>
    <span class="tag">编程</span>
  </div>

  <div class="contact-row">
    <a href="mailto:ttttt6@qq.com">📧 邮箱</a>
    <a href="https://github.com/TTTTT6PLUS" target="_blank">🐙 GitHub</a>
  </div>
  <!-- ↑ 联系方式（不用 .block 类，避免被"滚动显现"的透明样式隐藏） -->
</template>
