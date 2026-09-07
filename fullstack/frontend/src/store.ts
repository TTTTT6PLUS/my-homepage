// store.ts —— 全局设置的小仓库（替代原来散落在各模块的 localStorage）
// 原版把 名字/绿肤/主题/最佳成绩 分别存在 localStorage 的不同 key 里，
// 每个模块自己读自己写，互不相通。
// 全栈版把它们统一收进一个"全局状态"（reactive 响应式对象），
// 任何组件读写它都会自动同步 UI，并且全部持久化到后端的 Setting 表。

import { reactive } from "vue";
// ↑ 从 vue 导入 reactive：把一个普通对象变成"响应式对象"，
//   谁用它，谁就会在它变化时自动刷新

import { settingApi } from "./api";
// ↑ 导入后端"键值设置"接口（读写 SQLite 里的 Setting 表）

// 全局设置对象：组件里 import 这个对象即可共享同一份状态
export const settings = reactive({
  myName: "TTTTT6",
  // ↑ 主人名字（原 localStorage 的 myName），默认 TTTTT6
  green: false,
  // ↑ 是否绿色皮肤（原 localStorage 的 green）
  dark: false,
  // ↑ 是否深色模式（原 localStorage 的 myTheme === "dark"）
  bestScore: 0,
  // ↑ 猜数字最佳成绩（原 localStorage 的 bestScore）
});

// 从后端一次性读取全部设置（页面启动时调用一次）
export async function loadSettings(): Promise<void> {
  // ↑ 异步函数：因为要请求后端
  const name = await settingApi.get("myName");
  // ↑ 读名字
  if (name.value) settings.myName = name.value;
  // ↑ 后端存过就覆盖默认值

  const green = await settingApi.get("green");
  settings.green = green.value === "true";
  // ↑ 后端 value 是字符串，比较 "true" 得到布尔值

  const theme = await settingApi.get("myTheme");
  settings.dark = theme.value === "dark";
  // ↑ 主题是 "dark" 才算深色

  const best = await settingApi.get("bestScore");
  settings.bestScore = Number(best.value || 0);
  // ↑ 最佳成绩转成数字（空串转 0）
}

// 通用"改一个设置并持久化"的帮手
export async function updateSetting<K extends keyof typeof settings>(
  key: K,
  value: (typeof settings)[K],
): Promise<void> {
  // ↑ 泛型：key 只能是 settings 的键名，value 类型与之匹配（TS 保护）
  settings[key] = value;
  // ↑ 先更新本地响应式状态（UI 立即变化）

  // 不同键转成不同的"字符串存储格式"
  let stored = String(value);
  // ↑ 默认直接转字符串
  if (key === "dark") stored = value ? "dark" : "light";
  // ↑ 主题特殊：存 "dark" / "light"
  await settingApi.set(key, stored);
  // ↑ 写入后端 SQLite（异步等待，确保落库）
}
