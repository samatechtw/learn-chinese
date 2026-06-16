<template>
  <div class="units-section">
    <div class="units-inner container">
      <h2 class="section-title">Learning Units</h2>
      <p class="section-sub">
        Structured lessons combining vocabulary, phrases, and sentence practice.
      </p>
      <div class="units-grid">
        <router-link
          v-for="unit in allUnits"
          :key="unit.id"
          :to="{ name: 'UnitLesson', params: { unitId: unit.id } }"
          class="unit-card"
        >
          <div class="unit-card-icon">{{ unit.icon }}</div>
          <div class="unit-card-body">
            <div class="unit-card-title">{{ unit.title }}</div>
            <div class="unit-card-chinese">{{ unit.titleChinese }}</div>
            <div class="unit-card-desc">{{ unit.description }}</div>
          </div>
          <div class="unit-card-arrow">→</div>
        </router-link>
        <!-- Coming soon placeholder -->
        <div class="unit-card disabled">
          <div class="unit-card-icon">🛒</div>
          <div class="unit-card-body">
            <div class="unit-card-title">Shopping</div>
            <div class="unit-card-chinese">購物</div>
            <div class="unit-card-desc">Prices, bargaining, and shopping vocabulary.</div>
          </div>
          <div class="coming-soon-tag">Coming soon</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { allUnits } from '@learn-chinese/util/units'
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.units-section {
  max-width: 840px;
  width: 100%;
  padding: 0 24px;
  margin-top: 64px;
}

.units-inner {
  padding: 0 0 96px;
}

.section-title {
  @mixin title 32px;
  color: $color2;
  margin-bottom: 8px;
}

.section-sub {
  @mixin text 17px;
  color: $text2;
  margin-bottom: 40px;
}

.units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.unit-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(50, 130, 184, 0.2);
  border-radius: 18px;
  text-decoration: none;
  color: $text1;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  &:not(.disabled):hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(50, 130, 184, 0.2);
    border-color: rgba(50, 130, 184, 0.4);
    background: white;
  }

  &.disabled {
    cursor: default;
    pointer-events: none;
    opacity: 0.55;
  }
}

.unit-card-icon {
  font-size: 36px;
  flex-shrink: 0;
  line-height: 1;
  margin-top: 2px;
}

.unit-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.unit-card-title {
  @mixin title 18px;
  color: $text1;
}

.unit-card-chinese {
  @mixin title 15px;
  color: $color2;
}

.unit-card-desc {
  @mixin text 14px;
  color: $text2;
  margin-top: 4px;
  line-height: 1.5;
  min-height: 64px;
}

.unit-card-arrow {
  @mixin title 20px;
  color: $color3;
  flex-shrink: 0;
  align-self: center;
  transition: transform 0.2s;
  .unit-card:hover & {
    transform: translateX(4px);
  }
}

.coming-soon-tag {
  position: absolute;
  top: 12px;
  right: 14px;
  @mixin title-regular 12px;
  color: $color2;
  background: rgba(50, 130, 184, 0.12);
  border: 1px solid rgba(50, 130, 184, 0.2);
  border-radius: 999px;
  padding: 4px 10px;
}

@media (max-width: 720px) {
  .units-inner {
    padding: 56px 0 72px;
  }
  .section-title {
    font-size: 26px;
  }
  .section-sub {
    font-size: 15px;
    margin-bottom: 28px;
  }
  .units-grid {
    grid-template-columns: 1fr;
  }
}
</style>
