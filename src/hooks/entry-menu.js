import { useStore } from 'vuex'
import { computed, watch } from '@vue/runtime-core'
import { ref, reactive } from '@vue/reactivity'

export default function useEntryMenu(entryItem) {
  const store = useStore()

  const menuItems = ref([])

  const SUBSCRIBE = store.getters.getCONST_Follow
  const UNSUBSCRIBE = store.getters.getCONST_Unfollow
  const SHARE = store.getters.getCONST_ShareEntry
  const DELETE_ENTRY = store.getters.getCONST_DeleteEntry
  const EDIT_ENTRY = store.getters.getCONST_EditEntry
  const BLOCK_ENTRY = store.getters.getCONST_LockEntry
  const UNBLOCK_ENTRY = store.getters.getCONST_UnlockEntry
  const DELETE_COMMENT = store.getters.getCONST_DeleteComment

  const gConfig = store.getters.getGConfig
  const bAllowEdit = gConfig.bAllowEdit

  const oSocPermits = reactive({
    bUserAllowLockEntry: gConfig.bUserAllowLockEntry,
    bUserAllowDeleteEntry: gConfig.bUserAllowDeleteEntry,
    bUserAllowDeleteCommentedEntry: gConfig.bUserAllowDeleteCommentedEntry,
    bUserAllowDeleteComment: gConfig.bUserAllowDeleteComment,
    bUserAllowDeleteCommentedComment: gConfig.bUserAllowDeleteCommentedComment,
    bUserAllowEditEntry: gConfig.bUserAllowEditEntry,
    bUserAllowEditCommentedEntry: gConfig.bUserAllowEditCommentedEntry,

    bUserAllowFollow: gConfig.bUserAllowFollow,
    bUserAllowShare: gConfig.bUserAllowShare
  })

  if (!bAllowEdit) {
    oSocPermits.bUserAllowLockEntry = false
    oSocPermits.bUserAllowDeleteEntry = false
    oSocPermits.bUserAllowDeleteCommentedEntry = false
    oSocPermits.bUserAllowDeleteComment = false
    oSocPermits.bUserAllowDeleteCommentedComment = false
    oSocPermits.bUserAllowEditEntry = false
    oSocPermits.bUserAllowEditCommentedEntry = false
  }

  if (!gConfig.bOverrideUserSettings) {
    oSocPermits.bUserAllowFollow = !!entryItem.access.allowFollow
    oSocPermits.bUserAllowShare = !!entryItem.access.allowShare
  }

  const isBlogEntry = entryItem.type == 'blog_entry'
  const isComment = entryItem.type == 'comment'
  const isCurUserAutorComment = isComment ? entryItem.person.id == gConfig.curUser.id : false
  const isCurUserAutor = entryItem.person.id == gConfig.curUser.id
  const hasEntryComments = computed(() => store.getters.getItemCommentsById(entryItem.id).length > 0)
  const hasCommentChilds = computed(() => {
    if (isComment) {
      const entryComments = computed(() => store.getters.getItemCommentsById(entryItem.ownerId))
      const commentChilds = entryComments.value.filter(c => c.parentId == entryItem.id)

      if (commentChilds.length > 0) {
        return true
      }
    }
    return false
  })

  const isEntryBlocked = computed(() => entryItem.blocked)
  const actionBlockName = isEntryBlocked.value ? ref(UNBLOCK_ENTRY) : ref(BLOCK_ENTRY)
  watch(isEntryBlocked, cur => {
    if (isAllowBlockEntry) {
      let indexBlockAction = menuItems.value.map(i => i.type).indexOf('block_entry')

      if (~indexBlockAction) {
        menuItems.value[indexBlockAction].name = cur ? UNBLOCK_ENTRY : BLOCK_ENTRY
      }
    }
  })

  const isAllowBlockEntry = isBlogEntry && oSocPermits.bUserAllowLockEntry && isCurUserAutor
  const isAllowDeleteEntry = computed(() => {
    return (
      entryItem.canDelete &&
      isCurUserAutor &&
      oSocPermits.bUserAllowDeleteEntry &&
      (!hasEntryComments.value || (hasEntryComments.value && oSocPermits.bUserAllowDeleteCommentedEntry))
    )
  })
  const isAllowDeleteComment = computed(() => {
    return (
      isComment &&
      isCurUserAutorComment &&
      oSocPermits.bUserAllowDeleteComment &&
      (!hasCommentChilds.value || (hasCommentChilds.value && oSocPermits.bUserAllowDeleteCommentedComment))
    )
  })
  const isAllowEdit = computed(() => {
    return (
      isBlogEntry &&
      oSocPermits.bUserAllowEditEntry &&
      isCurUserAutor &&
      (!hasEntryComments.value || (hasEntryComments.value && oSocPermits.bUserAllowEditCommentedEntry))
    )
  })

  const isAllowSubscribe = isBlogEntry && oSocPermits.bUserAllowFollow
  const hasEntrySubscription = computed(() => entryItem.hasSubscription)
  const actionSubsName = hasEntrySubscription.value ? ref(UNSUBSCRIBE) : ref(SUBSCRIBE)
  watch(hasEntrySubscription, cur => {
    if (isAllowSubscribe) {
      let indexBlockAction = menuItems.value.map(i => i.type).indexOf('subs')

      if (~indexBlockAction) {
        menuItems.value[indexBlockAction].name = cur ? UNSUBSCRIBE : SUBSCRIBE
      }
    }
  })

  if (isAllowBlockEntry) {
    menuItems.value.push({
      type: 'block_entry',
      name: actionBlockName.value
    })
  }
  if (isAllowDeleteEntry.value) {
    menuItems.value.push({
      type: 'del_entry',
      name: DELETE_ENTRY
    })
  }
  if (isAllowDeleteComment.value) {
    menuItems.value.push({
      type: 'del_comment',
      name: DELETE_COMMENT
    })
  }
  if (isAllowEdit.value) {
    menuItems.value.push({
      type: 'edit_entry',
      name: EDIT_ENTRY
    })
  }

  if (isAllowSubscribe) {
    menuItems.value.push({
      type: 'subs',
      name: actionSubsName
    })
  }
  if (isBlogEntry && oSocPermits.bUserAllowShare) {
    menuItems.value.push({
      type: 'share',
      name: SHARE
    })
  }

  return {
    menuItems
  }
}
