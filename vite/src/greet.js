import { $, on } from "./utils.js";

let isGreen = false;

function sayHello() {
  alert("你好呀！欢迎来到我的主页~");
}

function changeName() {
  $("myName").innerText = "你好，我是TTTTT6！";
}

function changeColor() {
  isGreen = !isGreen;
  document.body.classList.toggle("green", isGreen);
}

function validateName() {
  const name = $("nameInput").value.trim();
  const tooLong = name.length > 20;                  // 超长 → 算"错误"
  const ok = name.length >= 1 && !tooLong;           // 非空 且 不超长 才算合法
  $("nameInput").classList.toggle("invalid", tooLong); // 只有超长才加红框
  $("btnConfirmName").disabled = !ok;                  // 空 或 超长 都禁用按钮
  return ok;
}

function useInput() {
  if (!validateName()) return;              // 用校验函数统一拦
  const name = $("nameInput").value.trim();
  $("myName").innerText = "你好，我是" + name;
  $("nameInput").value = "";
  validateName();                           // 清空后让按钮回到禁用状态
}

export function initGreet() {
  on("btnHello", "click", sayHello);
  on("btnRename", "click", changeName);
  on("btnSkin", "click", changeColor);
  on("btnConfirmName", "click", useInput);
  on("nameInput", "input", validateName);   // ← 新增：每敲一个字就校验
}