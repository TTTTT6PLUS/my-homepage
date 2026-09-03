// 接住小鱼 · 小游戏：requestAnimationFrame 游戏循环 + Canvas 绘制 + 碰撞检测
// 玩法：鼠标控制底部鲸鱼左右移动，接住掉落的小鱼；漏 3 条游戏结束

import { $, on } from "./utils.js";
// ↑ 引入 $（找元素）、on（绑事件）
import { playNote } from "./audio.js";
// ↑ 引入电子琴的"发声器"，给游戏配音效（第 39 关新增）

const canvas = $("fishCanvas");
// ↑ 游戏画布
const ctx = canvas.getContext("2d");
// ↑ 2D 画笔（第 35 关涂鸦板的老朋友）

const W = canvas.width;   // 720：画布逻辑宽度
const H = canvas.height;  // 360：画布逻辑高度
// ↑ 游戏里所有坐标都按这个内部尺寸算，鼠标坐标再换算进来

const bucket = { x: W / 2 - 40, w: 80, h: 26, y: H - 34 };
// ↑ 鲸鱼（接鱼的桶）：x 是它左边缘，后面鼠标一动就改 x；
//   w/h 是宽高，y 固定在底部（H-34）

const FISH_COLORS = ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#ef4444"];
// ↑ 小鱼可选的几种颜色，每次随机挑一条

let fishes = [];
// ↑ 存放"正在下落的小鱼"的数组，每帧遍历更新它们
let score = 0;
// ↑ 得分
let lives = 3;
// ↑ 剩余生命
let over = false;
// ↑ 是否游戏结束
let lastT = 0;
// ↑ 上一帧的时间戳（算帧间隔 deltaTime 用）
let spawnTimer = 0;
// ↑ 距离下一条鱼出生的累计时间
let spawnGap = 1;
// ↑ 每多少秒生一条鱼（分数越高越短，游戏越难）
let rafId = null;
// ↑ requestAnimationFrame 的句柄，保证循环只启动一次

function makeFish() {
  // ↑ 生一条新鱼（掉进数组）
  fishes.push({
    x: 20 + Math.random() * (W - 40),
    // ↑ 出生横坐标：画布中间随机，避免贴边
    y: -15,
    // ↑ 出生在画布顶部的"屏幕外"，缓缓落进来
    r: 10 + Math.random() * 4,
    // ↑ 鱼身半径 10~14 随机
    speed: 130 + Math.random() * 100,
    // ↑ 下落速度 130~230 像素/秒 随机
    color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
    // ↑ 从颜色表里随机挑一个
    dead: false,
    // ↑ 标记这条鱼"已处理完"（接住或漏掉），这帧结尾统一删除
  });
}

