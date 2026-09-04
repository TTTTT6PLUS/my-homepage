import { $, on, loadJSON, saveJSON, removeKey, validateField } from "./utils";

const KEY_NAME = "myName";
const KEY_GREEN = "green";

let isGreen = false;
// ↑ 记录"现在是不是绿色皮肤"；初始为 false（默认蓝白配色）

function sayHello(): void {
  alert("你好呀！欢迎来到我的主页~");
  // ↑ 弹出一个系统提示框打招呼
}

function changeName(): void {
  $("myName").innerText = "你好，我是TTTTT6！";
  // ↑ 把名字标题改回默认的 TTTTT6（相当于"重置名字"）
  removeKey(KEY_NAME);
}

function changeColor(): void {
  isGreen = !isGreen;
  // ↑ 翻转绿色开关：true↔false 来回切换
  document.body.classList.toggle("green", isGreen);
  // ↑ 根据状态给 body 加/去 green 类（CSS 里 body.green 换绿色背景）
  saveJSON(KEY_GREEN, isGreen);
}

function validateName(): boolean {
  return validateField(
    "nameInput",
    "btnConfirmName",
    (name) => name.length >= 1 && name.length <= 20,
  );
}

function useInput(): void {
  // ↑ 点击"确认改名"时执行
  if (!validateName()) return;
  // ↑ 先校验，不合法就直接 return，啥也不做
  const name = $<HTMLInputElement>("nameInput").value.trim();
  $("myName").innerText = "你好，我是" + name;
  // ↑ 把标题改成"你好，我是XXX"
  saveJSON(KEY_NAME, name);
  $<HTMLInputElement>("nameInput").value = "";
  // ↑ 清空输入框
  validateName();
  // ↑ 再次校验一次，让按钮回到"禁用"状态
}

export function initGreet(): void {
  // ↑ 启动函数：main.js 会调用它

  const saved = loadJSON(KEY_NAME);
  if (saved) $("myName").innerText = "你好，我是" + saved;

  isGreen = loadJSON(KEY_GREEN, false);
  document.body.classList.toggle("green", isGreen);
  // ↑ 根据读回的状态，把 green 类真正加到 body 上，还原绿色皮肤

  on("btnHello", "click", sayHello);
  // ↑ 绑定：点"打招呼"按钮 → 弹提示框
  on("btnRename", "click", changeName);
  on("btnSkin", "click", changeColor);
  on("btnConfirmName", "click", useInput);
  on("nameInput", "input", validateName);
  // ↑ 绑定：在名字输入框每敲一个字，就实时校验一次
}
