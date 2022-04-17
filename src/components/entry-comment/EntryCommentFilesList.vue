<template>
  <div class="vsn-evfs">
    <div class="vsn-evfs__header">
      <label class="vsn-evfs__label" v-if="bAllowAttachment && filesAttached.length < iMaxAttachmentsQty">
        <input class="vsn-evfs__input" type="file" name="file" multiple @change="attachFiles($event)" />
        <BaseIcon class="vsn-evfs__icon" :iconName="'attach-blue'"></BaseIcon>
        <div class="vsn-evfs__title">{{ ATTACH_FILE }}</div>
      </label>
    </div>

    <div class="vsn-evfs__list">
      <transition-group tag="ul" name="bounce">
        <EntryCommentFile
          v-for="file in filesAttached"
          :key="file.lastModified"
          :file="file"
          :is-image="!!~file.type.indexOf('image') || !!~file.type.indexOf('img')"
          @remove="delFiles"
        ></EntryCommentFile>
      </transition-group>
    </div>
  </div>
</template>

<script>
import EntryCommentFile from './EntryCommentFile.vue'

import { computed, inject, ref } from '@vue/runtime-core'

import useAttach from '@/hooks/attach.js'
import useGetEntryItem from '@/hooks/get-entry-item.js'

export default {
  emits: ['change-files-list'],
  props: {
    entryFiles: Array,
    commentLevel: Number
  },
  components: {
    EntryCommentFile
  },
  setup(props, { emit }) {
    const { store, entryItem: entryObject } = useGetEntryItem(inject)

    const ATTACH_FILE = store.getters.getCONST_AttachFiles
    const EXCEEDED_FILES = store.getters.getCONST_ExceededFiles

    const { filesAttached, addFiles, delFiles } = useAttach(emit)

    const gConfig = store.getters.getGConfig

    const entryFiles = computed(() => props.entryFiles)
    if (entryFiles.value.length > 0) {
      entryFiles.value.forEach(f => {
        filesAttached.value.push({
          is_already_exist: true,
          lastModified: f.id,
          type: f.type,
          name: f.name,
          size: f.size,
          url: f.url
        })
      })
    }

    const iMaxAttachmentsQty = gConfig.iMaxAttachmentsQty
    const bAllowAttachment = ref(false)
    if (entryObject.type != 'comment') {
      bAllowAttachment.value = gConfig.bAllowAttachments && gConfig.bAllowCommentAttachments
    } else {
      bAllowAttachment.value =
        gConfig.bAllowAttachments &&
        gConfig.bAllowCommentAttachments &&
        ((gConfig.bAllowCommentAttachmentsFirstLevelOnly && props.commentLevel == 0) || !gConfig.bAllowCommentAttachmentsFirstLevelOnly)
    }

    function attachFiles(e) {
      if (e.currentTarget?.files && iMaxAttachmentsQty > 0 && e.currentTarget.files.length > iMaxAttachmentsQty) {
        return store.dispatch('setErrorRequestAPI', EXCEEDED_FILES)
      }
      addFiles(e)
    }

    return {
      iMaxAttachmentsQty,
      bAllowAttachment,
      ATTACH_FILE,
      filesAttached,
      attachFiles,
      delFiles
    }
  }
}
</script>

<style>
.vsn-evfs {
  margin: 1.063rem 0;
}
.vsn-evfs .vsn-evfs__label {
  display: flex;
  max-width: 10em;
  align-items: center;
  justify-content: flex-start;
  margin-right: 0.5em;
  cursor: pointer;
}
.vsn-evfs .vsn-evfs__label .vsn-evfs__icon {
  width: 1.1em;
  height: 1.1em;
  margin-right: 0.5em;
  background-size: 1em;
}
.vsn-evfs .vsn-evfs__input {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
.vsn-evfs .vsn-evfs__input:hover:not(:disabled) {
  cursor: pointer;
}
.vsn-evfs .vsn-evfs__title {
  font-size: 0.75em;
  color: var(--blue-base);
}
.vsn-evfs__list ul {
  display: flex;
  align-items: center;
  padding: 1rem 0 0;
  flex-wrap: wrap;
}
</style>
