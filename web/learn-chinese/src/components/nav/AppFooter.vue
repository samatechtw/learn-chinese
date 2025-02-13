<template>
  <footer>
    <div class="footer-wrap">
      <div class="footer-content">
        <div class="footer-left f-col">
          <div class="footer-title">
            {{ ts('footer.title') }}
          </div>
          <div class="footer-text">
            {{ ts('footer.text') }}
          </div>
        </div>
        <div class="footer-right f-col">
          <div class="bottom-links">
            <router-link
              :to="{ name: 'Terms' }"
              class="bottom-link"
              :class="{ active: route.name === 'Terms' }"
            >
              {{ ts('footer.terms') }}
            </router-link>
            <div class="bottom-divider"></div>
            <router-link
              :to="{ name: 'Privacy' }"
              class="bottom-link"
              :class="{ active: route.name === 'Privacy' }"
            >
              {{ ts('footer.privacy') }}
            </router-link>
          </div>
          <div class="copyright">
            {{ ts('footer.copyright') }}
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ts } from '../../i18n'
import { Logo, Medium, Twitter } from '@frontend/components/svg'

const route = useRoute()
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

$text-color: $text4;

.footer {
  position: relative;
}
.bottom-links {
  display: flex;
  margin-top: 8px;
}
.bottom-divider {
  width: 1px;
  height: 15px;
  background-color: $border1;
  margin: 0 20px;
}
.bottom-link {
  @mixin text 12px;
  letter-spacing: 1.2px;
  color: white;
  &:hover {
    color: $text-color;
  }
}
a.active {
  color: $text-color;
}
.footer-wrap {
  position: relative;
  background-color: $color1;
  color: white;
}
.footer-content {
  display: flex;
  position: relative;
  padding: 40px 40px 24px;
  width: 100%;
  max-width: 1080px;
  align-items: stretch;
  margin: 0 auto;
}
.footer-left {
  max-width: 300px;
}
.footer-title {
  @mixin title 20px;
  color: $text-color;
}
.footer-text {
  @mixin text 15px;
  margin-top: 8px;
}
.footer-right {
  margin-left: auto;
  align-items: center;
  justify-content: space-between;
}
.copyright {
  @mixin title 13px;
  letter-spacing: 0.03em;
  margin-top: 8px;
}
@media (max-width: 820px) {
  .footer-content {
    padding: 48px 40px 48px;
  }
  .footer-left {
    max-width: 600px;
    text-align: center;
  }
  .footer-wrap {
    overflow: hidden;
  }
}
@media (max-width: 510px) {
  .footer-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .bottom-link {
    text-align: center;
  }
  .bottom-divider {
    margin: 0 10px;
  }
}
</style>