function drawFish(f) {
  // ↑ 画一条小鱼：身体椭圆 + 眼睛 + 尾巴三角
  ctx.fillStyle = f.color;
  // ↑ 身体颜色
  ctx.beginPath();
  ctx.ellipse(f.x, f.y, f.r, f.r * 0.6, 0, 0, Math.PI * 2);
  // ↑ 椭圆鱼身：横半径 r、竖半径 0.6r
  ctx.fill();
  // ↑ 上色
  ctx.beginPath();
  ctx.moveTo(f.x - f.r, f.y);
  // ↑ 尾巴从鱼身后部起笔
  ctx.lineTo(f.x - f.r - 8, f.y - 6);
  ctx.lineTo(f.x - f.r - 8, f.y + 6);
  ctx.closePath();
  // ↑ 两个点连回起点，构成一个小三角
  ctx.fill();
  // ↑ 尾巴也填同色
  ctx.fillStyle = "#ffffff";
  // ↑ 眼睛用白色
  ctx.beginPath();
  ctx.arc(f.x + f.r * 0.45, f.y - f.r * 0.15, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // ↑ 在鱼头方向点个小白眼珠
}

function drawWhale() {
  // ↑ 画底部鲸鱼（会动的"接鱼桶"）
  const cx = bucket.x + bucket.w / 2;
  // ↑ 鲸鱼中心 x
  const cy = bucket.y + bucket.h / 2;
  // ↑ 鲸鱼中心 y
  ctx.fillStyle = "#1e40af";
  // ↑ 深蓝画尾巴
  ctx.beginPath();
  ctx.moveTo(bucket.x, cy);
  // ↑ 尾巴从身体左缘伸出
  ctx.lineTo(bucket.x - 16, cy - 9);
  ctx.lineTo(bucket.x - 16, cy + 9);
  ctx.closePath();
  ctx.fill();
  // ↑ 左侧小三角尾巴
  ctx.fillStyle = "#2563eb";
  // ↑ 主蓝画身体
  ctx.beginPath();
  ctx.ellipse(cx, cy, bucket.w / 2, bucket.h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // ↑ 鲸鱼身体 = 横扁椭圆
  ctx.fillStyle = "#bfdbfe";
  // ↑ 浅蓝画肚皮
  ctx.beginPath();
  ctx.ellipse(cx - bucket.w * 0.08, cy + bucket.h * 0.12, bucket.w * 0.3, bucket.h * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  // ↑ 肚皮是身体里靠下的小椭圆
  ctx.fillStyle = "#0f172a";
  // ↑ 深色画眼睛（头朝右，眼睛靠右）
  ctx.beginPath();
  ctx.arc(bucket.x + bucket.w - 10, cy - 5, 3, 0, Math.PI * 2);
  ctx.fill();
}

function updateScore() {
  $("fishScore").textContent = score;
  // ↑ 把得分数字同步到页面上
}

function updateLives() {
  $("fishLives").textContent = lives;
  // ↑ 把生命数字同步到页面上
}

function endGame() {
  // ↑ 游戏结束：停在当前画面，不再更新
  over = true;
  // ↑ 置结束标记，loop 里会跳过鱼的更新
  $("fishStatus").textContent = "💀 游戏结束啦！点下面按钮重开一局~";
  // ↑ 页面提示换成结束文案
}

function render() {
  // ↑ 重绘整帧画面（每帧都会被调用）
  ctx.fillStyle = "#e0f2fe";
  // ↑ 海蓝背景
  ctx.fillRect(0, 0, W, H);
  // ↑ 铺满整个画布（顺带擦掉上一帧的旧画面）

  fishes.forEach(drawFish);
  // ↑ 把当前所有小鱼画出来
  drawWhale();
  // ↑ 画鲸鱼

  if (over) {
    // ↑ 游戏结束时盖一层半透明"结算"文字
    ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
    // ↑ 半透明深色遮罩
    ctx.fillRect(0, 0, W, H);
    // ↑ 盖住整个画面
    ctx.fillStyle = "#ffffff";
    // ↑ 白色文字
    ctx.font = "bold 36px sans-serif";
    // ↑ 大字标题
    ctx.textAlign = "center";
    // ↑ 文字居中
    ctx.fillText("游戏结束", W / 2, H / 2 - 12);
    // ↑ 主标题
    ctx.font = "16px sans-serif";
    ctx.fillText(`得分 ${score}，点下方按钮重新开始`, W / 2, H / 2 + 24);
    // ↑ 副标题带最终得分
  }
}

function loop(t) {
  // ↑ 游戏主循环：浏览器每帧（约 1/60 秒）调用一次
  const dt = lastT ? (t - lastT) / 1000 : 0;
  // ↑ 本帧距上一帧的时间（秒）。首帧 lastT=0 会算出巨值，所以给 0 兜底
  lastT = t;
  // ↑ 记住这一帧的时间，下一帧才能算 deltaTime

  if (!over) {
    // ↑ 游戏没结束时才更新逻辑
    spawnTimer += dt;
    // ↑ 累计出生计时
    if (spawnTimer >= spawnGap) {
      // ↑ 攒够间隔时间
      spawnTimer -= spawnGap;
      // ↑ 扣掉这段间隔（保留余量，避免累计误差）
      makeFish();
      // ↑ 生一条鱼
    }

    fishes.forEach((f) => {
      // ↑ 每条鱼都更新
      f.y += f.speed * dt;
      // ↑ 往下落：位移 = 速度 × 时间。用 dt 算，任何帧率下速度都一致
      if (f.y >= bucket.y - f.r) {
        // ↑ 鱼落到鲸鱼那一行（y 到鲸鱼上沿）
        if (f.x > bucket.x - 6 && f.x < bucket.x + bucket.w + 6) {
          // ↑ 且横坐标落在鲸鱼身体范围内 → 接住！
          score += 1;
          // ↑ 加一分
          playNote(880, 0.12);
          // ↑ 播"叮"：880Hz（高音 A）短促一下，庆祝接住
          spawnGap = Math.max(0.4, spawnGap * 0.97);
          // ↑ 略微缩短出生间隔，游戏越来越难（下限 0.4 秒）
          updateScore();
          // ↑ 刷新页面分数
        } else {
          // ↑ 没接住，漏了
          lives -= 1;
          // ↑ 扣一条命
          playNote(150, 0.25);
          // ↑ 播"嘟"：150Hz（低音）拉长一点，提示漏鱼
          updateLives();
          // ↑ 刷新页面生命数
          if (lives <= 0) endGame();
          // ↑ 命扣完 → 游戏结束
        }
        f.dead = true;
        // ↑ 标记这条鱼"处理完了"，下面统一从数组移除
      }
    });
    fishes = fishes.filter((f) => !f.dead);
    // ↑ 甩掉所有 dead 的鱼（接住的、漏掉的），数组保持干净
  }

  render();
  // ↑ 每帧都重绘
  requestAnimationFrame(loop);
  // ↑ 预约下一帧——循环永不间断
}

function restart() {
  // ↑ 重新开始：把所有状态打回出厂设置
  fishes = [];
  // ↑ 清空所有下落中的鱼
  score = 0;
  lives = 3;
  over = false;
  spawnTimer = 0;
  spawnGap = 1;
  // ↑ 各项归零 / 归默认
  bucket.x = W / 2 - bucket.w / 2;
  // ↑ 鲸鱼回到底部中央
  $("fishStatus").textContent = "🐟 移动鼠标接小鱼，漏 3 条就结束！";
  // ↑ 状态文字复原
  updateScore();
  updateLives();
  // ↑ 页面数字复原
  if (!rafId) {
    // ↑ 循环还没启动过才启动（防止点多次重开按钮开出多个循环）
    rafId = requestAnimationFrame(loop);
    // ↑ 踩下游戏循环的油门
  }
}

export function initGame() {
  // ↑ 启动函数：main.js 调用
  canvas.addEventListener("pointermove", (e) => {
    // ↑ 鼠标在画布上移动时控制鲸鱼（pointermove 鼠标触屏通用）
    const rect = canvas.getBoundingClientRect();
    // ↑ 画布实际显示位置（CSS 可能被缩放）
    const x = ((e.clientX - rect.left) * W) / rect.width;
    // ↑ 屏幕坐标换算成画布内部坐标（第 35 关同款公式）
    bucket.x = Math.max(0, Math.min(x - bucket.w / 2, W - bucket.w));
    // ↑ 让鲸鱼中心对准鼠标，并夹在画布左右边界内（min/max 夹逼）
  });
  on("btnFishRestart", "click", restart);
  // ↑ 点"重新开始"→ restart
  restart();
  // ↑ 初始化游戏（顺便启动唯一一次循环）
}
