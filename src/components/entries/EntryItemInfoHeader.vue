<template>
  <div class="vsn-eiih vsn-p-1-5">
    <div>
      <BaseIconPerson :person-icon="personImg"></BaseIconPerson>

      <div class="vsn-wrapper-header-text vsn-ml-05">
        <div class="vsn-fz-09 vsn-fw-600 vsn-fc-gray-100">
          <a :href="personLink" class="vsn-text__fullname">{{ personName }}</a>
          <span class="vsn-text__info vsn-fw-normal" v-if="entryObject?.object">{{ ' > ' + entryObject.object.name }}</span>
        </div>
        <div class="vsn-entry-light-gray-fnt">{{ entryDate }}</div>
      </div>
    </div>

    <BaseIcon
      class="vsn-eiih__menu-icon"
      v-if="menuItems.length > 0"
      :icon-name="'blue-ellipsis'"
      @click="showMenu"
      v-click-outside="hideMenu"
    >
      <transition name="grow-down">
        <TheMenuEntry
          class="vsn-eiih__menu"
          v-if="menuVisible"
          :options="menuItems"
          :entry-id="entryObject.id"
          :owner-id="entryObject?.ownerId"
          @open-share="$emit('open-share')"
          @edit-entry="$emit('edit-entry')"
          @block-entry="$emit('block-entry')"
        ></TheMenuEntry>
      </transition>
    </BaseIcon>
  </div>
</template>

<script>
import BaseIconPerson from '@/components/ui/BaseIconPerson.vue'

import moment from 'moment'
import { computed, inject, ref } from '@vue/runtime-core'

import useFormateDate from '@/hooks/format-date.js'
import useEntryMenu from '@/hooks/entry-menu.js'
import useGetEntryItem from '@/hooks/get-entry-item.js'

export default {
  components: {
    BaseIconPerson
  },
  emits: ['open-share', 'edit-entry', 'block-entry'],
  setup() {
    const { entryItem: entryObject } = useGetEntryItem(inject)

    const { menuItems } = useEntryMenu(entryObject)

    const menuVisible = ref(false)
    const personName = computed(() => {
      return entryObject.person?.name
        ? entryObject.person.name
            .trim()
            .split(' ')
            .slice(0, -1)
            .join(' ')
        : ''
    })
    const personLink = computed(() => entryObject.person.link)
    const personImg = computed(() => entryObject.person.img)
    const entryDate = computed(() => {
      return useFormateDate(entryObject.date, moment)
    })

    function showMenu() {
      menuVisible.value = !menuVisible.value
    }

    function hideMenu() {
      menuVisible.value = false
    }

    return {
      menuItems,
      entryObject,
      menuVisible,
      personLink,
      personName,
      personImg,
      entryDate,
      showMenu,
      hideMenu
    }
  }
}
</script>

<style>
.vsn-eiih {
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid var(--gray-30);
}
.vsn-eiih > div {
  display: flex;
}
.vsn-eiih .vsn-eiih__menu-icon {
  position: relative;
}
.vsn-eiih .vsn-eiih__menu {
  right: 0;
  top: 2em;
}
.vsn-eiih .vsn-wrapper-header-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.vsn-eiih .vsn-text__fullname {
  color: var(--gray-100);
  text-decoration: none;
}
</style>
