<script setup lang="ts">
// DrawPanel.vue —— 幸运抽签（对应原 draw.ts）
// 原版名单存 localStorage 的 pool 数组；现在存 Django 的 pool 表（一行一个名字）。

import { ref, onMounted } from "vue";
// ↑ ref 响应式；onMounted 挂载回调

import { poolApi } from "../api";
// ↑ 抽签名单接口
import type { PoolName } from "../api";
// ↑ 类型

const pool = ref<PoolName[]>([]);
// ↑ 名单

const input = ref("");
// ↑ 输入框

const result = ref("点「开始抽签」试试手气~");
// ↑ 抽签结果文字

async function load(): Promise<void> {
  pool.value = await poolApi.list();
}

async function addName(): Promise<void> {
  const name = input.value.trim();
  if (!name) return;
  await poolApi.create(name);
  input.value = "";
  await load();
}

async function removeName(item: PoolName): Promise<void> {
  await poolApi.remove(item.id);
  await load();
}

function startDraw(): void {
  // ↑ 模拟 2 秒"抽签过程"后揭晓
  if (pool.value.length === 0) {
    result.value = "名单是空的，先加几个人吧";
    return;
  }
  result.value = "抽签中...";
  setTimeout(() => {
    // ↑ 延迟 2 秒揭晓，更有仪式感
    const hit = pool.value[Math.floor(Math.random() * pool.value.length)];
    // ↑ 随机选一个
    result.value = `恭喜 🎉 ${hit.name} 中奖！`;
  }, 2000);
}

onMounted(load);
// ↑ 进入页面先拉名单
</script>

<template>
  <h2>幸运抽签</h2>
  <input
    v-model="input"
    id="namePool"
    type="text"
    placeholder="输入一个名字"
    @keyup.enter="addName"
  />
  <button id="btnAddName" @click="addName">加入名单</button>
  <button id="btnDraw" @click="startDraw">开始抽签</button>
  <p id="drawResult">{{ result }}</p>

  <ul id="poolList">
    <li v-for="item in pool" :key="item.id">
      {{ item.name }}
      <button class="btn-sm btn-del" @click="removeName(item)">删除</button>
    </li>
  </ul>
  <p v-if="pool.length === 0" class="empty">名单空空，先加几个人吧~</p>
</template>

<style scoped>
.empty {
  color: var(--text);
  font-size: 13px;
  opacity: 0.6;
}
#poolList li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
