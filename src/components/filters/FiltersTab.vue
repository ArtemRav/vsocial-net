<template>
  <MqResponsive target="sm-lg" class="vsn-filter-tab-mob">
    <BaseButtonFrame
      v-for="tab in filterTabs"
      :key="tab.id"
      :type="'tab'"
      :state="tab.state"
      :name="tab.name"
      @click="$emit('toggle-tab', tab.id)"
    ></BaseButtonFrame>
  </MqResponsive>

  <MqResponsive target="xs" class="vsn-filter-tab-mob">
    <BaseCard>
      <div
        class="vsn-filter-tab-mob__item"
        v-for="tab in filterTabs"
        :key="tab.id"
        :class="{ active: tab.state }"
        @click="$emit('toggle-tab', tab.id)"
      >
        <div class="vsn-filter-tab-mob__point"></div>
        <div class="vsn-filter-tab-mob__title">{{ tab.name }}</div>
      </div>
    </BaseCard>
  </MqResponsive>
</template>

<script>
import { MqResponsive } from 'vue3-mq'
import BaseButtonFrame from '@/components/ui/BaseButtonFrame.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

export default {
  components: {
    MqResponsive,
    BaseButtonFrame,
    BaseCard
  },
  emits: ['toggle-tab'],
  props: {
    filterTabs: Array
  },
  setup() {}
}
</script>

<style>
.vsn-filter-tab-mob {
  display: flex;
  width: 100%;
}
.vsn-filter-tab-mob > .vsn-base-card {
  border-radius: 0;
  flex-direction: row;
  justify-content: flex-start;
}
.vsn-filter-tab-mob .vsn-filter-tab-mob__item {
  display: flex;
  align-items: center;
  max-width: 48%;
  margin-right: 1.5em;
}
.vsn-filter-tab-mob .vsn-base-card .vsn-filter-tab-mob__point,
.vsn-filter-tab-mob .vsn-base-card .vsn-filter-tab-mob__title {
  display: flex;
  transition: var(--toggle-btn-trtn);
}
.vsn-filter-tab-mob .vsn-base-card .vsn-filter-tab-mob__point {
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.75em;
  border-radius: 50%;
  border: 2px solid var(--gray-40);
}
.vsn-filter-tab-mob .vsn-base-card .vsn-filter-tab-mob__title {
  font-size: 0.875em;
}

.vsn-filter-tab-mob .vsn-filter-tab-mob__item.active .vsn-filter-tab-mob__point {
  border: 6px solid var(--blue-base);
}
</style>
