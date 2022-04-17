class CurUser {
  constructor(payload) {
    this.id = payload.id || ''
    this.name = payload.name || ''
  }
}

class CollectionTarget {
  constructor(elem, index) {
    if (typeof elem == 'string') {
      this.id = elem.targetId
    } else {
      this.id = elem.targetId
      this.name = elem.targetTabName
      this.state = index == 0 ? 'active' : ''
    }
  }
}

export class Config {
  constructor(payload) {
    this.aFilters = payload.aFilters || []
    this.bAllowAttachments = payload.bAllowAttachments || false
    this.bAllowCommentAttachments = payload.bAllowCommentAttachments || false
    this.bAllowCommentAttachmentsFirstLevelOnly = payload.bAllowCommentAttachmentsFirstLevelOnly || false
    this.bAllowCreateTags = payload.bAllowCreateTags || false
    this.bAllowEdit = payload.bAllowEdit || false
    this.bAllowEntryAttachments = payload.bAllowEntryAttachments || false
    this.bAllowFilters = payload.bAllowFilters || false
    this.bAllowPostMsg = payload.bAllowPostMsg || false
    this.bAllowTags = payload.bAllowTags || false
    this.bAssessComment = payload.bAssessComment || false
    this.bAssessRootOnly = payload.bAssessRootOnly || false
    this.bGroupManagerAccess = payload.bGroupManagerAccess || false
    this.bUserAllowComment = payload.bUserAllowComment || false
    this.bUserAllowDislike = payload.bUserAllowDislike || false
    this.bUserAllowFollow = payload.bUserAllowFollow || false
    this.bUserAllowLike = payload.bUserAllowLike || false
    this.bUserAllowRevokeDislike = payload.bUserAllowRevokeDislike || false
    this.bUserAllowRevokeLike = payload.bUserAllowRevokeLike || false
    this.bUserAllowShare = payload.bUserAllowShare || false
    this.bUserAllowViewList = payload.bUserAllowViewList || false
    this.bUserViewDislike = payload.bUserViewDislike || false
    this.bUserViewLike = payload.bUserViewLike || false
    this.bOpenWholeThread = payload.bOpenWholeThread || false
    this.bOverrideUserSettings = payload.bOverrideUserSettings || false
    this.bSearch = payload.bSearch || false
    this.bUserAllowDeleteComment = payload.bUserAllowDeleteComment || false
    this.bUserAllowDeleteCommentedComment = payload.bUserAllowDeleteCommentedComment || false
    this.bUserAllowDeleteCommentedEntry = payload.bUserAllowDeleteCommentedEntry || false
    this.bUserAllowDeleteEntry = payload.bUserAllowDeleteEntry || false
    this.bUserAllowEditCommentedEntry = payload.bUserAllowEditCommentedEntry || false
    this.bUserAllowEditEntry = payload.bUserAllowEditEntry || false
    this.bUserAllowLockEntry = payload.bUserAllowLockEntry || false
    this.curUser = new CurUser(payload.curUser)
    this.iCollapseAfter = payload.iCollapseAfter
    this.iMaxAttachmentsQty = payload.iMaxAttachmentsQty || 0
    this.iThreadsOpen = payload.iThreadsOpen > 0 ? payload.iThreadsOpen - 1 : payload.iThreadsOpen
    this.sCustomStyles = payload.sCustomStyles || ''
    this.sDislikeText = payload.sDislikeText || ''
    this.sLikeText = payload.sLikeText || ''
    this.sRemoteCollectionId = payload.sRemoteCollectionId || ''
    this.sTargetCollectionId = Array.isArray(payload.sTargetCollectionId)
      ? payload.sTargetCollectionId.map((t, i) => new CollectionTarget(t, i))
      : payload.sTargetCollectionId
  }
}
