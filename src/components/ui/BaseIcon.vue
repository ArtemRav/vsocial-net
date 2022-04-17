<template>
  <div :class="['vsn-bgi-icon-main vsn-bgi-' + iconName, state]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    iconName: String,
    state: String
  },
  setup() {}
}
</script>

<style>
.vsn-bgi-filter {
  background-image: var(--bg-image-filter-icon);
}
.vsn-bgi-icon-main.vsn-bgi-filter {
  width: 1em;
  height: 1em;
  background-size: 2em;
}

.vsn-bgi-close {
  background-image: var(--bg-image-close-icon-gray);
}

.vsn-bgi-icon-main.vsn-bgi-blue-ellipsis {
  border-radius: 0;
  background-size: 2em;
  background-image: var(--bg-image-ellipsis-blue-icon);
}

.vsn-bgi-subs {
  background-image: var(--bg-image-time-icon);
}

.vsn-bgi-share {
  background-image: var(--bg-image-share-icon);
}

.vsn-bgi-del_entry,
.vsn-bgi-del_comment {
  background-image: var(--bg-image-basket-icon);
}

.vsn-bgi-edit_entry {
  background-image: var(--bg-image-edit-icon);
}

.vsn-bgi-block_entry {
  background-image: var(--bg-image-block-icon);
}

.vsn-bgi-like {
  background-image: var(--bg-image-like-icon-blue);
}

.vsn-bgi-dislike {
  background-image: var(--bg-image-dislike-icon-blue);
}

.vsn-bgi-comment {
  background-image: var(--bg-image-comment-icon-blue);
}

.vsn-bgi-comment:hover {
  background-image: var(--bg-image-comment-icon-white);
}

.vsn-bgi-comment.active {
  background-image: var(--bg-image-comment-icon-white);
}

.vsn-bgi-plus-blue,
.vsn-bgi-minus-blue {
  width: 1em;
  height: 1em;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1em;
  cursor: pointer;
}

.vsn-bgi-plus-blue {
  background-image: var(--bg-image-plus-icon-blue);
}

.vsn-bgi-minus-blue {
  background-image: var(--bg-image-minus-icon-blue);
}

.vsn-bgi-attach-black,
.vsn-bgi-attach-blue {
  width: 1em;
  height: 1em;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1em;
  cursor: pointer;
}

.vsn-bgi-attach-black {
  background-image: var(--bg-image-attach-icon-black);
}

.vsn-bgi-attach-blue {
  background-image: var(--bg-image-attach-icon-blue);
}

.vsn-bgi-icon-main.vsn-bgi-union,
.vsn-bgi-icon-main.vsn-bgi-union-center {
  width: 2.875em;
  height: 2.875em;
  background-size: auto;
  border-radius: 8px;
  background-color: var(--gray-0);
  transition: var(--toggle-btn-trtn);
}

.vsn-bgi-union.active,
.vsn-bgi-union-center.active {
  background-color: var(--blue-base);
}

.vsn-bgi-union {
  background-image: var(--bg-image-union-icon-black);
}

.vsn-bgi-union.active {
  background-image: var(--bg-image-union-icon-white);
}

.vsn-bgi-union-center {
  background-image: var(--bg-image-union-icon-center-black);
}

.vsn-bgi-union-center.active {
  background-image: var(--bg-image-union-icon-center-white);
}
</style>
