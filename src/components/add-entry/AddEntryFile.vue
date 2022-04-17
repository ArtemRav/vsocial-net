<template>
  <li class="vsn-entry-files-item">
    <BaseTag :custom-class="'item'" :state="'active'">
      <template v-slot:text>
        <div class="vsn-entry-file">
          <div class="vsn-entry-file__name vsn-overflow-ellipsis">{{ file.name }}</div>
          <div class="vsn-entry-file__size">{{ ' / ' + fileSize }}</div>
        </div>
      </template>
      <div :class="['vsn-bgi-icon-main', 'vsn-bgi-icon-close-white']" @click="deleteFile(file?.lastModified)"></div>
    </BaseTag>
  </li>
</template>

<script>
import BaseTag from '@/components/ui/BaseTag.vue'

import useGetFileSize from '@/hooks/file-size.js'

export default {
  components: {
    BaseTag
  },
  props: {
    file: Object
  },
  emits: ['remove'],
  setup(props, { emit }) {
    const { fileSize } = useGetFileSize(props.file.size)

    function deleteFile(lastModified) {
      emit('remove', lastModified)
    }

    return {
      fileSize,
      deleteFile
    }
  }
}
</script>

<style>
.vsn-entry-files-item {
  list-style: none;
}
.vsn-entry-file {
  width: 92%;
}
.vsn-entry-file .vsn-entry-file__size,
.vsn-entry-file .vsn-entry-file__name {
  float: left;
}
.vsn-entry-file .vsn-entry-file__name {
  max-width: 66%;
}
.item .vsn-bgi-icon-close-white {
  width: 1em;
  height: 1em;
  background-size: 0.8em;
  margin-left: 0.5em;
  background-image: var(--bg-image-close-icon-white);
}
</style>
