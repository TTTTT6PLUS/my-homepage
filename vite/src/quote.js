// 随机摸鱼语录：点按钮，从数组里随便抽一句话显示

import { $, on } from "./utils.js";
// ↑ 引入二个工具函数

const quotes = [
  // ↑ 定义语录数组，里面是 5 条字符串
  "摸鱼一时爽，一直摸鱼一直爽",
  "写代码累了，就喝口水歇一歇",
  "今天的你，也很棒哦",
  "白饭是世界上最美好的东西",
  "吃白饭的蓝色大肥鱼我爱你"
];

function randomQuote() {
  // ↑ 抽语录的核心函数
  const i = Math.floor(Math.random() * quotes.length);
  // ↑ Math.random() 返回 0~1 的随机小数；乘以数组长度再向下取整，
  //   就得到一个合法的随机下标（0 到 4 之间）
  $("quoteText").innerText = quotes[i];
  // ↑ 把抽中的那句写进页面上的 quoteText 元素
}

export function initQuote() {
  on("btnQuote", "click", randomQuote);
  // ↑ 绑定：点"随机摸鱼语录"按钮 → 执行抽语录
}