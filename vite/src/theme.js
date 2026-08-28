// 深色模式：切换 body 的 dark class，并用 localStorage 记住选择
import { $ } from "./utils.js";

const KEY = "myTheme";

export function initTheme() {
  // 1. 进页面时，先读上次记住的主题
  if (localStorage.getItem(KEY) === "dark") {
    document.body.classList.add("dark");
    $("#btnTheme").textContent = "☀️ 切回白天";
  }

  // 2. 点按钮时切换主题
  $("#btnTheme").addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    $("#btnTheme").textContent = isDark ? "☀️ 切回白天" : "🌙 切换主题";
    localStorage.setItem(KEY, isDark ? "dark" : "light");
  });
}