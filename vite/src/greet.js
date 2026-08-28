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

function useInput() {
  const name = $("nameInput").value.trim();
  if (!name) return;
  $("myName").innerText = "你好，我是" + name;
  $("nameInput").value = "";
}

export function initGreet() {
  on("btnHello", "click", sayHello);
  on("btnRename", "click", changeName);
  on("btnSkin", "click", changeColor);
  on("btnConfirmName", "click", useInput);
}