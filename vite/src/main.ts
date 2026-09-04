// 这是整个主页的"入口文件"：把所有功能模块引入，并逐个启动

import "./style.css";
// ↑ 引入全局样式（Vite 会自动处理，最终打包进页面）
import { on, lazyInit } from "./utils";
// ↑ 引入 on（绑事件）和 lazyInit（懒加载）两个工具
import { initShortcut } from "./shortcut";
// ↑ 引入键盘快捷键模块
import { initGreet } from "./greet";
// ↑ 引入"打招呼/改名/换肤色"模块的启动函数
import { initQuote } from "./quote";
// ↑ 引入"摸鱼语录"模块
import { initTodo } from "./todo";
// ↑ 引入"待办清单"模块
import { initDraw } from "./draw";
// ↑ 引入"幸运抽签"模块
import { initGuess } from "./guess";
// ↑ 引入"猜数字"模块
import { initTheme } from "./theme";
// ↑ 引入"深色模式"模块
import { initWin } from "./win";
// ↑ 引入"窗口宽度显示"模块
import { initReveal } from "./reveal";
// ↑ 引入滚动显现模块
import { initBackup } from "./backup";
// ↑ 引入数据打包模块
import { initPwa } from "./pwa";
// ↑ 引入 PWA（离线应用）模块
import { initBoard } from "./board";
// ↑ 引入"涂鸦板"模块。注意：改成了省略扩展名的写法（原 "./board.js"），
//   因为文件已迁移为 board.ts，让解析器自动去找 .ts 版本
import { initTTS } from "./tts";
// ↑ 引入"语音朗读"模块
import { initGame } from "./fish";
// ↑ 引入"接小鱼游戏"模块
import { initSkillChart } from "./skill";
// ↑ 引入"技能图"模块（Chart.js 数据可视化）
import { initPiano } from "./audio";
// ↑ 引入"迷你电子琴"模块

initTheme();
// ↑ 启动深色模式（先做，让主题尽快生效）
initWin();
// ↑ 启动窗口宽度显示
initReveal();
// ↑ 启动滚动显现动画
initGreet();
// ↑ 启动打招呼功能
initQuote();
// ↑ 启动语录功能
initTodo();
// ↑ 启动待办清单
initDraw();
// ↑ 启动抽签
initGuess();
// ↑ 启动猜数字
initShortcut();
// ↑ 启动键盘快捷键
initBackup();
// ↑ 启动数据备份
initPwa();
// ↑ 注册 Service Worker，让主页可离线访问
initBoard();
// ↑ 启动涂鸦板
initTTS();
// ↑ 启动语音朗读
initGame();
// ↑ 启动接小鱼游戏
initSkillChart();
// ↑ 启动技能图
initPiano();
// ↑ 启动迷你电子琴

// ===== 懒加载：点按钮才下载对应模块 =====
const bootDog = lazyInit(() => import("./dog").then((m) => m.initDog()));
// ↑ 造一个狗狗模块的"懒启动器"：第一次被调用时才去 import 并 initDog
on("btnDog", "click", bootDog);
// ↑ 点"来一只狗狗"按钮 → 触发懒启动器（第一次会下载代码并初始化）
// 倒计时（点"开始/重置"或输入秒数才加载）
const bootTimer = lazyInit(() => import("./timer").then((m) => m.initTimer()));
// ↑ 造倒计时模块的懒启动器
on("btnStartTimer", "click", bootTimer);
// ↑ 点"开始"按钮触发
on("btnResetTimer", "click", bootTimer);
// ↑ 点"重置"按钮触发（防止用户先点重置）
on("timerInput", "input", bootTimer);
// ↑ 一输入秒数也触发（保证输入校验的实时红框能接上）
// GitHub 查询（点"查询"或开始输入才加载）
const bootGithub = lazyInit(() =>
  import("./github").then((m) => m.initGithub()),
);
// ↑ 造 GitHub 模块的懒启动器
on("btnSearchUser", "click", bootGithub);
// ↑ 点"查询"按钮触发
on("ghName", "input", bootGithub);
// ↑ 一输入用户名就触发（这样防抖搜索才能接上）
