// 打招呼 / 改名 / 换肤色：三个小功能 + 姓名与肤色的本地持久化

import { $, on } from "./utils.js";
// ↑ 引入 $（找元素）和 on（绑事件）两个工具

let isGreen = false;
// ↑ 记录"现在是不是绿色皮肤"；初始为 false（默认蓝白配色）

function sayHello() {
  alert("你好呀！欢迎来到我的主页~");
  // ↑ 弹出一个系统提示框打招呼
}

function changeName() {
  $("myName").innerText = "你好，我是TTTTT6！";
  // ↑ 把名字标题改回默认的 TTTTT6（相当于"重置名字"）
  localStorage.removeItem("myName");
  // ↑ 同时删掉 storage 里存的名字，否则刷新后又会变回自定义名字
}

function changeColor() {
  isGreen = !isGreen;
  // ↑ 翻转绿色开关：true↔false 来回切换
  document.body.classList.toggle("green", isGreen);
  // ↑ 根据状态给 body 加/去 green 类（CSS 里 body.green 换绿色背景）
  localStorage.setItem("green", isGreen ? "1" : "0");
  // ↑ 把布尔值转成字符串 "1"/"0" 存起来，下次进入恢复
}

function validateName() {
  // ↑ 校验函数：检查输入的名字合不合法，并实时反馈
  const name = $("nameInput").value.trim();
  // ↑ 拿到输入框内容，trim() 去掉首尾空格
  const tooLong = name.length > 20;
  // ↑ 名字超过 20 个字符就算"太长"
  const ok = name.length >= 1 && !tooLong;
  // ↑ 合法标准：非空 且 不超长
  $("nameInput").classList.toggle("invalid", tooLong);
  // ↑ 超长就给输入框加 .invalid 类（红框提示）
  $("btnConfirmName").disabled = !ok;
  // ↑ 不合法就禁用"确认改名"按钮，防止提交坏数据
  return ok;
  // ↑ 把"合不合法"返回给调用者
}

function useInput() {
  // ↑ 点击"确认改名"时执行
  if (!validateName()) return;
  // ↑ 先校验，不合法就直接 return，啥也不做
  const name = $("nameInput").value.trim();
  $("myName").innerText = "你好，我是" + name;
  // ↑ 把标题改成"你好，我是XXX"
  localStorage.setItem("myName", name);
  // ↑ 把新名字存进 localStorage，刷新后不丢失
  $("nameInput").value = "";
  // ↑ 清空输入框
  validateName();
  // ↑ 再次校验一次，让按钮回到"禁用"状态
}

export function initGreet() {
  // ↑ 启动函数：main.js 会调用它

  const saved = localStorage.getItem("myName");
  // ↑ 读回上次存的名字（没有则是 null）
  if (saved) $("myName").innerText = "你好，我是" + saved;
  // ↑ 如果有存过名字，就恢复显示它

  isGreen = localStorage.getItem("green") === "1";
  // ↑ 读回肤色：等于 "1" 表示上次是绿色
  document.body.classList.toggle("green", isGreen);
  // ↑ 根据读回的状态还原绿色皮肤

  on("btnHello", "click", sayHello);
  // ↑ 绑定：点"打招呼"按钮 → 弹提示框
  on("btnRename", "click", changeName);
  on("btnSkin", "click", changeColor);
  on("btnConfirmName", "click", useInput);
  on("nameInput", "input", validateName);
  // ↑ 绑定：在名字输入框每敲一个字，就实时校验一次
}