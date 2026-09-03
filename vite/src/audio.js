// 迷你电子琴：用 Web Audio API 发声
// 核心积木：AudioContext（总开关）→ OscillatorNode（声源/音色）→ GainNode（音量/包络）→ 扬声器
// 规则：AudioContext 必须等用户第一次点击后才创建（浏览器的自动播放限制）

import { $ } from "./utils.js";
// ↑ 只需要 $（找波形下拉和音量滑块）

let ctx = null;
// ↑ 音频上下文的"单例"：模块级变量，整个页面只创建一次

function getCtx() {
  // ↑ 惰性创建 AudioContext
  if (!ctx) ctx = new AudioContext();
  // ↑ 第一次调用才创建（此时一定是用户点过按钮了，浏览器允许出声）
  return ctx;
  // ↑ 以后每次调用直接返回同一个，不重复创建
}

export function playNote(freq, duration = 0.6) {
  // ↑ 弹一个音：freq 是频率（音高），duration 是持续秒数
  //   export 出去，方便"接小鱼"游戏也来配音效
  const ac = getCtx();
  // ↑ 拿到音频上下文（首次调用会在此创建）

  const osc = ac.createOscillator();
  // ↑ 造"声源"：振荡器，它能按指定频率振动产生声音
  osc.type = $("waveSelect").value;
  // ↑ 音色 = 下拉框选的波形（sine/square/triangle/sawtooth）
  osc.frequency.value = freq;
  // ↑ 音高 = 传入的频率（Hz），越大音越高

  const gain = ac.createGain();
  // ↑ 造"音量旋钮"：放大器，管这个音多响、怎么淡入淡出

  const vol = Number($("volSlider").value);
  // ↑ 从音量滑块读目标音量（0~1）

  const t = ac.currentTime;
  // ↑ 记下"现在"这个时刻（AudioContext 有自己的时钟，单位秒）

  gain.gain.setValueAtTime(0.0001, t);
  // ↑ 先让音量从"几乎无声"起步（防止开头爆音）
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  // ↑ 20 毫秒内指数上升到目标音量 → 平滑"淡入"，避免"啪"的爆裂声
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  // ↑ 到 duration 结束时指数衰减到几乎无声 → 平滑"淡出"，收尾不刺耳
  //   注意：指数曲线永远到不了 0，所以用 0.0001 当"听不见"的终点

  osc.connect(gain);
  // ↑ 接线①：声源 → 音量旋钮
  gain.connect(ac.destination);
  // ↑ 接线②：音量旋钮 → 扬声器（destination = 输出设备）

  osc.start(t);
  // ↑ 从 t 时刻开始发声
  osc.stop(t + duration + 0.05);
  // ↑ 到 t+duration 后再宽限 0.05 秒停止（等淡出曲线走完再掐断）
}

export function initPiano() {
  // ↑ 启动函数：把 8 个琴键和发声函数连起来
  const keys = document.querySelectorAll(".piano-key");
  // ↑ 一次抓一批键（不能用 $，$ 只能按 id 选单个）
  keys.forEach((btn) => {
    // ↑ 遍历每个琴键
    btn.addEventListener("click", () => {
      // ↑ 点键时触发
      playNote(Number(btn.dataset.freq));
      // ↑ 从按钮身上读 data-freq 属性（dataset.freq），转成数字，发声
    });
  });
}
