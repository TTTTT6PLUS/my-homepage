// audio.ts —— Web Audio 发声工具（移植原 audio.ts，改为模块共享）
// 被"迷你电子琴"和"接小鱼"两个组件共同使用：
//   电子琴：点琴键 → playNote(频率)
//   接小鱼：接住 → 叮(880Hz)；漏鱼 → 嘟(150Hz)
// 关键规则：AudioContext 必须由用户"第一次点击"触发创建（浏览器自动播放限制）。

// 波形与音量不再从 DOM 读取（Vue 里用响应式状态），
// 这里导出两个响应式值，供 PianoBlock 用 v-model 双向绑定。
import { ref } from "vue";
// ↑ 导入 ref（Vue 响应式状态）

export const waveType = ref<OscillatorType>("sine");
// ↑ 当前音色（波形）：sine正弦/square方波/triangle三角/sawtooth锯齿，默认正弦

export const volume = ref(0.5);
// ↑ 当前音量 0~1，默认 0.5

let ctx: AudioContext | null = null;
// ↑ 音频上下文"单例"：整个页面只创建一次

function getCtx(): AudioContext {
  // ↑ 惰性创建 AudioContext
  if (!ctx) ctx = new AudioContext();
  // ↑ 首次调用才创建（此时一定发生在用户点击之后，浏览器允许出声）
  return ctx;
}

export function playNote(freq: number, duration = 0.6): void {
  // ↑ 弹一个音：freq 频率(音高Hz)，duration 持续秒数
  const ac = getCtx();
  // ↑ 拿上下文（首次在此创建）

  const osc = ac.createOscillator();
  // ↑ 造声源：振荡器，按指定频率振动发声
  osc.type = waveType.value;
  // ↑ 音色 = 当前选中的波形
  osc.frequency.value = freq;
  // ↑ 音高 = 传入频率

  const gain = ac.createGain();
  // ↑ 造音量放大器（管响度与淡入淡出）

  const vol = volume.value;
  // ↑ 读当前音量

  const t = ac.currentTime;
  // ↑ 记下"现在"时刻（AudioContext 有自己的时钟）

  gain.gain.setValueAtTime(0.0001, t);
  // ↑ 音量从"几乎无声"起步，防爆音
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  // ↑ 20ms 内平滑上升到目标音量（淡入）
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  // ↑ duration 后衰减到无声（淡出，避免"啪"的收尾）
  //   指数曲线到不了 0，用 0.0001 当"听不见"终点

  osc.connect(gain);
  // ↑ 接线①：声源 → 音量
  gain.connect(ac.destination);
  // ↑ 接线②：音量 → 扬声器

  osc.start(t);
  // ↑ 开始发声
  osc.stop(t + duration + 0.05);
  // ↑ 多留 0.05s 等淡出走完再停
}
