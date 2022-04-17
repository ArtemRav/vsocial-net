<template>
  <div class="vsn-home-header__wrapper">
    <FiltersMain />

    <transition name="bounce">
      <AddEntry v-if="hasAddEntry && isNewEntryLoaded"></AddEntry>
    </transition>
  </div>

  <EntriesList></EntriesList>

  <transition name="fade">
    <TheLoadMore v-if="isVisible"></TheLoadMore>
  </transition>
</template>

<script>
import FiltersMain from '@/components/filters/FiltersMain.vue'
import AddEntry from '@/components/add-entry/AddEntry.vue'
import EntriesList from '@/components/entries/EntriesList.vue'
import TheLoadMore from '@/components/layouts/TheLoadMore.vue'

import { useStore } from 'vuex'
import { computed, ref, watch, watchEffect } from '@vue/runtime-core'

export default {
  components: {
    FiltersMain,
    AddEntry,
    EntriesList,
    TheLoadMore
  },
  setup() {
    const store = useStore()

    const hasAddEntry = ref(false)
    const gConfig = computed(() => store.getters.getGConfig)
    const isVisible = computed(() => store.getters.getIsLoadMore)
    const isNewEntryLoaded = computed(() => store.getters.getIsNewEntryLoaded)

    watch(gConfig, cur => {
      hasAddEntry.value = cur.bAllowPostMsg
    })

    // watchEffect(() => {
    //   const isNewEntryLoaded = computed(() => store.getters.getIsNewEntryLoaded)
    //   hasAddEntry.value = isNewEntryLoaded.value
    // })

    store.dispatch('init', { isLoad: true })

    return {
      isNewEntryLoaded,
      hasAddEntry,
      isVisible
    }
  }
}
</script>
