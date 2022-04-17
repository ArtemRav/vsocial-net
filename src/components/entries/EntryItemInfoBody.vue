<template>
  <div class="vsn-entry-item-body vsn-p-1-5 vsn-entry-base-fnt" v-html="entryObject.text"></div>
</template>

<script>
import { inject } from '@vue/runtime-core'

import useGetEntryItem from '@/hooks/get-entry-item.js'

export default {
  setup() {
    const { entryItem: entryObject } = useGetEntryItem(inject)

    return {
      entryObject
    }
  }
}
</script>

<style>
.vsn-entry-item-body {
  display: block;
  width: 100%;
}
.vsn-entry-item-body > a {
  text-decoration: none;
  color: var(--blue-base);
}
.vsn-entry-item-body img {
  max-width: 100%;
}
</style>
