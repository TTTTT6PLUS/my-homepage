// 我的技能树：用 Chart.js 画一张柱状图，可视化"学过哪些前端技能"
// 这是第一次使用"第三方库"：npm install chart.js 装进来 → import → 喂数据，图就出来了

import Chart from "chart.js/auto";
// ↑ 从 chart.js 导入 Chart 主类；"/auto" 会自动注册柱状图、折线图等所有常用组件，
//   不用手动一个个注册（这是 Chart.js v4 的推荐写法）
import { $ } from "./utils";
// ↑ 引入 $（找元素）

// 技能数据：以后想换真实统计（比如每天学习时长），只需改这个数组
const SKILLS: { name: string; score: number; color: string }[] = [
  { name: "HTML", score: 90, color: "#ef4444" },
  { name: "CSS", score: 85, color: "#3b82f6" },
  { name: "JavaScript", score: 80, color: "#f59e0b" },
  { name: "ES6+", score: 78, color: "#10b981" },
  { name: "Git", score: 82, color: "#8b5cf6" },
  { name: "Canvas", score: 70, color: "#ec4899" },
  { name: "PWA", score: 65, color: "#06b6d4" },
  { name: "语音&游戏", score: 68, color: "#f97316" },
];
// ↑ 每项 = 技能名 + 熟练度打分(0~100) + 柱子颜色

function themeColor(varName: string, fallback: string): string {
  // ↑ 读 CSS 变量当前值（用来给图表文字上色，深浅色主题都协调）
  const val = getComputedStyle(document.body).getPropertyValue(varName).trim();
  // ↑ 拿 body 上定义的变量，比如 --text
  return val || fallback;
  // ↑ 没读到就用兜底色
}

// y 轴的配置抽成独立变量：Chart.js v4 的类型把 stepSize 归在 ticks 里，
// 而原 JS 一直写在 scales.y 的根级；为让传给图表运行时的配置对象与原代码一字不差，
// 这里用变量承载（TS 对"非字面量"不会报多出字段的错）。
const yScaleOptions = {
  min: 0,
  max: 100,
  // ↑ 分数范围写死 0~100
  stepSize: 20,
  // ↑ 每 20 分画一条网格线（0/20/40/60/80/100）
  ticks: {
    color: themeColor("--text", "#475569"),
    // ↑ 刻度文字用主题文字色，深浅色模式都看得清
    callback: (v: number | string) => v + "",
  },
  grid: { color: "rgba(148, 163, 184, 0.18)" },
  // ↑ 网格线用很淡的灰，不抢柱子风头
};

export function initSkillChart(): void {
  // ↑ 启动函数：main.js 调用
  new Chart($<HTMLCanvasElement>("skillChart"), {
    // ↑ 在指定 canvas 上创建一张图（第二个参数是"配置对象"）
    type: "bar",
    // ↑ 图表类型：柱状图
    data: {
      // ↑ 数据区
      labels: SKILLS.map((s) => s.name),
      // ↑ x 轴标签 = 所有技能名
      datasets: [
        {
          label: "熟练度",
          // ↑ 悬停提示里显示的名字
          data: SKILLS.map((s) => s.score),
          // ↑ 每根柱子的高度 = 分数
          backgroundColor: SKILLS.map((s) => s.color),
          // ↑ 每根柱子一个颜色（数组一一对应）
          borderRadius: 8,
          // ↑ 柱子顶部圆角，更好看
          maxBarThickness: 42,
          // ↑ 柱子最宽 42px，避免太粗
        },
      ],
    },
    options: {
      // ↑ 外观与行为配置区
      responsive: true,
      // ↑ 窗口变化时自动重绘
      maintainAspectRatio: false,
      // ↑ 不按默认宽高比，而是填满我们 CSS 里 .skill-box 定好的宽高
      plugins: {
        legend: { display: false },
        // ↑ 只有一个数据系列，图例多余，藏掉
        tooltip: {
          // ↑ 悬停浮层
          callbacks: {
            label: (item) => ` ${item.parsed.y} / 100`,
            // ↑ 把默认提示"熟练度: 90"改成" 90 / 100"
          },
        },
      },
      scales: {
        // ↑ 坐标轴配置
        y: yScaleOptions,
        x: {
          ticks: { color: themeColor("--text", "#475569") },
          // ↑ x 轴技能名也跟随主题色
          grid: { display: false },
          // ↑ x 轴不画竖网格线，清爽
        },
      },
    },
  });
  // ↑ 图创建完就"活"了：自带生长动画、悬停高亮，不用再写任何代码
}
