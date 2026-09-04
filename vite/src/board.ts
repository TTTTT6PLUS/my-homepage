// 涂鸦板（TypeScript 版）：第 40 关把 board.js 迁移成 board.ts
// 迁移 = 逻辑一行不动，只给 TS 补上"类型信息"，让错误在写代码时就被抓住
// 注意：Vite 直接支持 .ts 文件，运行时行为和原来一模一样

import { $, on, notify } from "./utils.js";
// ↑ $（找元素）、on（绑事件）、notify（弹通知）。utils.js 还是 .js，
//   tsconfig 的 allowJs 允许 .ts 继续引用它

const canvas = $("boardCanvas") as HTMLCanvasElement;
// ↑ 类型断言 as：$ 返回的是"可能为空的通用元素"，
//   但我们确定它就是画布 → 用 as HTMLCanvasElement 告诉 TS 它的精确类型，
//   这样下面才能调用 getContext（普通元素上没有这个方法）

const ctx = canvas.getContext("2d")!;
// ↑ 非空断言 !：getContext 理论上可能返回 null（拿不到画笔），
//   但现实中几乎不会 → 用 ! 告诉 TS"我保证它不是 null，别报警"

const colorInput = $("boardColor") as HTMLInputElement;
// ↑ 取色器是输入框 → 断言成 HTMLInputElement，才能安全读 .value

const widthInput = $("boardWidth") as HTMLInputElement;
// ↑ 粗细滑块同理

let drawing: boolean = false;
// ↑ 类型标注 : boolean（TS 写法：变量名 + 冒号 + 类型）
//   其实从 false 也能推断，写上是为了示范"显式标注"语法

function fillWhite(): void {
  // ↑ 返回类型 : void 表示"这个函数不返回任何值"
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function applyStyle(): void {
  ctx.strokeStyle = colorInput.value;
  ctx.fillStyle = colorInput.value;
  ctx.lineWidth = Number(widthInput.value);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

function posFromEvent(e: PointerEvent) {
  // ↑ 给事件参数标注类型 : PointerEvent！
  //   （关键）不标的话 TS 只当它是普通 Event，普通 Event 上没有 clientX，
  //   一用就报"属性不存在"——标了类型，智能补全和查错就都有了
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) * canvas.width) / rect.width,
    y: ((e.clientY - rect.top) * canvas.height) / rect.height,
  };
}

on("boardCanvas", "pointerdown", (e: PointerEvent) => {
  // ↑ 回调参数同样显式标 PointerEvent
  drawing = true;
  const p = posFromEvent(e);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  canvas.setPointerCapture(e.pointerId);
  ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();
});

on("boardCanvas", "pointermove", (e: PointerEvent) => {
  if (!drawing) return;
  const p = posFromEvent(e);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
});

function stopDrawing(): void {
  drawing = false;
}

on("boardCanvas", "pointerup", stopDrawing);
on("boardCanvas", "pointercancel", stopDrawing);

colorInput.addEventListener("input", applyStyle);
widthInput.addEventListener("input", applyStyle);

on("btnBoardClear", "click", () => {
  fillWhite();
});

on("btnBoardExport", "click", () => {
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-homepage-doodle.png";
  a.click();
  notify("导出成功", "涂鸦已存成 PNG 图片下载~");
});

export function initBoard(): void {
  applyStyle();
  fillWhite();
}
