<template>
  <div class="home-wrap">
    <div class="home-hero container f-center-col">
      <h1 class="hero-title">
        {{ ts('home.vietnamese') }}
      </h1>
      <div class="hero-text">
        {{ ts('home.vietnamese_coming_soon') }}
      </div>
      <router-link to="/" class="back-link">
        {{ ts('back') }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ts } from '@frontend/i18n'
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.home-wrap {
  background: $color4;
}
.home-hero {
  min-height: calc(100vh - $header-height);
  padding: 100px 0 120px;
  text-align: center;
}
.hero-title {
  @mixin title 56px;
  margin-bottom: 16px;
}
.hero-text {
  @mixin title-thin 22px;
  margin-bottom: 40px;
}
.back-link {
  @mixin text 18px;
  color: $color1;
  text-decoration: none;
  padding: 12px 24px;
  border: 2px solid $color1;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}
.back-link:hover {
  background: $color1;
  color: white;
}
</style>
