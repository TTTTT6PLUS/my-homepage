// 这是整个主页的"入口文件"：把所有功能模块引入，并逐个启动

import "./style.css";
// ↑ 引入全局样式（Vite 会自动处理，最终打包进页面）

import { initGreet } from "./greet.js";
// ↑ 引入"打招呼/改名/换肤色"模块的启动函数
import { initQuote } from "./quote.js";
// ↑ 引入"摸鱼语录"模块
import { initTodo } from "./todo.js";
// ↑ 引入"待办清单"模块
import { initTimer } from "./timer.js";
// ↑ 引入"倒计时器"模块
import { initDraw } from "./draw.js";
// ↑ 引入"幸运抽签"模块
import { initDog } from "./dog.js";
// ↑ 引入"随机狗狗"模块
import { initGithub } from "./github.js";
// ↑ 引入"GitHub 查询"模块
import { initGuess } from "./guess.js";
// ↑ 引入"猜数字"模块
import { initTheme } from "./theme.js";
// ↑ 引入"深色模式"模块
import { initWin } from "./win.js";
// ↑ 引入"窗口宽度显示"模块

initTheme();
// ↑ 启动深色模式（先做，让主题尽快生效）
initWin();
// ↑ 启动窗口宽度显示
initGreet();
// ↑ 启动打招呼功能
initQuote();
// ↑ 启动语录功能
initTodo();
// ↑ 启动待办清单
initTimer();
// ↑ 启动倒计时
initDraw();
// ↑ 启动抽签
initDog();
// ↑ 启动狗狗
initGithub();
// ↑ 启动 GitHub 查询
initGuess();
// ↑ 启动猜数字