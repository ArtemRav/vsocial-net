<template>
  <li class="vsn-af">
    <a class="vsn-af__link" target="_blank" :href="file.url" :title="file.name">
      <div v-if="isImage" class="vsn-af__preview" :style="{ 'background-image': 'url(' + file.url + ')' }"></div>
      <div v-else class="vsn-af__preview">
        <div class="vsn-af__preview__icon"></div>
      </div>
      <div class="vsn-af__info">
        <span class="vsn-af__name vsn-overflow-ellipsis">{{ file.name }}</span>
        <span class="vsn-af__size">{{ fileSize }}</span>
      </div>
    </a>
  </li>
</template>

<script>
import { useStore } from 'vuex'

import useGetFileSize from '@/hooks/file-size.js'

export default {
  props: {
    file: Object,
    isImage: Boolean
  },
  setup(props) {
    const store = useStore()

    const { fileSize } = useGetFileSize(props.file.size)

    return {
      fileSize
    }
  }
}
</script>

<style>
.vsn-af {
  display: flex;
  position: relative;
  width: 6em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 0.5em;
}
.vsn-af__link,
.vsn-af__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  text-decoration: none;
}
.vsn-af__preview {
  width: 6em;
  height: 6em;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: var(--gray-30);
}
.vsn-af__link {
  flex-direction: column;
}
.vsn-af__preview__icon {
  width: 1.25em;
  height: 1.5em;
  border-radius: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: var(--bg-image-document-icon);
}
.vsn-af__icon {
  position: absolute;
  top: 0.2em;
  right: 0.2em;
}
.vsn-af__info {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.vsn-af__name,
.vsn-af__size {
  max-width: 6em;
  font-style: normal;
  font-weight: normal;
  font-size: 0.625em;
  line-height: 1.4em;
  font-feature-settings: 'pnum' on, 'lnum' on, 'ss01' on;
  color: var(--gray-100);
}
.vsn-af__size {
  color: var(--gray-60);
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-af__info .vsn-af__name {
    font-size: 0.75em;
  }
}
</style>
