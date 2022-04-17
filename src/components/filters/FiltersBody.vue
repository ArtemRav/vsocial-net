<template>
  <div class="vsn-filter__body">
    <BaseCard class="vsn-entry-item">
      <template v-slot:default>
        <form>
          <BaseSearch v-if="isSearch" v-model.trim="filtersData.search" @submit-form="submitForm"></BaseSearch>

          <BaseDirections v-if="hasDirections" :directions="directionsList" @change-directions="setDirections"></BaseDirections>

          <FiltersBodyDates v-if="hasDates" @out-date-start="setDateStart" @out-date-end="setDateEnd"></FiltersBodyDates>

          <FiltersBodyControls @drop-filter="dropDataFilter" @apply-filter="submitForm"></FiltersBodyControls>
        </form>
      </template>
    </BaseCard>
  </div>
</template>

<script>
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSearch from '@/components/ui/BaseSearch.vue'
import BaseDirections from '@/components/ui/BaseDirections.vue'
import FiltersBodyDates from './FiltersBodyDates.vue'
import FiltersBodyControls from './FiltersBodyControls.vue'

import { reactive, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  components: {
    BaseCard,
    BaseSearch,
    BaseDirections,
    FiltersBodyDates,
    FiltersBodyControls
  },
  setup() {
    const store = useStore()

    const filtersData = reactive({
      search: '',
      directions: '',
      dateFrom: null,
      dateTo: null
    })

    const gConfig = store.getters.getGConfig
    const aFilters = gConfig.aFilters.length > 0 ? gConfig.aFilters.split(';') : []
    const isSearch = gConfig.bSearch
    const hasDirections = ~aFilters.indexOf('targets')
    const hasDates = ~aFilters.indexOf('dates')
    const directionsList = computed(() => store.getters.getDirectionsList)

    const fnDropDirections = ref(null)
    const fnDropDates = ref(null)

    function setDirections(payload) {
      filtersData.directions = payload.directions.length > 0 ? payload.directions.join(',') : ''
      if (!fnDropDirections.value) {
        fnDropDirections.value = payload.fn
      }
    }

    function setDateStart(payload) {
      filtersData.dateFrom = payload.date
      if (!fnDropDates.value) {
        fnDropDates.value = payload.fn
      }
    }

    function setDateEnd(payload) {
      filtersData.dateTo = payload.date
      if (!fnDropDates.value) {
        fnDropDates.value = payload.fn
      }
    }

    function dropDataFilter() {
      if (typeof fnDropDirections.value === 'function') {
        fnDropDirections.value()
      }
      if (typeof fnDropDates.value === 'function') {
        fnDropDates.value()
      }

      filtersData.search = ''
      filtersData.directions = ''
      filtersData.dateFrom = null
      filtersData.dateTo = null

      store.dispatch('setPageNum', 0)

      submitForm()
    }

    function submitForm() {
      store.dispatch('setItemsList', [])
      store.commit('setIsEntriesLoaded', false)
      store.dispatch('getItems', filtersData)
    }

    return {
      isSearch,
      hasDates,
      filtersData,
      hasDirections,
      setDirections,
      setDateStart,
      setDateEnd,
      dropDataFilter,
      directionsList,
      submitForm
    }
  }
}
</script>

<style>
.vsn-filter__body,
.vsn-filter__body .vsn-entry-item > form {
  width: 100%;
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-filter__body > .vsn-entry-item {
    margin-top: 0;
    padding-right: 0;
    padding-left: 0;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }
}
</style>
