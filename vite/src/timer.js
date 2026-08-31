// 倒计时器：输入秒数，开始后每秒减 1，到 0 提醒；带输入校验

import { $, on } from "./utils.js";

let timerId = null;
// ↑ 保存定时器的编号；null 表示"当前没有定时器在跑"
let leftTime = 0;
// ↑ 记录剩余秒数

function validateTimer() {
  // ↑ 校验函数：检查输入是不是合法的正整数，并实时反馈
  const val = $("timerInput").value.trim();
  // ↑ 拿到输入值并去首尾空格
  const ok = /^\d+$/.test(val) && Number(val) > 0;
  // ↑ /^\d+$/ 是正则：从头到尾全是数字；再要求转成数字后大于 0
  $("timerInput").classList.toggle("invalid", !ok);
  // ↑ 不合法就给输入框加 .invalid 类（红框）
  $("btnStartTimer").disabled = !ok;
  // ↑ 不合法就禁用"开始"按钮
  return ok;
  // ↑ 返回"合不合法"
}

function startTimer() {
  // ↑ 点"开始"时执行
  if (!validateTimer()) {
    // ↑ 先校验，不合法就提示并退出
    $("timerDisplay").innerText = "请输入一个正整数（秒）";
    return;
  }
  if (timerId !== null) clearInterval(timerId);
  // ↑ 如果之前已经有定时器在跑，先清掉，避免多个定时器叠加

  const seconds = Number($("timerInput").value);
  // ↑ 把输入的字符串转成数字

  leftTime = seconds;
  $("timerDisplay").innerText = leftTime + " 秒";
  // ↑ 先显示初始剩余秒数

  timerId = setInterval(() => {
    // ↑ 每隔 1000 毫秒（1 秒）执行一次这个函数
    leftTime--;
    // ↑ 剩余秒数减 1
    $("timerDisplay").innerText = leftTime + " 秒";
    if (leftTime <= 0) {
      // ↑ 减到 0 或以下
      clearInterval(timerId);
      // ↑ 停止定时器
      timerId = null;
      // ↑ 把编号重置为 null，方便下次重新开始
      $("timerDisplay").innerText = "时间到！";
    }
  }, 1000);
}

function resetTimer() {
  // ↑ 点"重置"时执行
  if (timerId !== null) {
    clearInterval(timerId);
    // ↑ 如果有定时器在跑，先停掉
    timerId = null;
  }
  leftTime = 0;
  $("timerDisplay").innerText = "0 秒";
  $("timerInput").value = "";
  // ↑ 清空输入框
}

export function initTimer() {
  on("btnStartTimer", "click", startTimer);
  on("btnResetTimer", "click", resetTimer);
  on("timerInput", "input", validateTimer);
  // ↑ 在输入框每敲一个字，就实时校验一次（即时给红框/禁用反馈）
}