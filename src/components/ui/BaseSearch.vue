<template>
  <div>
    <MqResponsive target="sm-lg">
      <div class="vsn-body-search">
        <div class="vsn-body-search__title vsn-filters__title vsn-fc-gray-70">{{ SEARCH }}</div>

        <div class="vsn-body-search__items">
          <div class="vsn-filter-divider-ver"></div>

          <input
            class="vsn-body-search__enter vsn-fc-gray-70 vsn-clear-input"
            type="text"
            :placeholder="ENTRY_TEXT"
            :value="modelValue"
            @input.prevent="updateValue"
            @keydown.prevent.enter="$emit('submit-form')"
          />
        </div>
      </div>

      <div class="vsn-filter-divider"></div>
    </MqResponsive>

    <MqResponsive target="xs" class="vsn-body-search">
      <div class="vsn-body-search__items">
        <input
          class="vsn-body-search__enter vsn-fc-gray-70"
          type="text"
          :placeholder="ENTRY_TEXT"
          :value="modelValue"
          @input.prevent="updateValue"
          @keydown.prevent.enter="$emit('submit-form')"
        />
        <i class="vsn-bgi-icon-main vsn-base-search-icon"></i>
      </div>
    </MqResponsive>
  </div>
</template>

<script>
import BaseTag from '@/components/ui/BaseTag.vue'
import { MqResponsive } from 'vue3-mq'

import { useStore } from 'vuex'

export default {
  components: {
    BaseTag,
    MqResponsive
  },
  props: {
    modelValue: String
  },
  emits: ['update:modelValue', 'submit-form'],
  setup(_, { emit }) {
    const store = useStore()

    const SEARCH = store.getters.getCONST_FilterSearch
    const ENTRY_TEXT = store.getters.getCONST_EnterText

    function updateValue(e) {
      emit('update:modelValue', e.target.value)
    }

    return {
      SEARCH,
      ENTRY_TEXT,
      updateValue
    }
  }
}
</script>

<style>
.vsn-body-search {
  display: flex;
}
.vsn-body-search .vsn-body-search__items {
  display: flex;
  align-items: flex-start;
  width: 100%;
}
.vsn-body-search .vsn-body-search__enter {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0.25rem 0.5rem 0.25rem 0;
  font-family: var(--font_family);
  font-size: 1em;
  color: var(--gray-100);
  box-shadow: none;
}
.vsn-body-search .vsn-body-search__enter::placeholder {
  color: var(--gray-50);
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-body-search {
    position: relative;
    margin-bottom: 1em;
  }
  .vsn-body-search .vsn-body-search__items {
    width: 100%;
    padding: 0 1em;
  }
  .vsn-body-search .vsn-body-search__enter {
    padding: 0.8rem 1.125em;
    width: 100%;
    border: 1px solid var(--gray-40);
    box-sizing: border-box;
    border-radius: 8px;
    font-size: 0.788em;
  }
  .vsn-body-search .vsn-base-search-icon {
    position: absolute;
    background-image: var(--bg-image-search-icon);
    background-size: 0.9em;
    width: 1em;
    height: 1em;
    top: 50%;
    margin-top: -0.5em;
    right: 2em;
  }
}
</style>
