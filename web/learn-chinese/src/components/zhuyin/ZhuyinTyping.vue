<template>
  <div class="zhuyin-typing-wrap">
    <div class="zhuyin-typing container f-col">
      <h1 class="hero-title">
        {{ ts('zhuyin.typing') }}
      </h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ts } from '../../i18n'
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.zhuyin-typing-wrap {
  background: $color4;
}
.hero-title {
  @mixin title 32px;
  margin: 0;
}
.zhuyin-typing {
  min-height: calc(100vh - $header-height);
  padding: 140px 0 160px;
  align-items: center;
}
</style>
