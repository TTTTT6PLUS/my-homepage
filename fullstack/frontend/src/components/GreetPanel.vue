<script setup lang="ts">
// GreetPanel.vue —— 打招呼 / 改名 / 换肤色（对应原 greet.ts）
// 数据来源：store → Django Setting 表（原来存 localStorage 的 myName/green）

import { ref } from "vue";
// ↑ ref：响应式数据

import { settings, updateSetting } from "../store";
// ↑ 全局设置 store

const showInput = ref(false);
// ↑ 是否显示改名输入框

const nameInput = ref("");
// ↑ 输入框内容

function sayHello(): void {
  // ↑ 打招呼
  alert("你好呀！欢迎来到我的主页~");
}

function rename(): void {
  // ↑ 点"改个名字"：弹出输入框让用户填
  showInput.value = true;
  nameInput.value = "";
}

function confirmName(): void {
  // ↑ 确认改名
  const name = nameInput.value.trim();
  // ↑ 去首尾空格
  if (!name || name.length > 20) return;
  // ↑ 空或超长不处理
  updateSetting("myName", name);
  // ↑ 写入 store 并同步后端
  showInput.value = false;
  // ↑ 收起草稿输入框
}

function changeColor(): void {
  // ↑ 换肤色：绿 ↔ 蓝
  settings.green = !settings.green;
  // ↑ 只翻转 store；App.vue 的 watch 会自动给 body 加类并持久化到后端
}
</script>

<template>
  <h2>来玩一下</h2>

  <button id="btnHello" @click="sayHello">点我打招呼</button>
  <button id="btnRename" @click="rename">改个名字</button>
  <button id="btnSkin" @click="changeColor">换个肤色</button>

  <!-- 改名输入区：点"改个名字"后才出现 -->
  <div v-if="showInput" class="rename-box">
    <input
      v-model="nameInput"
      type="text"
      placeholder="输入你的新名字"
      maxlength="20"
      @keyup.enter="confirmName"
    />
    <button id="btnConfirmName" @click="confirmName">确认</button>
  </div>
</template>

<style scoped>
.rename-box {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
</style>
