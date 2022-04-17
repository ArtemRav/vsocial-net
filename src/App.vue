<template>
  <div class="vsn-main vsn-full-size-box">
    <BaseAlert :text="errorText"></BaseAlert>

    <RouterView />
  </div>
</template>

<script>
import BaseAlert from '@/components/ui/BaseAlert.vue'

import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  components: {
    BaseAlert
  },
  setup() {
    const store = useStore()

    const errorText = computed(() => store.getters.getErrorRequestAPI)

    return {
      errorText
    }
  }
}
</script>

<style>
.vsn-main {
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
