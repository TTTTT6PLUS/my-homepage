<script setup lang="ts">
// ===== WhaleCard.vue =====
// 这是一个"子组件"：像一块乐高积木，可以被父组件反复使用
// 组件化的好处：每块积木只管自己的事，互不干扰

// defineProps：声明这个组件"接收哪些参数"（prop = 父组件传进来的数据）
const props = defineProps<{
  // ↑ 泛型写法：把"props 的形状"写成一个类型
  name: string; // 必填参数：要展示的名字（类型是 string）
}>();

// defineEmits：声明这个组件"能向外发送哪些事件"（子传父的"喊话通道"）
const emit = defineEmits<{
  // ↑ 泛型写法：列出所有允许发出的事件及参数
  (e: "wave", message: string): void; // 挥鳍事件：带一句消息给父组件
}>();

function waveBack(): void {
  // ↑ 定义"挥鳍"函数，模板里的按钮点击时会调用它
  emit("wave", `来自 ${props.name} 的尾巴挥挥~ 👋`);
  // ↑ 触发 wave 事件，把问候语字符串传给父组件
  //   props.name：读取父组件通过 :name 传进来的名字
}
</script>

<template>
  <!-- ===== 模板区：积木的"长相" =====
       可以直接用 props.name（或简写 name）显示父组件传来的数据 -->
  <section class="whale">
    <!-- ↑ 最外层容器：class="whale" 用于套用下方样式 -->
    <h2>🐋 鲸鱼卡片（子组件）</h2>
    <!-- ↑ 卡片标题 -->
    <p>嗨，我是 {{ name }}！</p>
    <!-- ↑ 插值语法 {{ name }}：把 props.name 显示在页面上 -->
    <!-- 点按钮 → 调用 waveBack → 触发 wave 事件通知父组件 -->
    <button @click="waveBack">挥挥尾巴</button>
    <!-- ↑ @click 是"点击事件"缩写；点了就执行 waveBack -->
    <p class="hint">（点击上方按钮，看看父组件会不会收到消息）</p>
    <!-- ↑ 一行提示文字，class="hint" 用于套用小字样式 -->
  </section>
</template>

<style scoped>
/* scoped：这套样式只属于鲸鱼卡片自己，不会漏到别的组件 */
.whale {
  /* ↑ 卡片容器样式 */
  border: 2px dashed #60a5fa; /* 蓝色虚线边框 */
  border-radius: 16px; /* 圆角 */
  padding: 16px 20px; /* 内边距：上下16 左右20 */
  background: #eff6ff; /* 浅蓝背景 */
  margin-top: 16px; /* 上方留出间距 */
  text-align: center; /* 内容居中 */
}
.hint {
  /* ↑ 提示文字样式 */
  font-size: 12px; /* 小号字 */
  color: #94a3b8; /* 灰色 */
}
</style>
