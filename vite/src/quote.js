import { $, on } from "./utils.js";

const quotes = [
  "摸鱼一时爽，一直摸鱼一直爽",
  "写代码累了，就喝口水歇一歇",
  "今天的你，也很棒哦",
  "白饭是世界上最美好的东西",
  "吃白饭的蓝色大肥鱼我爱你"
];

function randomQuote() {
  const i = Math.floor(Math.random() * quotes.length);
  $("quoteText").innerText = quotes[i];
}

export function initQuote() {
  on("btnQuote", "click", randomQuote);
}