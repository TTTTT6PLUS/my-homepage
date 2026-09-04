// 随机摸鱼语录：点按钮抽一句话显示，还能一键复制到剪贴板

import { $, on, notify } from "./utils";
// ↑ 现在也从公共工具里"借"一个 notify 进来

const quotes: string[] = [
  // ↑ 定义语录数组，里面是 5 条字符串
  "摸鱼一时爽，一直摸鱼一直爽",
  "写代码累了，就喝口水歇一歇",
  "今天的你，也很棒哦",
  "白饭是世界上最美好的东西",
  "吃白饭的蓝色大肥鱼我爱你",
];

function randomQuote(): void {
  // ↑ 抽语录的核心函数
  const i = Math.floor(Math.random() * quotes.length);
  // ↑ 得到 0~4 的随机下标
  $("quoteText").innerText = quotes[i];
  // ↑ 把抽中的文字写进页面
}

function copyQuote(): void {
  // ↑ 把当前显示的语录复制进剪贴板
  const text = $("quoteText").innerText;
  // ↑ 先读出 quoteText 里现在显示的文字
  navigator.clipboard.writeText(text).then(() => {
    // ↑ 写进剪贴板；成功后执行 then 里的回调
    notify("复制成功", "语录已复制到剪贴板~");
    // ↑ （改动）这里不再是 alert 了，改成调用咱们自己写的 notify
  });
}

export function initQuote(): void {
  on("btnQuote", "click", randomQuote);
  // ↑ 点"随机摸鱼语录"→ 抽一句
  on("btnCopyQuote", "click", copyQuote);
  // ↑ 点"复制语录"→ 复制 + 弹通知
}
