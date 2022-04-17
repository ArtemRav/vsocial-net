<template>
  <transition name="rotate-menu">
    <div class="vsn-like-users" v-if="isOpened">
      <ul class="vsn-like-users__list custom-scrollbar">
        <li class="vsn-like-users__item" v-for="person in viewList" :key="person">{{ person.personFullname }}</li>
      </ul>
    </div>
  </transition>
</template>

<script>
import { computed, ref, watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
  props: {
    id: String,
    type: String,
    owner: String,
    isAllowViewList: Boolean,
    isHover: Boolean,
    views: Array
  },
  setup(props) {
    const store = useStore()
    const objectId = computed(() => props.id)
    const ownerId = computed(() => props.owner)
    const type = computed(() => props.type)
    const viewList = computed(() => props.views)
    const isOpened = ref(false)

    watchEffect(() => {
      const isAllowViewList = computed(() => props.isAllowViewList)
      const isHover = computed(() => props.isHover)

      if (isAllowViewList.value && isHover.value && viewList.value.length == 0) {
        store.dispatch('getViewList', {
          sObjectId: objectId.value,
          sLikeType: type.value,
          sOwnerId: ownerId.value
        })
      }

      if (isHover.value && viewList.value.length > 0) {
        isOpened.value = true
      } else {
        isOpened.value = false
      }
    })

    return {
      viewList,
      isOpened
    }
  }
}
</script>

<style>
.vsn-like-users {
  position: absolute;
  left: 0em;
  top: 3em;
  padding: 0;
  background-color: var(--gray-100);
  color: var(--gray-0);
  font-size: 0.8em;
  border-radius: 8px;
  opacity: 0.8;
  box-shadow: 0 0 1rem rgb(0 0 0 / 40%);
  z-index: 999;
}
.vsn-like-users .vsn-like-users__list {
  max-height: 10.2em;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  list-style: none;
}
.vsn-like-users .vsn-like-users__item {
  padding: 0.5em;
  white-space: nowrap;
}
</style>
