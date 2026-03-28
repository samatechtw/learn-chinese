<template>
  <div class="unit-lesson-page">
    <UnitLesson v-if="unit" :unit="unit" />
    <div v-else class="not-found container f-center-col">
      <PageNav :nav="getLanguageBreadcrumbs('chinese')" />
      <h1>Unit not found</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PageNav } from '@frontend/components/widgets'
import { getLanguageBreadcrumbs } from '@frontend/util/misc'
import { getUnit } from '@learn-chinese/util/units'
import UnitLesson from '../components/units/UnitLesson.vue'

const route = useRoute()
const unit = computed(() => getUnit(route.params.unitId as string))
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.not-found {
  min-height: calc(100vh - $header-height);
  padding: 96px 0;
  gap: 24px;
}
</style>
