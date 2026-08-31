// 猜数字游戏：随机一个 1~100 的数，反复猜直到猜对，并记录最佳成绩

import { $, on } from "./utils.js";

let secret = Math.floor(Math.random() * 100) + 1;
// ↑ 随机生成 1~100 的秘密数字：Math.random() 取 0~1，*100 得 0~99，
//   向下取整后 +1，范围就是 1~100
let guessCount = 0;
// ↑ 记录本轮已经猜了几次
let bestScore = Number(localStorage.getItem("bestScore")) || 0;
// ↑ 从 localStorage 读回历史最佳次数；没有则 0。
//   存的是字符串，所以用 Number() 转回数字

function guessNumber() {
  // ↑ 点"猜！"时执行
  const guess = Number($("guessInput").value);
  // ↑ 把输入转成数字
  if (isNaN(guess) || guess < 1 || guess > 100) {
    // ↑ 校验：不是数字、或超出 1~100 范围
    $("guessResult").innerText = "请输入 1~100 之间的数字";
    return;
  }
  guessCount++;
  // ↑ 有效猜测，次数 +1
  if (guess > secret) {
    $("guessResult").innerText = guess + " 太大了，再小一点~";
  } else if (guess < secret) {
    $("guessResult").innerText = guess + " 太小了，再大一点~";
  } else {
    // ↑ 猜对了
    $("guessResult").innerText = "猜对了！你用了 " + guessCount + " 次";
    if (bestScore === 0 || guessCount < bestScore) {
      // ↑ 如果还没记录、或这次比历史最佳更少，就更新最佳成绩
      bestScore = guessCount;
      localStorage.setItem("bestScore", guessCount);
      // ↑ 存进 localStorage
    }
    $("bestScore").innerText = "最佳成绩：" + bestScore + " 次";
  }
  $("guessInput").value = "";
  // ↑ 猜完清空输入框
}

function restartGame() {
  // ↑ 点"重新开始"时执行
  secret = Math.floor(Math.random() * 100) + 1;
  // ↑ 重新生成一个新秘密数字
  guessCount = 0;
  // ↑ 次数归零
  $("guessResult").innerText = "";
  $("guessInput").value = "";
}

export function initGuess() {
  on("btnGuess", "click", guessNumber);
  // ↑ 绑定猜数字
  on("btnRestart", "click", restartGame);
  // ↑ 绑定重新开始
  if (bestScore !== 0) {
    // ↑ 如果有历史最佳成绩，进入页面就先显示出来
    $("bestScore").innerText = "最佳成绩：" + bestScore + " 次";
  }
}