<template>
  <div class="vsn-entry-comment">
    <div class="vsn-filter-divider"></div>
    <form class="vsn-entry-comment__form">
      <AddEntryText v-model="newComment.sText"></AddEntryText>
      <EntryCommentFilesList :comment-level="commentLevel" :entry-files="[]" @change-files-list="updateFiles"></EntryCommentFilesList>
      <BaseSendControls :is-disabled="!hasText" :warning="WARNING" @cancel-form="cancelComment" @send-form="postComment"></BaseSendControls>
    </form>
  </div>
</template>

<script>
import AddEntryText from '@/components/add-entry/AddEntryText.vue'
import EntryCommentFilesList from './EntryCommentFilesList.vue'
import BaseSendControls from '@/components/ui/BaseSendControls.vue'

import { reactive, ref } from '@vue/reactivity'
import { computed, inject, watch } from '@vue/runtime-core'

import useGetEntryItem from '@/hooks/get-entry-item.js'

export default {
  emits: ['post-comment', 'cancel-comment'],
  components: {
    AddEntryText,
    EntryCommentFilesList,
    BaseSendControls
  },
  props: {
    likeAction: Object,
    commentLevel: Number
  },
  setup(props, { emit }) {
    const { store, entryItem: entryObject } = useGetEntryItem(inject)

    const WARNING = store.getters.getCONST_DisabledWarningComment
    const objectId = computed(() => (entryObject?.ownerId ? entryObject.ownerId : entryObject.id))
    const parentId = computed(() => (entryObject?.parentId ? entryObject.id : '')) // если есть parentId => это comment, его id является parent для new comment

    const hasText = ref(false)
    const newComment = reactive({
      sObjectID: objectId.value,
      sParentID: parentId.value,
      sText: '',
      aFiles: []
    })
    const entryComments = computed(() => {
      return store.getters.getItemCommentsById(newComment.sObjectID)
    })

    watch(newComment, cur => {
      if (cur.sText.length > 0) {
        hasText.value = true
      } else {
        hasText.value = false
      }
    })

    function updateFiles(payload) {
      newComment.aFiles = payload.length > 0 ? payload : []
    }

    function cancelComment() {
      emit('cancel-comment')
    }

    function postComment() {
      emit('post-comment')

      if (entryComments.value.length === 0 || typeof entryComments.value[0] !== 'object') {
        store.dispatch('getItemComments', {
          sItemID: entryObject.id,
          sItemType: entryObject.type,
          sItemComments: entryObject.comments.lentgh > 0 ? entryObject.comments.join(',') : ''
        })
      }

      store.dispatch('postComment', newComment)

      if (props.likeAction) {
        store.dispatch(props.likeAction.name, props.likeAction.params)
      }
    }

    return {
      WARNING,
      hasText,
      updateFiles,
      newComment,
      cancelComment,
      postComment
    }
  }
}
</script>

<style>
.vsn-entry-comment,
.vsn-entry-comment__form {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 0.5em;
}
.vsn-entry-comment .vsn-filter-divider {
  margin: 1rem 0 2rem 0;
}
.vsn-entry-comment .vsn-entry-comment-controls {
  margin-top: 0;
}
</style>
