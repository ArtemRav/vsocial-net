<template>
  <div class="vsn-entry-comments-list">
    <transition-group name="scale">
      <BaseComment v-for="comment in commentList" :key="comment.id" :comment="comment"></BaseComment>
    </transition-group>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'

export default {
  props: {
    comments: Array
  },
  setup(props) {
    const commentList = computed(() => {
      return props.comments
    })

    return {
      commentList
    }
  }
}
</script>

<style>
.vsn-entry-comments-list {
  width: 100%;
}
.vsn-entry-comments-list .vsn-base-comment {
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  margin: 0;
}
.vsn-entry-comments-list .vsn-base-comment.is-full {
  padding-left: 0;
}
.vsn-entry-comments-list .vsn-soc-controls {
  background-color: var(--gray-5);
  padding: 0 1.3rem 1em;
  margin-bottom: 0.5em;
}
.vsn-entry-comments-list .vsn-soc-controls .vsn-soc-btn {
  background-color: inherit;
  border: 1px solid var(--gray-30);
}
</style>
