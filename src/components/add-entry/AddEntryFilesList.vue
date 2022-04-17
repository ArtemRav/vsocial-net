<template>
  <MqResponsive target="sm-lg" class="vsn-entry-files">
    <div class="vsn-entry-files__title vsn-filters__title vsn-fc-gray-70">{{ FILES }}</div>

    <div class="vsn-entry-files__right">
      <div class="vsn-filter-divider-ver"></div>

      <label class="vsn-attach-file">
        <input class="vsn-attach-file__input" type="file" name="file" multiple @change="addFiles($event)" />
        <BaseIcon class="vsn-entry-files__icon" :iconName="'attach-black'"></BaseIcon>
      </label>

      <transition-group tag="ul" name="bounce" class="vsn-add-entry__list">
        <AddEntryFile v-for="file in filesAttached" :key="file" :file="file" @remove="delFiles"></AddEntryFile>
      </transition-group>
    </div>
  </MqResponsive>

  <MqResponsive target="xs" class="vsn-entry-files">
    <div class="vsn-entry-files__title vsn-filters__title vsn-fc-gray-70">{{ FILES }}</div>

    <div class="vsn-entry-files__right">
      <label class="vsn-attach-file">
        <span class="vsn-attach-file__label vsn-fs-placeholder">{{ CHOOSE_FILE }}</span>
        <input class="vsn-attach-file__input" type="file" name="file" multiple @change="addFiles($event)" />
        <BaseIcon class="vsn-entry-files__icon" :iconName="'attach-black'"></BaseIcon>
      </label>

      <transition-group tag="ul" name="bounce" class="vsn-add-entry__list">
        <AddEntryFile v-for="file in filesAttached" :key="file" :file="file" @remove="delFiles"></AddEntryFile>
      </transition-group>
    </div>
  </MqResponsive>
</template>

<script>
import AddEntryFile from './AddEntryFile.vue'
import { MqResponsive } from 'vue3-mq'

import { useStore } from 'vuex'
import useAttach from '@/hooks/attach.js'
import { computed, watchEffect } from '@vue/runtime-core'

export default {
  emits: ['change-files-list'],
  components: {
    AddEntryFile,
    MqResponsive
  },
  props: {
    filesAdded: Array
  },
  setup(props, { emit }) {
    const store = useStore()

    const FILES = store.getters.getCONST_Files
    const CHOOSE_FILE = store.getters.getCONST_ChooseFile

    const { filesAttached, addFiles, delFiles } = useAttach(emit)

    watchEffect(() => {
      const filesAdded = computed(() => props.filesAdded)
      filesAttached.value = filesAdded.value
    })

    return {
      FILES,
      CHOOSE_FILE,
      addFiles,
      delFiles,
      filesAttached
    }
  }
}
</script>

<style>
.vsn-entry-files .vsn-add-entry__list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.vsn-entry-files .vsn-add-entry__list .vsn-tag {
  max-width: 18em;
}
.vsn-entry-files .vsn-add-entry__list .vsn-tag .vsn-tag__text {
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.vsn-entry-files .vsn-entry-files__title,
.vsn-entry-files .vsn-entry-files__right {
  align-items: center;
}
.vsn-entry-files__right {
  display: flex;
  min-height: 2em;
}
.vsn-attach-file {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5em;
}
.vsn-attach-file .vsn-entry-files__icon {
  background-size: 1em;
}
.vsn-attach-file__input {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
.vsn-attach-file__input:hover:not(:disabled) {
  cursor: pointer;
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-entry-files {
    flex-direction: column;
    padding: 0 1em;
  }

  .vsn-entry-files__right,
  .vsn-entry-files .vsn-add-entry__list {
    margin-top: 0.5em;
    flex-direction: column;
    max-width: 100%;
  }

  .vsn-entry-files .vsn-add-entry__list .vsn-entry-files-item {
    max-width: 100%;
  }

  .vsn-attach-file {
    width: 100%;
    height: 2.75em;
    padding: 0 1em;
    margin: 0;
    border: 1px solid var(--gray-50);
    border-radius: 8px;
    justify-content: space-between;
  }

  .vsn-attach-file__label {
    color: var(--gray-50);
  }
}
</style>
