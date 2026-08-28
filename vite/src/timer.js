import { $, on } from "./utils.js";

let timerId = null;
let leftTime = 0;

function startTimer() {
  const seconds = Number($("timerInput").value);
  if (timerId !== null) clearInterval(timerId);

  if (isNaN(seconds) || seconds <= 0) {
    $("timerDisplay").innerText = "请输入一个正数";
    return;
  }

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
}