<template>
  <div class="home-wrap">
    <div class="home-hero container f-center-col">
      <h1 class="hero-title">
        {{ ts('home.hero') }}
      </h1>
      <div class="hero-text">
        {{ ts('home.hero_text') }}
      </div>
      <div class="language-cards">
        <router-link to="/chinese" class="language-card chinese-card">
          <div class="language-icon">&#x4E2D;</div>
          <h2 class="language-title">{{ ts('home.chinese') }}</h2>
          <p class="language-desc">{{ ts('home.chinese_text') }}</p>
        </router-link>
        <router-link to="/vietnamese" class="language-card vietnamese-card">
          <div class="language-icon">V</div>
          <h2 class="language-title">{{ ts('home.vietnamese') }}</h2>
          <p class="language-desc">{{ ts('home.vietnamese_text') }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ts } from '../i18n'
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.home-wrap {
  background: $color4;
}
.home-hero {
  min-height: calc(100vh - $header-height);
  padding: 100px 0 120px;
}
.hero-title {
  @mixin title 56px;
  text-align: center;
}
.hero-text {
  @mixin title-thin 22px;
  text-align: center;
  margin-bottom: 40px;
}
.language-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
  width: 100%;
  max-width: 700px;
  padding: 0 24px;
}
.language-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  background: $color5;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.language-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.language-icon {
  font-size: 64px;
  margin-bottom: 16px;
  line-height: 1;
}
.chinese-card .language-icon {
  color: $color1;
}
.vietnamese-card .language-icon {
  color: #da251d;
  font-weight: bold;
}
.language-title {
  @mixin title 24px;
  margin-bottom: 8px;
}
.language-desc {
  @mixin text 16px;
  text-align: center;
  color: $text-light2;
  margin: 0;
}
@media (max-width: 620px) {
  .home-hero {
    padding: 80px 0 100px;
  }
  .hero-title {
    font-size: 42px;
  }
  .hero-text {
    font-size: 19px;
  }
  .language-cards {
    grid-template-columns: 1fr;
    max-width: 400px;
    gap: 24px;
  }
  .language-card {
    padding: 32px 20px;
  }
  .language-icon {
    font-size: 48px;
  }
}
</style>
