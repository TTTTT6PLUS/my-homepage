<script setup lang="ts">
// GithubPanel.vue —— GitHub 用户查询（对应原 github.ts）
// 数据来源：第三方公开 API api.github.com（直连）。
// 保留防抖搜索 + "/" 快捷键聚焦（由 App 捕获键盘后通过事件总线广播）。

import { ref, watch, onMounted, onUnmounted } from "vue";
// ↑ ref 响应式、watch 监听（实现防抖）、生命周期钩子

import { fetchGithubUser } from "../api";
// ↑ GitHub 公开 API

import { on, off } from "../bus";
// ↑ 事件总线：订阅 "focus-github"（按 / 时聚焦输入框）

const name = ref("");
// ↑ 输入的用户名

const resultText = ref("输入用户名，看看 TA 的资料~");
// ↑ 结果文字

const avatar = ref("");
// ↑ 头像 URL

const loading = ref(false);
// ↑ 请求中标记

let timerId: number | null = null;
// ↑ 防抖定时器句柄

async function search(): Promise<void> {
  // ↑ 真正发起查询
  const q = name.value.trim();
  if (!q) {
    resultText.value = "先输入一个用户名";
    return;
  }
  loading.value = true;
  try {
    const data = await fetchGithubUser(q);
    avatar.value = data.avatar_url;
    resultText.value = `用户名：${data.login}，公开仓库：${data.public_repos} 个，粉丝：${data.followers} 人`;
  } catch {
    resultText.value = "没找到这个用户，检查名字~";
    avatar.value = "";
  } finally {
    loading.value = false;
  }
}

// 防抖：输入停顿 500ms 才触发搜索（对应原 debounce(searchUser, 500)）
watch(name, () => {
  if (timerId !== null) clearTimeout(timerId);
  timerId = window.setTimeout(search, 500);
});

function onFocusRequest(): void {
  // ↑ 收到"/"快捷键广播时聚焦输入框
  const el = document.getElementById("ghName") as HTMLInputElement | null;
  el?.focus();
}

onMounted(() => on("focus-github", onFocusRequest));
// ↑ 订阅事件

onUnmounted(() => {
  off("focus-github", onFocusRequest);
  // ↑ 退订
  if (timerId !== null) clearTimeout(timerId);
  // ↑ 清理防抖定时器
});
</script>

<template>
  <h2>GitHub 用户查询</h2>
  <input
    v-model="name"
    id="ghName"
    type="text"
    placeholder="输入 GitHub 用户名"
  />
  <button id="btnSearchUser" :disabled="loading" @click="search">
    {{ loading ? "查询中..." : "查询" }}
  </button>
  <p id="ghResult">{{ resultText }}</p>
  <img v-if="avatar" id="ghAvatar" class="gh-avatar" :src="avatar" alt="头像" />
</template>
