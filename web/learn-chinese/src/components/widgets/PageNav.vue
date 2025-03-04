<template>
  <div class="page-nav">
    <div v-for="(key, idx) in nav">
      <div v-if="idx >= nav.length - 1" class="nav-item">
        {{ navItems[key] }}
      </div>
      <div v-else class="nav-item">
        <router-link :to="{ name: key }" class="nav-item">
          {{ navItems[key] }}
        </router-link>
        <span>&gt;</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const navItems: Record<string, string> = {
  Home: 'Home',
  Zhuyin: 'Zhuyin',
  ZhuyinLearn: 'Learn',
  ZhuyinQuiz: 'Quiz',
  ZhuyinTyping: 'Typing',
}
</script>

<script lang="ts" setup>
defineProps<{
  nav: string[]
}>()
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.page-nav {
  @mixin title-regular 14px;
  display: flex;
  align-items: center;
}
.nav-item {
  display: flex;
  align-items: center;
  span {
    margin: 0 4px;
  }
}
</style>
