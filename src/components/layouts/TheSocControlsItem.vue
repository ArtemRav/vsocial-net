<template>
  <div class="vsn-soc-controls vsn-full-size-box">
    <div class="vsn-soc-controls-left">
      <div class="vsn-soc-buttons">
        <BaseIcon
          v-if="oSocPermits.bUserViewLike"
          :icon-name="'like'"
          class="vsn-soc-btn"
          :class="{ disabled: likeIsDisabled }"
          @click="setItemLike"
          @mouseover.self="hoverLike(true)"
          @mouseleave.self="hoverLike(false)"
        >
          <transition name="bounce">
            <div class="vsn-sc-badge" v-if="hasLikes">{{ likesCount }}</div>
          </transition>

          <TheLikeUsersView
            :id="itemId"
            :owner="itemOwnerId"
            :type="'like'"
            :is-allow-view-list="oSocPermits.bUserAllowViewList"
            :is-hover="isHoverLike"
            :views="viewLikePersons"
          ></TheLikeUsersView>
        </BaseIcon>

        <BaseSocControlLabel
          class="vsn-cos-btn__label"
          :class="{ disabled: likeIsDisabled }"
          v-if="oSocPermits.bUserViewLike && likeLabel"
          :text="likeLabel"
          @click="setItemLike"
        />

        <BaseIcon
          v-if="oSocPermits.bUserViewDislike"
          :icon-name="'dislike'"
          class="vsn-soc-btn"
          :class="{ disabled: dislikeIsDisabled }"
          @click="setItemDislike"
          @mouseover.self="hoverDislike(true)"
          @mouseleave.self="hoverDislike(false)"
        >
          <transition name="bounce">
            <div class="vsn-sc-badge" v-if="hasDislikes">{{ dislikesCount }}</div>
          </transition>

          <TheLikeUsersView
            :id="itemId"
            :owner="itemOwnerId"
            :type="'dislike'"
            :is-allow-view-list="oSocPermits.bUserAllowViewList"
            :is-hover="isHoverDislike"
            :views="viewDislikePersons"
          ></TheLikeUsersView>
        </BaseIcon>

        <BaseSocControlLabel
          class="vsn-cos-btn__label"
          :class="{ disabled: dislikeIsDisabled }"
          v-if="oSocPermits.bUserViewDislike && dislikeLabel"
          :text="dislikeLabel"
          @click="setItemDislike"
        />
      </div>

      <div v-if="itemData.isAllowComment.value" class="vsn-ver-divider"></div>
      <div v-if="itemData.isAllowComment.value" class="vsn-give-comment" @click="itemData.openInputComment(false)">
        <BaseIcon :icon-name="'comment'" :state="itemData.commentEntryState.value" class="vsn-add-comment vsn-soc-btn"></BaseIcon>
        <div class="vsn-fc-blue-base vsn-entry-base-fnt vsn-soc-btn--label">{{ itemData.commentEntryLabel.value }}</div>
      </div>
    </div>

    <div class="vsn-soc-controls-right" v-if="itemData.commentsCount.value" @click="itemData.expandComments(null)">
      <div class="vsn-comment-label vsn-entry-light-gray-fnt vsn-fc-blue-base">
        {{ itemData.commentsLabel.value }}
      </div>

      <div class="vsn-comment-informer vsn-entry-light-gray-fnt vsn-fc-gray-100">{{ commentsNum }}</div>
    </div>
  </div>
</template>

<script>
import BaseSocControlLabel from '@/components/ui/BaseSocControlLabel.vue'

import { computed, inject, onBeforeMount, onMounted, reactive, ref, watch } from '@vue/runtime-core'

import useLikes from '@/hooks/likes.js'
import ItemComment from '@/hooks/item-comment.js'
import useGetEntryItem from '@/hooks/get-entry-item.js'

