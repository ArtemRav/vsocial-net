<template>
  <section class="vsn-filters vsn-mt-08">
    <FiltersHeader @open-filters="openFilters"></FiltersHeader>

    <transition name="slide-down">
      <FiltersBody class="vsn-header-filters__body" v-if="isVisible"></FiltersBody>
    </transition>
  </section>
</template>

<script>
import FiltersHeader from './FiltersHeader.vue'
import FiltersBody from './FiltersBody.vue'

import { ref } from '@vue/reactivity'

export default {
  components: {
    FiltersHeader,
    FiltersBody
  },
  setup() {
    const isVisible = ref(false)

    const openFilters = isOpen => (isVisible.value = isOpen)

    return {
      isVisible,
      openFilters
    }
  }
}
</script>

<style>
.vsn-filters {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
