<template>
  <li class="vsn-entry-tags-item">
    <BaseTag :custom-class="'item'" :name="tag.name" class="is-active">
      <div :class="['vsn-bgi-icon-main', 'vsn-bgi-icon-close-white']" @click="deleteTag(tag.id)"></div>
    </BaseTag>
  </li>
</template>

<script>
import BaseTag from '@/components/ui/BaseTag.vue'

export default {
  components: {
    BaseTag
  },
  props: {
    tag: Object
  },
  emits: ['delete'],
  setup(_, { emit }) {
    function deleteTag(id) {
      emit('delete', id)
    }

    return {
      deleteTag
    }
  }
}
</script>

<style>
.vsn-entry-tags-item {
  list-style: none;
  max-width: 100%;
}
.item .vsn-bgi-icon-close-white {
  width: 1em;
  height: 1em;
  background-size: 0.8em;
  margin-left: 0.5em;
  background-image: var(--bg-image-close-icon-white);
}
</style>
