<template>
  <BaseCard class="vsn-add-entry vsn-mt-08">
    <transition name="bounce-delay">
      <div class="vsn-add-entry__btn-start" v-if="!isVisible" @click="openPanel">{{ ADD_ENTRY }}</div>
    </transition>

    <transition name="slide-down-delay">
      <form class="vsn-add-entry__main" v-if="isVisible">
        <AddEntryText v-model="newPost.sText"></AddEntryText>

        <BaseDirections :directions="directionsList" @change-directions="setDirections"></BaseDirections>

        <AddEntryFilesList v-if="isAllowAttachments" :files-added="newPost.aFiles" @change-files-list="updateFiles"></AddEntryFilesList>
        <div class="vsn-filter-divider" v-if="isAllowAttachments"></div>

        <AddEntryTagsList v-if="isAllowAddTags" :is-allow-create-tags="isAllowCreateTags" @change-tags-list="setTags"></AddEntryTagsList>
        <div class="vsn-filter-divider" v-if="isAllowAddTags"></div>

        <BaseSendControls :is-disabled="isDisabled" :warning="WARNING" @cancel-form="cancelEntry" @send-form="postEntry"></BaseSendControls>
      </form>
    </transition>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/ui/BaseCard.vue'
import AddEntryText from './AddEntryText.vue'
import BaseDirections from '@/components/ui/BaseDirections.vue'
import AddEntryFilesList from './AddEntryFilesList.vue'
import AddEntryTagsList from './AddEntryTagsList.vue'
import BaseSendControls from '@/components/ui/BaseSendControls.vue'

import { useStore } from 'vuex'
import { reactive, ref } from '@vue/reactivity'
import { computed, watch } from '@vue/runtime-core'

export default {
  components: {
    BaseCard,
    AddEntryText,
    BaseDirections,
    AddEntryFilesList,
    AddEntryTagsList,
    BaseSendControls
  },

  setup() {
    const store = useStore()

    const EXCEEDED_FILES = store.getters.getCONST_ExceededFiles

    const gConfig = computed(() => store.getters.getGConfig)
    const directionsList = computed(() => store.getters.getDirectionsListForPost)

    const isAllowAttachments = gConfig.value.bAllowAttachments && gConfig.value.bAllowEntryAttachments
    const iMaxAttachmentsQty = gConfig.value.iMaxAttachmentsQty
    const isAllowAddTags = gConfig.value.bAllowTags
    const isAllowCreateTags = gConfig.value.bAllowCreateTags

    const isVisible = ref(false)
    const fnDropDirections = ref(null)
    const fnDropTags = ref(null)
    const ADD_ENTRY = store.getters.getCONST_PostMessage
    const WARNING = store.getters.getCONST_DisabledWarning

    const newPost = reactive({
      sType: 'post',
      sText: '',
      sDirections: '',
      sTags: '',
      aFiles: []
    })

    const isDisabled = ref(true)
    watch(newPost, cur => {
      isDisabled.value = !cur.sText || !cur.sDirections
    })

    function setDirections(payload) {
      newPost.sDirections = payload.directions.length > 0 ? payload.directions.join(',') : ''
      if (!fnDropDirections.value) {
        fnDropDirections.value = payload.fn
      }
    }

    function updateFiles(payload) {
      newPost.aFiles = payload.length > 0 ? payload : []

      if (iMaxAttachmentsQty > 0 && newPost.aFiles.length > iMaxAttachmentsQty) {
        store.dispatch('setErrorRequestAPI', EXCEEDED_FILES)
        newPost.aFiles = []
      }
    }

    function setTags(payload) {
      newPost.sTags = payload.tags.length > 0 ? payload.tags.map(t => t.name).join(',') : ''
      if (!fnDropTags.value) {
        fnDropTags.value = payload.fn
      }
    }

    function openPanel() {
      isVisible.value = !isVisible.value
    }

    function cancelEntry() {
      _dropDataForm()
      openPanel()
    }

    function _dropDataForm() {
      if (typeof fnDropDirections.value === 'function') {
        fnDropDirections.value()
      }

      if (typeof fnDropTags.value === 'function') {
        fnDropTags.value()
      }

      newPost.sText = ''
      newPost.sDirections = ''
      newPost.sTags = ''
      newPost.aFiles = []
    }

    function postEntry() {
      store.dispatch('postItem', newPost)
      cancelEntry()
    }

    return {
      isAllowAttachments,
      isAllowCreateTags,
      isAllowAddTags,
      directionsList,
      isDisabled,
      isVisible,
      ADD_ENTRY,
      WARNING,
      newPost,
      setDirections,
      updateFiles,
      setTags,
      openPanel,
      cancelEntry,
      postEntry
    }
  }
}
</script>

<style>
.vsn-add-entry {
  padding: 1.5em;
}
.vsn-add-entry__btn-start,
.vsn-add-entry__main {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.vsn-add-entry__btn-start {
  align-items: center;
  width: 100%;
  font-size: 1em;
  color: var(--gray-60);
  cursor: pointer;
  transition: all 0.3s ease;
}
.vsn-add-entry__main > div {
  display: flex;
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-add-entry {
    padding: 1rem 0;
  }
  .vsn-add-entry__btn-start {
    font-size: 0.875em;
  }
}
</style>
