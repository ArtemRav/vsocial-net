<template>
  <BaseCard class="vsn-base-comment" :class="{ 'is-full': isFull }">
    <template v-slot:default>
      <EntryItemInfo></EntryItemInfo>

      <TheSocControlsItem
        @provide-item-data="injectItemData"
        :comment-level="commentLevel"
        :is-not-out-date="isNotOutDate"
      ></TheSocControlsItem>

      <transition name="slide-down">
        <EntryComment
          v-if="itemData.inputCommentIsOpened"
          :like-action="itemData.likeAction"
          :comment-level="commentLevel"
          @post-comment="itemData.closeInputComment"
          @cancel-comment="itemData.closeInputComment(true)"
        ></EntryComment>
      </transition>

      <transition name="slide-down">
        <div class="vsn-base-comment__list" v-if="commentChildrenIsExpanded || !itemData.isNewCommentPosted">
          <BaseLoader class="vsn-entries__loader" v-if="!itemData.isNewCommentPosted"></BaseLoader>

          <BaseCommentsList :comments="commentChildren"></BaseCommentsList>
        </div>
      </transition>
    </template>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/ui/BaseCard.vue'
import EntryItemInfo from '@/components/entries/EntryItemInfo.vue'
import TheSocControlsItem from '@/components/layouts/TheSocControlsItem.vue'
import EntryComment from '@/components/entry-comment/EntryComment.vue'

import { ref } from '@vue/reactivity'
import { computed, provide, watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'

import moment from 'moment'

export default {
  props: {
    comment: Object
  },
  components: {
    BaseCard,
    EntryItemInfo,
    TheSocControlsItem,
    EntryComment
  },
  setup(props) {
    const store = useStore()
    const gConfig = store.getters.getGConfig

    const isFull = ref(false)
    const commentLevel = ref(1)
    const commentChildren = ref([])
    const commentHasChildren = ref(false)

    const curComment = computed(() => props.comment)

    const itemData = ref(null)
    function injectItemData(data) {
      itemData.value = data
    }

    const commentChildrenIsExpanded = ref(false)
    watchEffect(() => {
      const isExpanded = computed(() => commentHasChildren.value && itemData?.value?.commentsIsExpanded)
      // const gIsCommentsExpanded = computed(() => store.getters.getgIsCommentsExpanded)
      commentChildrenIsExpanded.value = isExpanded.value //|| gIsCommentsExpanded.value
    })

    const isNotOutDate = ref(false)
    watchEffect(() => {
      const item = computed(() => store.getters.getItemById(curComment.value.ownerId))
      const itemComments = computed(() => item.value?.comments || [])

      commentChildren.value = itemComments.value.filter(c => c.parentId == curComment.value.id)
      curComment.value.comments = commentChildren.value

      if (commentChildren.value.length > 0) {
        commentHasChildren.value = true
        commentLevel.value = _checkNestedLevel(itemComments.value, curComment.value.id, item.value.id, 1)

        isNotOutDate.value = _checkFlowCommentsDate(commentChildren.value)

        if (commentLevel.value > 4) {
          isFull.value = true
        }
      }
    })

    function _checkNestedLevel(comments, id, postID, level) {
      let cmnt = comments.filter(c => c.id == id && c?.parentId && c.parentId != postID)

      if (cmnt.length > 0) {
        level++
        return _checkNestedLevel(comments, cmnt[0].parentId, postID, level)
      }

      return level
    }

    function _checkFlowCommentsDate(commentsSub) {
      if (gConfig.iCollapseAfter == 0) {
        return true
      } else {
        const commentsOutDate = commentsSub.filter(c => {
          if (c.date && moment(c.date, moment.ISO_8601, true).isValid()) {
            const nowDate = Date.parse(moment().format('YYYY-MM-DD'))
            const createDate = Date.parse(moment(c.date).format('YYYY-MM-DD'))
            const daysDiff = (nowDate - createDate) / 86400000

            return daysDiff > gConfig.iCollapseAfter
          }
        })

        return commentsOutDate.length == 0
      }
    }

    provide('entryItem', curComment.value)

    return {
      isFull,
      itemData,
      isNotOutDate,
      commentLevel,
      injectItemData,
      commentChildren,
      commentHasChildren,
      commentChildrenIsExpanded
    }
  }
}
</script>

<style>
.vsn-base-comment.is-full {
  padding-left: 0;
}
.vsn-base-comment .vsn-base-comment__list {
  display: flex;
  width: 100%;
  flex-direction: column;
}
</style>
