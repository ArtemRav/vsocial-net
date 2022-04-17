<template>
  <li class="vsn-ecf">
    <div v-if="isImage" class="vsn-ecf__preview" :style="{ 'background-image': 'url(' + fileUrl + ')' }"></div>
    <div v-else class="vsn-ecf__preview">
      <div class="vsn-ecf__preview__icon"></div>
    </div>
    <div class="vsn-ecf__delete" @click="deleteFile(file?.lastModified)"></div>
    <div class="vsn-ecf__info">
      <span class="vsn-ecf__name vsn-overflow-ellipsis">{{ file.name }}</span>
      <span class="vsn-ecf__size">{{ fileSize }}</span>
    </div>
  </li>
</template>

<script>
import useGetFileSize from '@/hooks/file-size.js'

export default {
  emits: ['remove'],
  props: {
    file: Object,
    isImage: Boolean
  },
  setup(props, { emit }) {
    const fileUrl = props.file?.url ? props.file.url : URL.createObjectURL(props.file)
    const { fileSize } = useGetFileSize(props.file.size)

    function deleteFile(lastModified) {
      emit('remove', lastModified)
    }

    return {
      fileUrl,
      deleteFile,
      fileSize
    }
  }
}
</script>

<style>
.vsn-ecf {
  display: flex;
  position: relative;
  width: 6em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 0.5em;
}
.vsn-ecf__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6em;
  height: 6em;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: var(--gray-30);
}
.vsn-ecf__preview__icon {
  width: 1.25em;
  height: 1.5em;
  border-radius: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: var(--bg-image-document-icon);
}
.vsn-ecf__icon {
  position: absolute;
  top: 0.2em;
  right: 0.2em;
}
.vsn-ecf__info {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.vsn-ecf__name,
.vsn-ecf__size {
  width: 100%;
  font-style: normal;
  font-weight: normal;
  font-size: 0.625em;
  line-height: 1em;
  font-feature-settings: 'pnum' on, 'lnum' on, 'ss01' on;
  color: var(--gray-100);
}
.vsn-ecf__size {
  color: var(--gray-60);
}
.vsn-ecf__delete {
  position: absolute;
  width: 1.25em;
  height: 1.25em;
  top: 2px;
  right: 2px;
  border-radius: 0;
  background-size: 1em;
  background-position: center;
  background-repeat: no-repeat;
  background-image: var(--bg-image-cross-delete-icon);
  background-color: rgba(21, 29, 45, 0.4);
  border-radius: 4px;
}
.vsn-ecf__delete:hover {
  background-color: rgba(21, 29, 45, 0.6);
  cursor: pointer;
}
</style>
