<template>
  <div class="page-nav">
    <div v-for="(item, idx) in nav" :key="`${item.label}-${idx}`">
      <div v-if="idx >= nav.length - 1" class="nav-item">
        {{ item.label }}
      </div>
      <div v-else class="nav-item">
        <router-link v-if="item.name" :to="{ name: item.name }" class="nav-item">
          {{ item.label }}
        </router-link>
        <span v-else class="nav-item">{{ item.label }}</span>
        <span>&gt;</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  nav: Array<{
    label: string
    name?: string
  }>
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
