// 涂鸦板：在 <canvas> 画布上用鼠标/手指画画，可换颜色、清空、导出 PNG
// 核心技术：Canvas 2D 画笔（ctx）+ Pointer Events（指针事件，鼠标触屏通吃）

import { $, on, notify } from "./utils.js";
// ↑ 引入 $（找元素）、on（绑事件）、notify（弹通知）三个工具

const canvas = $("boardCanvas");
// ↑ 拿到 <canvas> 元素（它就像一张"电子纸"）
const ctx = canvas.getContext("2d");
// ↑ 最关键的一步：getContext("2d") 返回"2D 画笔对象"，
//   之后所有画线、填色命令都要靠它来执行

const colorInput = $("boardColor");
// ↑ 颜色选择器输入框
const widthInput = $("boardWidth");
// ↑ 粗细滑块输入框

let drawing = false;
// ↑ 记录"现在是否正在画画"（按下时 true，松开时 false）

function fillWhite() {
  // ↑ 把整张画布填成白色（清空画布时也要调它）
  ctx.fillStyle = "#ffffff";
  // ↑ 设置画笔的"填充色"为白色
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ↑ 画一个覆盖全画布的白色矩形，旧的涂鸦就被盖掉了
}

function applyStyle() {
  // ↑ 把工具栏上的颜色/粗细设置到画笔上
  ctx.strokeStyle = colorInput.value;
  // ↑ 线条颜色 = 取色器当前值（如 "#2563eb"）
  ctx.fillStyle = colorInput.value;
  // ↑ 圆点填充色也跟着变
  ctx.lineWidth = Number(widthInput.value);
  // ↑ 线条粗细 = 滑块当前值；range 给的是字符串，用 Number 转成数字
  ctx.lineCap = "round";
  // ↑ 线条两端画成"圆头"，一笔的起止处才圆润不生硬
  ctx.lineJoin = "round";
  // ↑ 两条线相接处也圆滑，折线拐角不尖锐
}

function posFromEvent(e) {
  // ↑ 把鼠标/手指事件 e 里的坐标，换算成"画布内部像素坐标"
  const rect = canvas.getBoundingClientRect();
  // ↑ 拿到画布在屏幕上实际显示的位置和大小（CSS 像素）
  return {
    x: ((e.clientX - rect.left) * canvas.width) / rect.width,
    // ↑ clientX 是相对视口的 x；减去 rect.left 得到相对画布左上角的 x；
    //   再乘 canvas.width / rect.width 是因为"显示尺寸"可能被 CSS 缩放，
    //   而内部像素是固定的 720×360，要按比例还原成内部坐标
    y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    // ↑ y 方向同理
  };
}

on("boardCanvas", "pointerdown", (e) => {
  // ↑ 按下（鼠标左键 / 手指触点）：准备起笔画画
  drawing = true;
  // ↑ 进入"画画中"状态
  const p = posFromEvent(e);
  // ↑ 换算按下位置为画布坐标
  ctx.beginPath();
  // ↑ 开始一段"新路径"（旧路径作废），避免和上一笔粘连
  ctx.moveTo(p.x, p.y);
  // ↑ 把"笔尖"移动到按下点，但不画线
  canvas.setPointerCapture(e.pointerId);
  // ↑ 捕获指针：即使拖出画布外，浏览器也继续把事件发给画布，笔迹不中断
  ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  // ↑ 在按下点画一个小圆（半径=笔粗的一半）：实现"点一下也留个点"
  ctx.fill();
  // ↑ 填色，让那个小圆点真正出现
});

on("boardCanvas", "pointermove", (e) => {
  // ↑ 移动（按住拖动过程中不断触发）
  if (!drawing) return;
  // ↑ 没在画画（只是悬停移动）就直接返回，不画线
  const p = posFromEvent(e);
  // ↑ 换算当前位置
  ctx.lineTo(p.x, p.y);
  // ↑ 从上一个点画一条线到当前位置（路径会记住所有转折点）
  ctx.stroke();
  // ↑ 真正把这条路径描出来（按当前颜色和粗细）
});

function stopDrawing() {
  // ↑ 松开：停止画画
  drawing = false;
  // ↑ 关掉"画画中"状态，之后的移动不再产生线条
}

on("boardCanvas", "pointerup", stopDrawing);
// ↑ 松开鼠标 / 抬起手指 → 停笔
on("boardCanvas", "pointercancel", stopDrawing);
// ↑ 意外中断（如系统弹窗抢走触摸）→ 也停笔，避免画布一直"卡在画画状态"

colorInput.addEventListener("input", applyStyle);
// ↑ 拖动/点击取色器换颜色 → 立即把新颜色设置给画笔
widthInput.addEventListener("input", applyStyle);
// ↑ 拖动粗细滑块 → 立即更新画笔粗细

on("btnBoardClear", "click", () => {
  // ↑ 点"清空"按钮
  fillWhite();
  // ↑ 整张画布刷成白色，涂鸦全部消失
});

on("btnBoardExport", "click", () => {
  // ↑ 点"导出 PNG"按钮
  const url = canvas.toDataURL("image/png");
  // ↑ 把画布内容编码成 PNG 图片地址（base64 长字符串）
  const a = document.createElement("a");
  // ↑ 临时造一个 <a> 标签（第 33 关导出 JSON 用过同一招）
  a.href = url;
  // ↑ 让 <a> 指向这张图片地址
  a.download = "my-homepage-doodle.png";
  // ↑ 指定下载文件名
  a.click();
  // ↑ 模拟点击，触发浏览器下载
  notify("导出成功", "涂鸦已存成 PNG 图片下载~");
  // ↑ 弹个系统通知告诉用户
});

export function initBoard() {
  // ↑ 启动函数：供 main.js 调用
  applyStyle();
  // ↑ 先把工具栏的默认颜色/粗细设置给画笔
  fillWhite();
  // ↑ 画布初始是透明的，先刷成白底，看起来才像"纸"
}
