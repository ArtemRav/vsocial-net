<template>
  <ul class="vsn-entry-item-tags vsn-p-1-5" v-if="entryObject">
    <li class="tag vsn-fc-blue-base" v-for="(tag, index) in entryObject.tags" :key="tag">
      {{ '#' + tag.name }}
      <span class="vsn-m-05" v-if="index < entryObject.tags.length - 1">{{ divider }}</span>
    </li>
  </ul>
</template>

<script>
import { ref } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'

import useGetEntryItem from '@/hooks/get-entry-item.js'

export default {
  setup() {
    const divider = ref('/')

    const { entryItem: entryObject } = useGetEntryItem(inject)

    return {
      divider,
      entryObject
    }
  }
}
</script>

<style>
.vsn-entry-item-tags {
  display: flex;
  flex-wrap: wrap;
}
.vsn-entry-item-tags .tag {
  list-style-type: none;
  font-size: 0.75em;
}
</style>
