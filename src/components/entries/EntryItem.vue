<template>
  <li class="vsn-entry-item__wrapper">
    <BaseCard class="vsn-entry-item" :id="item.id" :class="{ expanded: itemCommentsIsExpanded }">
      <template v-slot:default>
        <transition name="modal">
          <div class="vsn-entry-item__main" v-if="!isEdit">
            <EntryItemInfo @open-share="openEntryShare(true)" @edit-entry="editEntry(true)" @block-entry="blockEntry"></EntryItemInfo>

            <TheSocControlsItem @provide-item-data="injectItemData"></TheSocControlsItem>
          </div>
        </transition>

        <transition name="modal">
          <EntryEdit v-if="isEdit" @cancel-edit="editEntry(false)"></EntryEdit>
        </transition>

        <transition name="slide-down">
          <EntryComment
            v-if="itemData.inputCommentIsOpened"
            @post-comment="itemData.closeInputComment"
            @cancel-comment="itemData.closeInputComment(true)"
            :like-action="itemData.likeAction"
          ></EntryComment>
        </transition>

        <transition name="slide-down">
          <EntryShare v-if="entryShareIsOpened" @cancel-share="openEntryShare(false)"></EntryShare>
        </transition>
      </template>
    </BaseCard>

    <transition name="grow-down">
      <BaseCard class="vsn-base-card-comments" v-if="itemData.commentsIsExpanded || !itemData.isNewCommentPosted">
        <BaseLoader class="vsn-entries__loader" v-if="!hasComments || !itemData.isNewCommentPosted"></BaseLoader>

        <BaseCommentsList v-if="hasComments" :comments="entryCommentsSub"></BaseCommentsList>
      </BaseCard>
    </transition>
  </li>
</template>

<script>
import BaseCard from '@/components/ui/BaseCard.vue'
import EntryItemInfo from './EntryItemInfo.vue'
import TheSocControlsItem from '@/components/layouts/TheSocControlsItem.vue'
import EntryComment from '@/components/entry-comment/EntryComment.vue'

import { ref } from '@vue/reactivity'
import { computed, provide, watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
  props: {
    item: Object
  },
  components: {
    BaseCard,
    EntryItemInfo,
    TheSocControlsItem,
    EntryComment
  },
  setup(props) {
    const store = useStore()

    const isEdit = ref(false)
    const entryShareIsOpened = ref(false)
    const hasComments = ref(false)
    const sListComments = ref('')
    const entryCommentsSub = ref([])

    const entryItem = computed(() => props.item)
    provide('entryItem', entryItem.value)

    watchEffect(() => {
      const commenList = computed(() => entryItem.value.comments)

      if (commenList.value.length > 0) {
        if (typeof commenList.value[0] === 'object') {
          entryCommentsSub.value = commenList.value.filter(c => c.parentId == entryItem.value.id)
          hasComments.value = true
          itemData.value.commentsIsExpanded = true
        } else {
          sListComments.value = commenList.value.join(',')
        }
      } else if (itemData) {
        itemData.value.commentsIsExpanded = false
      }
    })

    function openEntryShare(is_open) {
      entryShareIsOpened.value = is_open
    }

    function editEntry(is) {
      isEdit.value = is
    }

    const itemData = ref(null)
    function injectItemData(data) {
      itemData.value = data
    }

    const itemCommentsIsExpanded = ref(false)
    watchEffect(() => {
      const isCommentsExpanded = computed(() => itemData.value?.commentsIsExpanded)
      itemCommentsIsExpanded.value = isCommentsExpanded.value
    })

    function blockEntry() {
      store.dispatch('fireRmtAction', { sObjectID: entryItem.value.id, action: 'BlockSocialItem' })
    }

    return {
      itemData,
      itemCommentsIsExpanded,
      isEdit,
      editEntry,
      entryShareIsOpened,
      openEntryShare,
      injectItemData,
      blockEntry,
      hasComments,
      entryCommentsSub
    }
  }
}
</script>

<style>
.vsn-entry-item__wrapper {
  list-style-type: none;
}
.vsn-entry-item__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
}
.vsn-entry-item {
  margin-top: 1em;
}
.vsn-entry-item.expanded {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.vsn-entry-item.expanded .vsn-entries-list .vsn-soc-controls {
  margin-bottom: 0;
}
.vsn-base-card-comments {
  border-top: 1px solid var(--gray-30);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: 0;
}
.vsn-base-card-comments > .vsn-entry-comments-list > .vsn-base-comment {
  padding: 0;
}
.vsn-base-card-comments .vsn-entries__loader {
  margin-bottom: 3em;
}
</style>
