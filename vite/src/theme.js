// 深色模式：切换 body 上的 dark 类，并用 localStorage 记住用户的选择

import { $, loadJSON, saveJSON } from "./utils.js";

const KEY = "myTheme";
// ↑ 定一个常量 KEY，作为 localStorage 的"钥匙"名称，避免每次写错字符串

export function initTheme() {
  // ↑ 启动函数：main.js 会调用它

  // 1. 进页面时，先读上次记住的主题
  if (loadJSON(KEY, "light") === "dark") {
    document.body.classList.add("dark");
    // ↑ 给 body 加上 dark 类 → CSS 里 body.dark 那套深色变量就会生效
    $("btnTheme").textContent = "☀️ 切回白天";
    // ↑ 把按钮文字改成"切回白天"的提示
  }

  // 2. 点按钮时切换主题
  on("btnTheme", "click", () => {
    // ↑ 监听按钮点击事件
    const isDark = document.body.classList.toggle("dark");
    // ↑ toggle 会"有则删、无则加"dark 类，并返回切换后 body 是否带 dark
    $("btnTheme").textContent = isDark ? "☀️ 切回白天" : "🌙 切换主题";
    // ↑ 根据当前状态改按钮文字（三元表达式：条件 ? 真 : 假）
    saveJSON(KEY, isDark ? "dark" : "light");
  });
}