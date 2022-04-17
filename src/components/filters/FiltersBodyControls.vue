<template>
  <MqResponsive target="xs" class="vsn-filters-body-controls">
    <div class="vsn-filter-divider"></div>
  </MqResponsive>

  <div class="vsn-body-controls">
    <BaseButtonFrame :name="CLEAR" :type="'button'" @click.prevent="dropFilter"></BaseButtonFrame>
    <BaseButtonFrame :name="APPLY" :state="'active'" :type="'button'" @click.prevent="applyFilter"></BaseButtonFrame>
  </div>
</template>

<script>
import BaseButtonFrame from '@/components/ui/BaseButtonFrame.vue'
import { MqResponsive } from 'vue3-mq'

import { useStore } from 'vuex'

export default {
  emits: ['drop-filter', 'apply-filter'],
  components: {
    BaseButtonFrame,
    MqResponsive
  },
  setup(_, { emit }) {
    const store = useStore()

    const CLEAR = store.getters.getCONST_ResetFilters
    const APPLY = store.getters.getCONST_ApplyFilters

    function dropFilter() {
      emit('drop-filter')
    }

    function applyFilter() {
      emit('apply-filter')
    }

    return {
      CLEAR,
      APPLY,
      dropFilter,
      applyFilter
    }
  }
}
</script>

<style>
.vsn-body-controls {
  display: flex;
  width: 100%;
  margin-top: 1em;
  justify-content: flex-end;
}
.vsn-body-controls .vsn-base-btn-frame:last-child {
  margin: 0;
}

/* For mobile */

@media screen and (max-width: 576px) {
  .vsn-body-controls {
    justify-content: space-between;
    margin-top: 0;
    padding: 0 1em;
  }
  .vsn-filters-body-controls .vsn-filter-divider {
    margin: 1.4rem 0;
  }
}
</style>
