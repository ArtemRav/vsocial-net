<template>
  <transition name="scale">
    <ThePostImage v-if="postImageUrl" :img-url="postImageUrl" :img-name="postImageName"></ThePostImage>
  </transition>

  <div class="vsn-afsl">
    <div class="vsn-afsl__title">{{ ATTACHED_FILES }}</div>

    <transition-group tag="ul" name="bounce">
      <TheAttachedFile v-for="file in files" :key="file.id" :file="file" :is-image="!!~file.type.indexOf('img')"></TheAttachedFile>
    </transition-group>
  </div>
</template>

<script>
import TheAttachedFile from './TheAttachedFile.vue'
import ThePostImage from './ThePostImage.vue'

import { useStore } from 'vuex'
import { computed, ref, watchEffect } from '@vue/runtime-core'

export default {
  props: {
    files: Object
  },
  components: {
    TheAttachedFile,
    ThePostImage
  },
  setup(props) {
    const store = useStore()

    const ATTACHED_FILES = store.getters.getCONST_FilesAttached

    const postImageUrl = ref('')
    const postImageName = ref('')
    watchEffect(() => {
      const filesAttached = computed(() => props.files)
      const fileImg = filesAttached.value.filter(f => f.type == 'img')[0]

      if (filesAttached.value.length > 0 && fileImg) {
        postImageUrl.value = fileImg.url
        postImageName.value = fileImg.name
      }
    })

    return {
      ATTACHED_FILES,
      postImageUrl,
      postImageName
    }
  }
}
</script>

<style>
.vsn-afsl {
  display: flex;
  max-width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 1em;
  margin: 0 1.5rem 1.5em;
  border: 1px solid var(--gray-30);
  border-radius: 8px;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.vsn-afsl ul {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-wrap: wrap;
}
.vsn-afsl .vsn-afsl__title {
  display: flex;
  justify-content: flex-start;
  margin: 0 0.5rem 0.5rem 0;
  font-size: 0.75em;
}
</style>
