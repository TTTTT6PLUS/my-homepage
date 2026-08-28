import { $, on } from "./utils.js";

let secret = Math.floor(Math.random() * 100) + 1;
let guessCount = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;

function guessNumber() {
  const guess = Number($("guessInput").value);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    $("guessResult").innerText = "请输入 1~100 之间的数字";
    return;
  }
  guessCount++;
  if (guess > secret) {
    $("guessResult").innerText = guess + " 太大了，再小一点~";
  } else if (guess < secret) {
    $("guessResult").innerText = guess + " 太小了，再大一点~";
  } else {
    $("guessResult").innerText = "猜对了！你用了 " + guessCount + " 次";
    if (bestScore === 0 || guessCount < bestScore) {
      bestScore = guessCount;
      localStorage.setItem("bestScore", guessCount);
    }
    $("bestScore").innerText = "最佳成绩：" + bestScore + " 次";
  }
  $("guessInput").value = "";
}

function restartGame() {
  secret = Math.floor(Math.random() * 100) + 1;
  guessCount = 0;
  $("guessResult").innerText = "";
  $("guessInput").value = "";
}

export function initGuess() {
  on("btnGuess", "click", guessNumber);
  on("btnRestart", "click", restartGame);
  if (bestScore !== 0) {
    $("bestScore").innerText = "最佳成绩：" + bestScore + " 次";
  }
}