import { computed, reactive, ref, watch, watchEffect } from 'vue'
import store from '../store'

export default function useLikes(payload) {
  const oPermits = payload.oPermits
  const oItem = payload.oItem
  const emit = payload.emit

  const gConfig = store.getters.getGConfig
  const likeLabel = gConfig.sLikeText
  const dislikeLabel = gConfig.sDislikeText

  const itemId = computed(() => oItem.id)
  const itemOwnerId = computed(() => oItem?.ownerId || '')

  const isHoverLike = ref(false)
  const isHoverDislike = ref(false)
  const hasLikes = ref(false)
  const hasDislikes = ref(false)

  const likeIsDisabled = oPermits.bUserAllowLike ? ref(false) : ref(true)
  watchEffect(() => {
    if (oPermits.bUserAllowLike && !oPermits.bUserAllowRevokeLike) {
      const isCurUserLike = computed(() => oItem.isCurUserLike)
      likeIsDisabled.value = !!isCurUserLike.value
    }
  })

  const dislikeIsDisabled = oPermits.bUserAllowDislike ? ref(false) : ref(true)
  watchEffect(() => {
    if (oPermits.bUserAllowDislike && !oPermits.bUserAllowRevokeDislike) {
      const isCurUserDislike = computed(() => oItem.isCurUserDislike)
      dislikeIsDisabled.value = !!isCurUserDislike.value
    }
  })

  const likesCount = computed(() => {
    const likes = oItem.likes
    hasLikes.value = likes > 0
    return likes
  })
  watch(likesCount, (cur, prev) => {
    if (oPermits.bUserAllowLike && !oPermits.bUserAllowRevokeLike) {
      likeIsDisabled.value = cur > prev
    }

    if (oPermits.bUserAllowRevokeLike) {
      if (cur != prev) {
        likeIsDisabled.value = false
      }
    }
  })

  const dislikesCount = computed(() => {
    const dislikes = oItem.dislikes
    hasDislikes.value = dislikes > 0
    return dislikes
  })
  watch(dislikesCount, (cur, prev) => {
    if (oPermits.bUserAllowDislike && !oPermits.bUserAllowRevokeDislike) {
      dislikeIsDisabled.value = cur > prev
    }

    if (oPermits.bUserAllowRevokeDislike) {
      if (cur != prev) {
        dislikeIsDisabled.value = false
      }
    }
  })

  watchEffect(() => {
    const isCurUserLike = computed(() => oItem.isCurUserLike)
    if (oPermits.bUserAllowDislike) {
      dislikeIsDisabled.value = isCurUserLike.value
    }
  })

  watchEffect(() => {
    const isCurUserDislike = computed(() => oItem.isCurUserDislike)
    if (oPermits.bUserAllowLike) {
      likeIsDisabled.value = isCurUserDislike.value
    }
  })

  function hoverLike(is) {
    if (hasLikes.value) {
      isHoverLike.value = is
    }
  }

  function hoverDislike(is) {
    if (hasDislikes.value) {
      isHoverDislike.value = is
    }
  }

  const paramsSetLike = reactive({
    sObjectId: itemId.value.toString(),
    sOwnerId: itemOwnerId.value.toString(),
    sCommand: 'like',
    bCanRevoke: oPermits.bUserAllowRevokeLike
  })

  const paramsSetDislike = reactive({
    sObjectId: itemId.value.toString(),
    sOwnerId: itemOwnerId.value.toString(),
    sCommand: 'dislike',
    bCanRevoke: oPermits.bUserAllowRevokeDislike
  })

  function setLike() {
    if (!likeIsDisabled.value) {
      store.dispatch('setLike', paramsSetLike)
      likeIsDisabled.value = true
    }
  }

  function setDislike() {
    if (!dislikeIsDisabled.value) {
      store.dispatch('setLike', paramsSetDislike)
      dislikeIsDisabled.value = true
    }
  }

  return {
    isHoverLike,
    isHoverDislike,
    hasLikes,
    hasDislikes,
    likeIsDisabled,
    dislikeIsDisabled,
    likesCount,
    dislikesCount,
    hoverLike,
    hoverDislike,
    setLike,
    setDislike,
    likeLabel,
    dislikeLabel,
    itemId,
    itemOwnerId,
    paramsSetLike,
    paramsSetDislike
  }
}
