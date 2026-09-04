// 语音朗读 · Step 2：把系统里的中文声音装进下拉框
// 核心技术：speechSynthesis.getVoices() 取声音 + voiceschanged 事件等声音"晚到"

import { $, on } from "./utils";
// ↑ $ 找元素，on 绑事件（这步开始要用 on 绑定朗读/停止按钮）

const voiceSelect = $<HTMLSelectElement>("ttsVoice");
// ↑ 语音下拉框元素，模块顶层先拿到，后面函数都能直接用

function fillVoices(voices: SpeechSynthesisVoice[]): void {
  // ↑ 把声音数组填进下拉框
  voiceSelect.innerHTML = "";
  // ↑ 先清空（把 HTML 里手写的占位 option 也一起清掉）
  const def = document.createElement("option");
  // ↑ 新建一个 option 元素
  def.value = "";
  // ↑ value 留空 = "让浏览器自己挑声音"
  def.textContent = "默认语音";
  // ↑ 显示文字
  voiceSelect.appendChild(def);
  // ↑ "默认语音"作为第一项加回去

  voices.forEach((v) => {
    // ↑ 遍历每个声音对象 v
    const opt = document.createElement("option");
    // ↑ 一个声音对应一个 option
    opt.value = v.name;
    // ↑ value 存"声音名字"，后面朗读时按名字找回它
    opt.textContent = `${v.name}（${v.lang}）`;
    // ↑ 显示文字 = 名字 + 语言，一眼能认出哪个是中文
    voiceSelect.appendChild(opt);
    // ↑ 把 option 加进下拉框
  });
}

function loadVoices(): void {
  // ↑ 核心：取声音 → 筛中文 → 填充下拉框
  const voices = speechSynthesis.getVoices();
  // ↑ 问浏览器要全部声音；注意第一次调用常常返回空数组！
  if (voices.length === 0) return;
  // ↑ 空的就直接走人——等会儿 voiceschanged 事件会再叫我们一次
  const zhVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith("zh")
  );
  // ↑ 只留中文语音：lang 转小写后以 "zh" 开头（匹配 zh-CN / zh-TW / zh-HK）
  fillVoices(zhVoices.length ? zhVoices : voices);
  // ↑ 有中文就只填中文；万一系统连中文都没有，退而求其次全部填上
}

function speak(): void {
  // ↑ 朗读：读输入框的文字
  const text = $<HTMLInputElement>("ttsText").value.trim();
  // ↑ 取文字并去掉首尾空格
  if (!text) return;
  // ↑ 空输入就不念（也省得 cancel 打断别人）

  if (speechSynthesis.speaking) speechSynthesis.cancel();
  // ↑ 万一正在念，先掐掉旧的，避免两段话排队打架

  const utterance = new SpeechSynthesisUtterance(text);
  // ↑ 造一张"播音稿"：要念的文字 + 播放参数都挂它身上

  utterance.rate = Number($<HTMLInputElement>("ttsRate").value);
  // ↑ 语速：range 给的是字符串，Number 转成数字（0.5~2）
  utterance.pitch = Number($<HTMLInputElement>("ttsPitch").value);
  // ↑ 音调：数字越大声音越尖细（0~2）

  const chosen = speechSynthesis
    .getVoices()
    .find((v) => v.name === voiceSelect.value);
  // ↑ 在下拉框选中的声音名字，去声音列表里"对号入座"找到它
  utterance.voice = chosen || null;
  // ↑ 找到了就用它；没找到（默认语音选项 value 是空串）就 null，让浏览器自己挑

  utterance.onend = () => {
    // ↑ 念完回调：浏览器念完会自动调它
    $("ttsStatus").textContent = "✅ 念完啦";
    // ↑ 状态文字换成"念完啦"
  };
  utterance.onerror = () => {
    // ↑ 念失败了（比如选了没装的声音）也会回调
    $("ttsStatus").textContent = "❌ 朗读出错了";
  };

  $("ttsStatus").textContent = "🔊 正在朗读…";
  // ↑ 先更新状态提示"开念了"
  speechSynthesis.speak(utterance);
  // ↑ 把播音稿交给播音台，正式开念！
}

function stopSpeaking(): void {
  // ↑ 停止：立刻闭嘴
  speechSynthesis.cancel();
  // ↑ 播音台掐断当前朗读（没有正在念的也无害）
  $("ttsStatus").textContent = "⏹ 已停止";
  // ↑ 状态提示"停了"
}

export function initTTS(): void {
  // ↑ 启动函数：main.js 会调用
  loadVoices();
  // ↑ 先碰运气直接调一次（有时浏览器第一次就有声音）
  speechSynthesis.addEventListener("voiceschanged", loadVoices);
  // ↑ 关键兜底：声音是"异步加载"的，就绪后浏览器会触发 voiceschanged，
  //   那时再调一次 loadVoices 就能拿到完整列表了
  on("btnSpeak", "click", speak);
  // ↑ 点"🔊 朗读"→ speak
  on("btnStop", "click", stopSpeaking);
  // ↑ 点"⏹ 停止"→ stopSpeaking
}
