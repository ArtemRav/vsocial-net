import { computed, ref, watch, watchEffect } from 'vue'
import store from '../store'

export default class ItemComment {
  constructor(payload) {
    this.itemData = payload.oItem
    this.oPermits = payload.oPermits

    this.CANCEL = store.getters.getCONST_CancelComment
    this.TO_COMMENT = store.getters.getCONST_CommentThis
    this.EXPAND_COMMENTS = store.getters.getCONST_ExpandComments
    this.COLLAPSE_COMMENTS = store.getters.getCONST_CollapseComments

    this.likeAction = ref(null)
    this.inputCommentIsOpened = ref(false)
    this.commentsLabel = ref(this.EXPAND_COMMENTS)
    this.isNewCommentPosted = ref(true)

    this.commentsIsExpanded = ref(false)
    watch(this.commentsIsExpanded, cur => {
      this.commentsLabel.value = (cur ? this.COLLAPSE_COMMENTS : this.EXPAND_COMMENTS) + ': '
    })

    this.inputCommentIsBlocked = ref(this.itemData.blocked)
    if (this.itemData.type == 'comment') {
      watchEffect(() => {
        const isBlocked = computed(() => store.getters.getItemById(this.itemData.ownerId)?.blocked)
        this.inputCommentIsBlocked.value = isBlocked.value
      })
    } else {
      watchEffect(() => {
        const isBlocked = computed(() => this.itemData.blocked)
        this.inputCommentIsBlocked.value = isBlocked.value
      })
    }

    this.isAllowComment = ref(false)
    watchEffect(() => {
      const isAllow = computed(() => this.oPermits.bUserAllowComment)
      const isBlocked = computed(() => this.inputCommentIsBlocked.value)
      this.isAllowComment.value = isAllow.value && !isBlocked.value
    })

    this.commentEntryLabel = ref(this.TO_COMMENT)
    this.commentEntryState = ref('')
    watch(this.inputCommentIsOpened, cur => {
      if (cur) {
        this.commentEntryLabel.value = this.CANCEL
        this.commentEntryState.value = 'active'
      } else {
        this.commentEntryLabel.value = this.TO_COMMENT
        this.commentEntryState.value = ''
      }
    })

    this.commentsCount = computed(() => this.itemData.comments.length)
    watch(this.commentsCount, (cur, prev) => {
      if (cur > prev) {
        this.isNewCommentPosted.value = true
      }
    })

    this.gIsCommentsExpanded = computed(() => store.getters.getgIsCommentsExpanded)
    watch(this.gIsCommentsExpanded, cur => {
      if (this.commentsCount.value > 0) {
        this.expandComments(cur)
      }
    })

    /* =============================== Bind functions to CONTEXT class ================================= */

    this.openInputComment = this.openInputComment.bind(this)
    this.closeInputComment = this.closeInputComment.bind(this)
    this.expandComments = this.expandComments.bind(this)
  }

  openInputComment(action) {
    this.inputCommentIsOpened.value = !this.inputCommentIsOpened.value

    if (action) {
      this.likeAction.value = action
    }
  }

  closeInputComment(canceled) {
    this.inputCommentIsOpened.value = false

    this.isNewCommentPosted.value = canceled
  }

  expandComments(isExpanded) {
    this._getItemComments()

    if (isExpanded !== null) {
      if (isExpanded != this.commentsIsExpanded.value) {
        this.commentsIsExpanded.value = isExpanded
      }
    } else {
      this.commentsIsExpanded.value = !this.commentsIsExpanded.value
    }
  }

  /* ====================================== Service functions ========================================= */

  _getItemComments() {
    if (this.itemData.type != 'comment' && typeof this.itemData.comments[0] === 'string') {
      store.dispatch('getItemComments', {
        sItemID: this.itemData.id,
        sItemType: this.itemData.type,
        sItemComments: this.itemData.comments.join(',')
      })
    }
  }
}
