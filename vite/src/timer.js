import { $, on } from "./utils.js";

let timerId = null;
let leftTime = 0;

function validateTimer() {
  const val = $("timerInput").value.trim();       // 拿到输入值并去空格
  const ok = /^\d+$/.test(val) && Number(val) > 0; // 纯正整数？
  $("timerInput").classList.toggle("invalid", !ok); // 非法就加红框
  $("btnStartTimer").disabled = !ok;               // 非法就禁用开始按钮
  return ok;                                       // 把"合不合法"返回给调用者
}

function startTimer() {
  if (!validateTimer()) {
    $("timerDisplay").innerText = "请输入一个正整数（秒）";
    return;
  }
  if (timerId !== null) clearInterval(timerId);

  const seconds = Number($("timerInput").value);

  leftTime = seconds;
  $("timerDisplay").innerText = leftTime + " 秒";
  timerId = setInterval(() => {
    leftTime--;
    $("timerDisplay").innerText = leftTime + " 秒";
    if (leftTime <= 0) {
      clearInterval(timerId);
      timerId = null;
      $("timerDisplay").innerText = "时间到！";
    }
  }, 1000);
}

function resetTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  leftTime = 0;
  $("timerDisplay").innerText = "0 秒";
  $("timerInput").value = "";
}

export function initTimer() {
  on("btnStartTimer", "click", startTimer);
  on("btnResetTimer", "click", resetTimer);
  on("timerInput", "input", validateTimer);   // ← 新增：每敲一个字就校验
}