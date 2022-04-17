<template>
  <BaseCard :mode="'info'" class="vsn-entry-item-info">
    <template v-slot:default>
      <EntryItemInfoHeader
        @open-share="$emit('open-share')"
        @edit-entry="$emit('edit-entry')"
        @block-entry="$emit('block-entry')"
      ></EntryItemInfoHeader>
      <EntryItemInfoBody></EntryItemInfoBody>
      <TheAttachedFilesList v-if="filesFiltered.length > 0" :files="filesFiltered"></TheAttachedFilesList>
      <EntryItemVideo v-if="!!video" :video-file="video"></EntryItemVideo>
      <EntryItemTags v-if="hasTags"></EntryItemTags>
    </template>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/ui/BaseCard.vue'
import EntryItemInfoHeader from './EntryItemInfoHeader.vue'
import EntryItemInfoBody from './EntryItemInfoBody.vue'
import TheAttachedFilesList from '@/components/layouts/TheAttachedFilesList.vue'
import EntryItemVideo from './EntryItemVideo.vue'
import EntryItemTags from './EntryItemTags.vue'

import { ref } from '@vue/reactivity'
import { computed, inject } from '@vue/runtime-core'

import useGetEntryItem from '@/hooks/get-entry-item.js'

export default {
  components: {
    BaseCard,
    EntryItemInfoHeader,
    EntryItemInfoBody,
    TheAttachedFilesList,
    EntryItemVideo,
    EntryItemTags
  },
  emits: ['open-share', 'edit-entry', 'block-entry'],
  setup() {
    const { entryItem: entryObject } = useGetEntryItem(inject)

    const video = ref(null)

    const filesFiltered = computed(() => {
      if (entryObject.attachments.length > 0) {
        video.value = entryObject.attachments.filter(a => a.type == 'video' && a?.url)[0]
      }

      if (!!video.value) {
        return entryObject.attachments.filter(f => f.id != video.value.id)
      }

      return entryObject.attachments
    })

    const isComment = ref(false)
    const hasTags = computed(() => (entryObject?.tags ? entryObject.tags.length > 0 : false))

    function showEntryComment() {
      isComment.value = !isComment.value
    }

    return {
      video,
      hasTags,
      isComment,
      filesFiltered,
      showEntryComment
    }
  }
}
</script>

<style>
.vsn-entry-item-info {
  align-items: flex-start;
}
.vsn-entry-soc-controls {
  padding: 1.75rem 1.5em;
}
</style>
