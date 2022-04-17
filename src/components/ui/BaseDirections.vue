<template>
  <div>
    <MqResponsive target="sm-lg" class="vsn-directions__wrapper">
      <div class="vsn-body-direction">
        <div class="vsn-body-direction__title vsn-filters__title vsn-fc-gray-70">{{ DIRECTION }}</div>

        <div class="vsn-body-direction__items">
          <BaseTag
            v-for="d in directions"
            :key="d.id"
            :custom-class="'item'"
            :name="d?.name"
            :class="{ 'is-active': isActive(d.id) }"
            @click="toggleDirection(d.id)"
          >
            <div :class="['vsn-bgi-icon-main', 'vsn-bgi-icon-plus']"></div>
          </BaseTag>
        </div>
      </div>

      <div class="vsn-filter-divider"></div>
    </MqResponsive>

    <MqResponsive target="xs" class="vsn-directions__wrapper">
      <div class="vsn-body-direction">
        <div class="vsn-body-direction__title vsn-fc-gray-70">{{ DIRECTION }}</div>

        <div class="vsn-body-direction__items">
          <BaseTag
            v-for="d in directions"
            :key="d.id"
            :custom-class="'item'"
            :name="d?.name"
            :class="{ 'is-active': isActive(d.id) }"
            @click="toggleDirection(d.id)"
          >
            <div :class="['vsn-bgi-icon-main', 'vsn-bgi-icon-plus']"></div>
          </BaseTag>
        </div>
      </div>

      <div class="vsn-filter-divider"></div>
    </MqResponsive>
  </div>
</template>

<script>
import BaseTag from '@/components/ui/BaseTag.vue'
import { MqResponsive } from 'vue3-mq'

import { useStore } from 'vuex'
import { computed, ref } from '@vue/runtime-core'

export default {
  components: {
    BaseTag,
    MqResponsive
  },
  inject: ['mq'],
  props: {
    directions: Array
  },
  emits: ['change-directions'],
  setup(_, { emit }) {
    const store = useStore()

    const directionIds = ref([])
    const DIRECTION = store.getters.getCONST_FilterTarget
    const isActive = computed(() => id => ~directionIds.value.indexOf(id))

    function toggleDirection(id) {
      const index = directionIds.value.indexOf(id)
      if (~index) {
        directionIds.value.splice(index, 1)
      } else {
        directionIds.value.push(id)
      }
      emit('change-directions', {
        directions: directionIds.value,
        fn: () => {
          directionIds.value = []
        }
      })
    }

    return {
      isActive,
      DIRECTION,
      toggleDirection
    }
  }
}
</script>

<style>
.vsn-directions__wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
}
.vsn-body-direction {
  display: flex;
}
.vsn-body-direction .vsn-body-direction__items {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  cursor: pointer;
}
.vsn-body-direction .vsn-bgi-icon-plus {
  width: 1em;
  height: 1em;
  background-size: 1em;
  margin-left: 0.5em;
  background-image: var(--bg-image-plus-icon-gray);
}
.vsn-body-direction .vsn-body-direction__items .item:hover .vsn-bgi-icon-plus {
  background-image: var(--bg-image-plus-icon-white);
}
.vsn-body-direction .vsn-body-direction__items .item.is-active .vsn-bgi-icon-plus {
  background-image: var(--bg-image-close-icon-white);
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-body-direction {
    flex-direction: column;
    max-width: 100%;
    padding: 0 1em;
  }
  .vsn-body-direction .vsn-body-direction__items {
    margin-top: 0.5em;
  }
}
</style>