export default {
  components: {
    BaseSocControlLabel
  },
  emits: ['provide-item-data'],
  props: {
    commentLevel: Number,
    isNotOutDate: Boolean
  },
  setup(props, { emit }) {
    const { store, entryItem } = useGetEntryItem(inject)

    const gConfig = store.getters.getGConfig

    const viewLikePersons = computed(() => entryItem.viewLikePersons)
    const viewDislikePersons = computed(() => entryItem.viewDislikePersons)
    const entryItemIsComment = computed(() => entryItem.type == 'comment')

    /* ============================================= Social permits ============================================= */

    const oSocPermits = reactive({
      bUserViewLike: gConfig.bUserViewLike,
      bUserAllowLike: gConfig.bUserAllowLike,
      bUserAllowRevokeLike: gConfig.bUserAllowRevokeLike,
      bUserViewDislike: gConfig.bUserViewDislike,
      bUserAllowDislike: gConfig.bUserAllowDislike,
      bUserAllowRevokeDislike: gConfig.bUserAllowRevokeDislike,
      bUserAllowComment: gConfig.bUserAllowComment,
      bUserAllowFollow: gConfig.bUserAllowFollow,
      bUserAllowShare: gConfig.bUserAllowShare,
      bUserAllowViewList: gConfig.bUserAllowViewList
    })

    if (!gConfig.bOverrideUserSettings) {
      oSocPermits.bUserViewLike = !!entryItem.access.viewLike
      oSocPermits.bUserAllowLike = !!entryItem.access.allowLike
      oSocPermits.bUserViewDislike = !!entryItem.access.viewDislike
      oSocPermits.bUserAllowDislike = !!entryItem.access.allowDislike
      oSocPermits.bUserAllowComment = !!entryItem.access.allowComment
      oSocPermits.bUserAllowFollow = !!entryItem.access.allowFollow
      oSocPermits.bUserAllowShare = !!entryItem.access.allowShare
      oSocPermits.bUserAllowViewList = !!entryItem.access.allowViewList
    }

    if (gConfig.bAssessRootOnly && entryItemIsComment.value) {
      oSocPermits.bUserViewLike = false
      oSocPermits.bUserViewDislike = false
    }

    /* ============================================= Likes/Dislikes ============================================= */

    const {
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
    } = useLikes({
      oPermits: oSocPermits,
      oItem: entryItem,
      emit: emit
    })

    function setItemLike() {
      if (gConfig.bAssessComment && !likeIsDisabled.value) {
        itemData.openInputComment({
          name: 'setLike',
          params: paramsSetLike
        })
      } else {
        setLike()
      }
    }

    function setItemDislike() {
      if (gConfig.bAssessComment && !dislikeIsDisabled.value) {
        itemData.openInputComment({
          name: 'setLike',
          params: paramsSetDislike
        })
      } else {
        setDislike()
      }
    }

    /* ================================================ Comments ================================================ */

    const itemData = new ItemComment({ oItem: entryItem, oPermits: oSocPermits })
    const isNotOutDate = computed(() => props.isNotOutDate)

    const commentsNum = ref(0)
    if (entryItem.type === 'comment') {
      commentsNum.value = store.getters.getCommentChildren({
        id: entryItem.id,
        entryId: entryItem.ownerId
      })
    } else {
      commentsNum.value = itemData.commentsCount.value
    }

    watch(itemData.commentsCount, cur => {
      if (cur) {
        commentsNum.value = cur
      }
    })

    onBeforeMount(() => {
      emit('provide-item-data', itemData)
    })

    onMounted(() => {
      if (
        entryItemIsComment.value &&
        (gConfig.bOpenWholeThread || (gConfig.iThreadsOpen > 0 && props.commentLevel <= gConfig.iThreadsOpen && isNotOutDate.value))
      ) {
        itemData.expandComments(null)
      }
    })

    return {
      oSocPermits,
      viewLikePersons,
      viewDislikePersons,
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
      likeLabel,
      dislikeLabel,
      itemId,
      itemOwnerId,
      setItemLike,
      setItemDislike,
      itemData,
      commentsNum
    }
  }
}
</script>

