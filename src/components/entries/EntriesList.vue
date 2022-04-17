<template>
  <transition name="slide-down-delay">
    <BaseLoader class="vsn-entries__loader" v-if="!isNewEntryLoaded"></BaseLoader>
  </transition>

  <transition-group class="vsn-entries-list vsn-full-size-box" tag="ul" name="grow-down" v-if="isLoaded" appear>
    <EntryItem v-for="entry in entriesList" :key="entry" :item="entry"></EntryItem>
  </transition-group>

  <BaseLoader class="vsn-entries__loader" v-if="!isLoaded || !isMoreLoaded"></BaseLoader>

  <BaseCard class="vsn-add-entry" v-else-if="isLoaded && entriesList.length == 0">
    <p class="vsn-add-entry__btn-start">{{ NOT_ITEMS }}</p>
  </BaseCard>
</template>

<script>
import EntryItem from './EntryItem.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  components: {
    EntryItem,
    BaseCard
  },
  setup() {
    const store = useStore()

    const NOT_ITEMS = store.getters.getCONST_NoItemsFound

    const isLoaded = computed(() => store.getters.getIsEntriesLoaded)
    const entriesList = computed(() => store.getters.getItemsList)
    const isMoreLoaded = computed(() => store.getters.getIsMoreLoaded)
    const isNewEntryLoaded = computed(() => store.getters.getIsNewEntryLoaded)

    return {
      NOT_ITEMS,
      isLoaded,
      entriesList,
      isMoreLoaded,
      isNewEntryLoaded
    }
  }
}
</script>

<style>
.vsn-entries-list {
  flex-direction: column;
}
.vsn-entries-list .vsn-entry-item .vsn-soc-controls {
  padding: 1rem 0 0;
}
.vsn-entries__loader {
  margin-top: 1em;
}
</style>
