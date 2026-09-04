<script setup lang="ts">
// ===== WhaleCard.vue =====
// 这是一个"子组件"：像一块乐高积木，可以被父组件反复使用
// 组件化的好处：每块积木只管自己的事，互不干扰

// defineProps：声明这个组件"接收哪些参数"（prop，父组件传进来的数据）
const props = defineProps<{
  name: string; // 必填参数：要展示的名字
}>();

// defineEmits：声明这个组件"能向外发送哪些事件"（子传父的通道）
const emit = defineEmits<{
  (e: "wave", message: string): void; // 挥鳍事件：带一句消息给父组件
}>();

function waveBack(): void {
  // ↑ 点按钮时触发 wave 事件，把问候语传给父组件
  emit("wave", `来自 ${props.name} 的尾巴挥挥~ 👋`);
}
</script>

<template>
  <!-- ===== 模板区：积木的"长相" =====
       可以直接用 props.name 显示父组件传来的数据 -->
  <section class="whale">
    <h2>🐋 鲸鱼卡片（子组件）</h2>
    <p>嗨，我是 {{ name }}！</p>
    <!-- 点按钮 → 调用 waveBack → 触发 wave 事件通知父组件 -->
    <button @click="waveBack">挥挥尾巴</button>
    <p class="hint">（点击上方按钮，看看父组件会不会收到消息）</p>
  </section>
</template>

<style scoped>
/* scoped：这套样式只属于鲸鱼卡片自己 */
.whale {
  border: 2px dashed #60a5fa;
  border-radius: 16px;
  padding: 16px 20px;
  background: #eff6ff;
  margin-top: 16px;
  text-align: center;
}
.hint {
  font-size: 12px;
  color: #94a3b8;
}
</style>
