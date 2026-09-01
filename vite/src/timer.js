// 倒计时器：输入秒数，开始后每秒减 1，到 0 提醒；带输入校验

import { $, on, validateField } from "./utils.js";

class Timer {
  // ↑ 用 class 声明一个"类"，就好比一张"倒计时器图纸"（模具）
  constructor() {
    // ↑ 构造器：每次 new Timer() 时自动执行一次，负责给这个实例初始化
    this.timerId = null;
    // ↑ this 指向"当前造出来的那个实例"，this.timerId 是它自己的定时器编号
    this.leftTime = 0;
    // ↑ this.leftTime 是它自己的剩余秒数
  }


  validateTimer() {
    return validateField("timerInput", "btnStartTimer", (val) =>
      /^\d+$/.test(val) && Number(val) > 0
    );
  }

  startTimer() {
    if (!this.validateTimer()) {
      // ↑ 方法里调用另一个方法，记得加 this. 前缀
      $("timerDisplay").innerText = "请输入一个正整数（秒）";
      return;
    }
    if (this.timerId !== null) clearInterval(this.timerId);
    // ↑ 原来的 timerId 现在都换成 this.timerId
    const seconds = Number($("timerInput").value);
    this.leftTime = seconds;
    // ↑ leftTime 换成 this.leftTime
    $("timerDisplay").innerText = this.leftTime + " 秒";

    this.timerId = setInterval(() => {
      // ↑ 箭头函数：this 不会被改变，仍然指向"这个实例"
      this.leftTime--;
      $("timerDisplay").innerText = this.leftTime + " 秒";
      if (this.leftTime <= 0) {
        clearInterval(this.timerId);
        this.timerId = null;
        $("timerDisplay").innerText = "时间到！";
      }
    }, 1000);
  }

  resetTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.leftTime = 0;
    $("timerDisplay").innerText = "0 秒";
    $("timerInput").value = "";
  }
}

export function initTimer() {
  const timer = new Timer();
  // ↑ new Timer() = 用"模具"压出实例，同时自动执行 constructor 完成初始化
  on("btnStartTimer", "click", () => timer.startTimer());
  // ↑ 点"开始"：用箭头函数包一层，调用这个实例的 startTimer 方法
  on("btnResetTimer", "click", () => timer.resetTimer());
  // ↑ 点"重置"：调用实例的 resetTimer 方法
  on("timerInput", "input", () => timer.validateTimer());
  // ↑ 输入时：调用实例的 validateTimer 方法（实时红框/禁用反馈）
}