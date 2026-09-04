// 键盘快捷键：/ 聚焦搜索、Ctrl+Enter 快速加待办、? 打开帮助、Esc 关闭帮助

import { $, on } from "./utils";
// ↑ 多借一个 on 进来（用来给"知道了"按钮绑关闭）

export function initShortcut(): void {
  on("btnCloseHelp", "click", () => {
    // ↑ 点"知道了"按钮，关闭帮助面板
    $("shortcutHelp").classList.add("hidden");
  });

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    // ↑ 整页监听"按下键盘"
    const target = e.target as HTMLElement;
    const inInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
    // ↑ 焦点是否在输入框/文本域里

    if (e.key === "Escape") {
      // ↑ ① 按 Esc：关闭帮助面板（任何时候都生效）
      $("shortcutHelp").classList.add("hidden");
      return;
    }

    if (e.key === "?" && !inInput) {
      // ↑ ② 按 ?：打开帮助面板（焦点不在输入框才弹，避免打字输 ? 时误弹）
      e.preventDefault();
      $("shortcutHelp").classList.remove("hidden");
      return;
    }

    if (e.key === "/" && !inInput) {
      // ↑ ③ 按 /：聚焦 GitHub 搜索框
      e.preventDefault();
      $<HTMLInputElement>("ghName").focus();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      // ↑ ④ 按着 Ctrl（或 Mac 的 Cmd）再按回车
      if (document.activeElement === $<HTMLInputElement>("todoInput")) {
        // ↑ 只有当前焦点在待办输入框里，才快速添加
        e.preventDefault();
        $("btnAddTodo").click();
        // ↑ 用 .click() 触发"添加"按钮，等于真的点了一下
      }
    }
  });
}
