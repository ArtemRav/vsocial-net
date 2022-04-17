<template>
  <div class="vsn-btn-lm" @click="loadMore">{{ LOAD_MORE }}</div>
</template>

<script>
// import { computed, ref, watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
  setup(_, { emit }) {
    const store = useStore()

    const LOAD_MORE = store.getters.getCONST_LoadMore

    // const lastItemId = ref(0)
    // watchEffect(() => {
    //   const entriesList = computed(() => store.getters.getItemsList)
    //   let entriesSize = entriesList.value?.length || 0
    //   lastItemId.value = entriesSize > 0 ? entriesList.value[entriesSize - 1]?.id || '' : ''
    // })

    // watchEffect(() => {
    //   const isEntriesLoaded = computed(() => store.getters.getIsEntriesLoaded)
    //   if (isEntriesLoaded.value) {
    //     document.getElementById(lastItemId.value).scrollIntoView()
    //   }
    // })

    function loadMore() {
      emit('leave')
      store.dispatch('getItems')
      store.dispatch('setIsMoreLoaded', false)
    }

    return {
      LOAD_MORE,
      loadMore
    }
  }
}
</script>

<style>
.vsn-btn-lm {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1em;
  padding: 1em;
  background-color: var(--gray-0);
  border-radius: 16px;
  text-align: center;
  font-size: 0.9em;
  color: var(--blue-base);
  cursor: pointer;
}
</style>