<style>
.vsn-give-comment,
.vsn-soc-btn--label,
.vsn-soc-controls,
.vsn-soc-controls-left,
.vsn-soc-controls > div,
.vsn-soc-controls-left > div {
  display: flex;
}
.vsn-soc-controls {
  justify-content: space-between;
  padding: 0.75rem 1.3em;
}
.vsn-soc-controls .vsn-soc-btn {
  position: relative;
  width: 2.5em;
  height: 2.5em;
  margin-right: 0.5em;
  background-color: var(--gray-10);
  border-radius: 50%;
  cursor: pointer;
  transition: var(--toggle-btn-trtn);
}

.vsn-soc-controls .vsn-soc-buttons .vsn-soc-btn.disabled,
.vsn-soc-controls .vsn-soc-buttons .vsn-soc-btn.disabled:hover {
  cursor: unset;
  opacity: 0.3;
  background-color: var(--gray-50);
}

.vsn-soc-controls .vsn-soc-buttons .vsn-bgi-like:hover {
  background-image: var(--bg-image-like-icon-white);
}

.vsn-soc-controls .vsn-soc-buttons .vsn-bgi-like.disabled:hover {
  background-image: var(--bg-image-like-icon-blue);
}

.vsn-soc-controls .vsn-soc-buttons .vsn-bgi-dislike:hover {
  background-image: var(--bg-image-dislike-icon-white);
}

.vsn-soc-controls .vsn-soc-buttons .vsn-bgi-dislike.disabled:hover {
  background-image: var(--bg-image-dislike-icon-blue);
}

.vsn-soc-controls .vsn-soc-buttons .vsn-soc-btn.disabled:hover .vsn-sc-badge {
  background-color: var(--blue-base);
  border: 1px solid var(--blue-base);
  color: var(--gray-0);
}

.vsn-soc-controls .vsn-soc-buttons .vsn-soc-btn:hover,
.vsn-soc-controls-left .vsn-give-comment:hover .vsn-add-comment,
.vsn-soc-controls-left .vsn-give-comment .vsn-add-comment.active,
.vsn-soc-controls .vsn-add-comment.active {
  background-color: var(--blue-base);
}

.vsn-soc-controls .vsn-add-comment {
  margin-left: 0.5em;
}
.vsn-soc-controls-left .vsn-give-comment:hover .vsn-add-comment {
  background-image: var(--bg-image-comment-icon-white);
}
.vsn-soc-controls-left .vsn-give-comment,
.vsn-soc-controls-right {
  cursor: pointer;
}

.vsn-soc-controls .vsn-soc-btn .vsn-sc-badge {
  position: absolute;
  top: -0.375em;
  right: -0.25em;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1.8em;
  padding: 0.063rem 0.438em;
  background-color: var(--blue-base);
  border: 1px solid var(--blue-base);
  border-radius: 99px;
  color: var(--gray-0);
  font-size: 0.625em;
  transition: var(--toggle-btn-trtn);
}
.vsn-soc-controls .vsn-soc-btn:hover .vsn-sc-badge {
  border: 1px solid var(--blue-base);
  background-color: var(--gray-0);
  color: var(--blue-base);
}

.vsn-soc-btn--label {
  flex-grow: 1;
  align-items: center;
}
.vsn-comment-label,
.vsn-comment-informer {
  display: flex;
  height: 100%;
  align-items: center;
}
.vsn-comment-label {
  margin-right: 0.5em;
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-entries-list .vsn-entry-item .vsn-soc-controls,
  .vsn-entry-comments-list .vsn-soc-controls {
    flex-direction: column;
  }
  .vsn-entries-list .vsn-entry-item .vsn-soc-controls .vsn-soc-controls-left,
  .vsn-entry-comments-list .vsn-soc-controls .vsn-soc-controls-left {
    justify-content: space-between;
  }
  .vsn-soc-btn--label {
    display: none;
  }
  .vsn-soc-controls-right {
    margin-top: 1em;
  }
  .vsn-soc-controls .vsn-add-comment,
  .vsn-entry-comments-list .vsn-soc-controls .vsn-soc-btn.vsn-bgi-comment {
    margin: 0;
  }
}
</style>
