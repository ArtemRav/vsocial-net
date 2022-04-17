<template>
  <div class="vsn-entry-edit">
    <form class="vsn-entry-comment__form">
      <AddEntryText v-model="newPost.sText"></AddEntryText>
      <EntryCommentFilesList @change-files-list="updateFiles" :entry-files="entryObject.attachments"></EntryCommentFilesList>
      <BaseSendControls :is-disabled="!hasText" :warning="WARNING" @cancel-form="cancelEntry" @send-form="postEntry"></BaseSendControls>
    </form>
  </div>
</template>

<script>
import AddEntryText from '@/components/add-entry/AddEntryText.vue'
import EntryCommentFilesList from '@/components/entry-comment/EntryCommentFilesList.vue'
import BaseSendControls from '@/components/ui/BaseSendControls.vue'

import { reactive, ref } from '@vue/reactivity'
import { inject, watch } from '@vue/runtime-core'

import useGetEntryItem from '@/hooks/get-entry-item.js'

export default {
  emits: ['cancel-edit'],
  components: {
    AddEntryText,
    EntryCommentFilesList,
    BaseSendControls
  },
  setup(_, { emit }) {
    const { store, entryItem: entryObject } = useGetEntryItem(inject)

    const WARNING = store.getters.getCONST_DisabledWarningComment

    const newPost = reactive({
      sType: 'post',
      sText: entryObject.text,
      sEntryID: entryObject.id,
      sDirections: entryObject.owner.id || entryObject.object.id,
      aFiles: [],
      sEntryFiles: entryObject.attachments.map(a => a.id).join(',')
    })

    const hasText = ref(true)
    watch(newPost, cur => {
      if (cur.sText.length > 0) {
        hasText.value = true
      } else {
        hasText.value = false
      }
    })

    function updateFiles(payload) {
      newPost.aFiles = payload.length > 0 ? payload : []

      newPost.sEntryFiles = entryObject.attachments
        .filter(a => {
          return newPost.aFiles.map(f => f.lastModified).indexOf(a.id) !== -1
        })
        .map(a => a.id)
        .join(',')
    }

    function postEntry() {
      store.dispatch('postItem', newPost)
      cancelEntry()
    }

    function cancelEntry() {
      _dropDataForm()
      emit('cancel-edit')
    }

    function _dropDataForm() {
      newPost.sText = ''
    }

    return {
      entryObject,
      WARNING,
      hasText,
      newPost,
      updateFiles,
      postEntry,
      cancelEntry
    }
  }
}
</script>

<style>
.vsn-entry-edit,
.vsn-entry-edit__form {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 0.5em;
}
.vsn-entry-edit .vsn-filter-divider {
  margin: 1rem 0 2rem 0;
}
.vsn-entry-edit .vsn-add-entry__directions {
  margin-top: 2em;
}
.vsn-entry-edit .vsn-entry-edit-controls {
  margin-top: 0;
}
</style>
