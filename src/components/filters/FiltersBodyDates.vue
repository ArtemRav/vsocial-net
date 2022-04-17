<template>
  <MqResponsive target="sm-lg">
    <div class="vsn-body-dates">
      <div class="vsn-body-dates__title vsn-filters__title vsn-fc-gray-70">{{ PERIOD }}</div>

      <div class="vsn-body-dates__range">
        <div class="vsn-filter-divider-ver"></div>
        <BaseDatePicker :label="DATE_FROM" v-model="dateStart"></BaseDatePicker>
        <div class="vsn-filter-divider-ver"></div>

        <div class="vsn-divider"></div>
        <BaseDatePicker :label="DATA_TO" v-model="dateEnd"></BaseDatePicker>
      </div>
    </div>

    <div class="vsn-filter-divider"></div>
  </MqResponsive>

  <MqResponsive target="xs" class="vsn-body-dates">
    <div class="vsn-body-dates__title vsn-filters__title vsn-fc-gray-70">{{ PERIOD }}</div>

    <div class="vsn-body-dates__range">
      <BaseDatePicker :label="DATE_FROM" v-model="dateStart"></BaseDatePicker>

      <BaseDatePicker :label="DATA_TO" v-model="dateEnd"></BaseDatePicker>
    </div>
  </MqResponsive>
</template>

<script>
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'
import { MqResponsive } from 'vue3-mq'

import { ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { watch } from '@vue/runtime-core'
export default {
  emits: ['out-date-start', 'out-date-end'],
  components: {
    BaseDatePicker,
    MqResponsive
  },
  params: {
    filtersData: Object
  },
  setup(_, { emit }) {
    const store = useStore()

    const PERIOD = store.getters.getCONST_Period
    const DATE_FROM = store.getters.getCONST_FilterDateFrom
    const DATA_TO = store.getters.getCONST_FilterDateTo
    const dateStart = ref(null)
    const dateEnd = ref(null)

    function dropDates() {
      dateStart.value = null
      dateEnd.value = null
    }

    watch(dateStart, (cur, prev) => {
      if (cur != prev) {
        emit('out-date-start', { date: cur, fn: dropDates })
      }
    })

    watch(dateEnd, (cur, prev) => {
      if (cur != prev) {
        emit('out-date-end', { date: cur, fn: dropDates })
      }
    })

    return {
      PERIOD,
      DATE_FROM,
      DATA_TO,
      dateStart,
      dateEnd
    }
  }
}
</script>

<style>
.vsn-body-dates {
  display: flex;
  width: 100%;
  height: 2em;
}
.vsn-body-dates .vsn-body-dates__title {
  margin-right: 0.3em;
  align-items: center;
}
.vsn-body-dates .vsn-body-dates__range {
  display: flex;
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-body-dates {
    display: flex;
    flex-direction: column;
    height: unset;
    padding: 0 1em;
  }
  .vsn-body-dates .vsn-body-dates__title {
    margin: 0 0 0.5rem 0;
  }
  .vsn-body-dates .vsn-body-dates__range {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
}
</style>
