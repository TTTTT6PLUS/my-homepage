<script setup lang="ts">
// BackupPanel.vue —— 数据备份（对应原 backup.ts，适配全栈版）
// 原版把 localStorage 数据导出/导入 JSON 文件；
// 全栈版数据在后端 SQLite，这里改为：
//   「导出」= 把后端所有表数据拉下来存成 JSON 文件
//   「导入」= 从一个 JSON 文件恢复（调用后端各 create 接口）

import { ref } from "vue";
// ↑ ref 响应式

import { todoApi, poolApi, quoteApi, settingApi } from "../api";
// ↑ 各数据接口
import type { Todo, Quote, PoolName } from "../api";
// ↑ 类型

const msg = ref("");
// ↑ 操作提示

const fileInput = ref<HTMLInputElement | null>(null);
// ↑ 隐藏的文件输入框引用

async function exportData(): Promise<void> {
  // ↑ 导出：汇总后端全部数据成一个 JSON 文件
  try {
    const [todos, pool, quotes, myName] = await Promise.all([
      todoApi.list(),
      poolApi.list(),
      quoteApi.list().catch(() => [] as Quote[]),
      settingApi.get("myName"),
    ]);
    // ↑ 并行拉取各表数据
    const payload = { todos, pool, quotes, myName: myName.value };
    // ↑ 组装成备份对象
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    // ↑ 转成文件内容
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-homepage-fullstack-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    msg.value = "✅ 已导出备份文件（服务器数据）";
  } catch {
    msg.value = "❌ 导出失败，检查后端是否启动";
  }
}

function triggerImport(): void {
  // ↑ 点导入按钮 → 触发隐藏文件框
  fileInput.value?.click();
}

async function importFile(e: Event): Promise<void> {
  // ↑ 用户选好文件后恢复
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text()) as {
      todos: Todo[];
      pool: PoolName[];
      quotes: Quote[];
      myName?: string;
    };
    // ↑ 读取并解析备份 JSON
    for (const t of data.todos ?? []) await todoApi.create(t.title);
    // ↑ 恢复待办（逐条 create）
    for (const p of data.pool ?? []) await poolApi.create(p.name);
    // ↑ 恢复名单
    if (data.myName) await settingApi.set("myName", data.myName);
    // ↑ 恢复名字设置
    msg.value = "✅ 导入完成（语录请到 Django 后台管理），刷新页面查看";
  } catch {
    msg.value = "❌ 导入失败：文件不是合法的备份 JSON";
  } finally {
    input.value = "";
  }
}
</script>

<template>
  <h2>数据备份（全栈版）</h2>
  <p class="intro">数据现在存在服务器 SQLite 数据库里；仍可导出/导入 JSON 快照~</p>
  <button id="btnExportData" @click="exportData">📥 导出数据</button>
  <button id="btnImportData" @click="triggerImport">📤 导入数据</button>
  <input
    ref="fileInput"
    type="file"
    accept=".json"
    class="hidden"
    @change="importFile"
  />
  <p class="msg">{{ msg }}</p>
</template>

<style scoped>
.msg {
  color: var(--text);
  font-size: 13px;
  min-height: 1.4em;
}
</style>
