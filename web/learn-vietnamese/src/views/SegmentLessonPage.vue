<template>
  <div class="segment-page-wrap">
    <SegmentLesson v-if="segment" :segment="segment" />
    <div v-else class="missing-wrap container f-center-col">
      <PageNav :nav="getLanguageBreadcrumbs('vietnamese')" />
      <h1>Segment not found</h1>
      <p>That lesson segment does not exist.</p>
      <router-link class="back-link" to="/vietnamese"
        >Back to Vietnamese Home</router-link
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { PageNav } from '@frontend/components/widgets'
import { getLanguageBreadcrumbs } from '@frontend/util/misc'
import { vietnameseLearningSegmentMap } from '@learn-vietnamese/data/segments'
import SegmentLesson from '@learn-vietnamese/components/segments/SegmentLesson.vue'

interface Props {
  segmentId: string
}

const props = defineProps<Props>()

const segment = computed(() => {
  return vietnameseLearningSegmentMap[props.segmentId] ?? null
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.missing-wrap {
  min-height: calc(100vh - $header-height);
  padding: 100px 0;
  text-align: center;
}
.missing-wrap h1 {
  @mixin title 34px;
  color: #9a3412;
  margin: 18px 0 10px;
}
.missing-wrap p {
  @mixin text 16px;
  color: $text2;
  margin-bottom: 20px;
}
.back-link {
  @mixin title-regular 15px;
  color: #c2410c;
}
</style>
