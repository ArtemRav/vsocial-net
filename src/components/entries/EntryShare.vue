<template>
  <div class="vsn-entry-share">
    <div class="vsn-filter-divider"></div>
    <form class="vsn-entry-share__form">
      <AddEntryText v-model="newShare.sText"></AddEntryText>

      <BaseDirections class="vsn-add-entry__directions" :directions="directionsList" @change-directions="setDirections"></BaseDirections>

      <BaseSendControls :is-disabled="!hasText" :warning="WARNING" @cancel-form="cancelEntry" @send-form="postEntry"></BaseSendControls>
    </form>
  </div>
</template>

<script>
import AddEntryText from '@/components/add-entry/AddEntryText.vue'
import BaseDirections from '@/components/ui/BaseDirections.vue'
import BaseSendControls from '@/components/ui/BaseSendControls.vue'

import { reactive, ref } from '@vue/reactivity'
import { computed, inject, watch } from '@vue/runtime-core'

import useGetEntryItem from '@/hooks/get-entry-item.js'

export default {
  emits: ['cancel-share'],
  components: {
    AddEntryText,
    BaseDirections,
    BaseSendControls
  },
  setup(_, { emit }) {
    const { store, entryItem: entryObject } = useGetEntryItem(inject)

    const WARNING = store.getters.getCONST_DisabledWarning

    const objectId = computed(() => (entryObject?.ownerId ? entryObject.ownerId : entryObject.id))
    const directionsList = computed(() => store.getters.getDirectionsListForPost)

    const newShare = reactive({
      sText: '',
      sType: 'share',
      sDirections: '',
      sObjectID: objectId.value
    })

    const hasText = ref(false)
    watch(newShare, cur => {
      if (cur.sText.length > 0 && newShare.sDirections != '') {
        hasText.value = true
      } else {
        hasText.value = false
      }
    })

    function setDirections(payload) {
      newShare.sDirections = payload.directions.length > 0 ? payload.directions.join(',') : ''
    }

    function postEntry() {
      store.dispatch('postItem', newShare)
      cancelEntry()
    }

    function cancelEntry() {
      _dropDataForm()
      emit('cancel-share')
    }

    function _dropDataForm() {
      newShare.sText = ''
      newShare.sDirections = ''
    }

    return {
      WARNING,
      hasText,
      newShare,
      setDirections,
      directionsList,
      postEntry,
      cancelEntry
    }
  }
}
</script>

<style>
.vsn-entry-share,
.vsn-entry-share__form {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 0.5em;
}
.vsn-entry-share .vsn-filter-divider {
  margin: 1rem 0 2rem 0;
}
.vsn-entry-share .vsn-add-entry__directions {
  margin-top: 2em;
}
.vsn-entry-share .vsn-entry-share-controls {
  margin-top: 0;
}
</style>
