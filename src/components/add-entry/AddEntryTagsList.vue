<template>
  <MqResponsive target="sm-lg" class="vsn-entry-tags">
    <div class="vsn-entry-tags__title vsn-filters__title vsn-fc-gray-70">{{ TAGS }}</div>

    <div class="vsn-entry-tags__right">
      <div class="vsn-filter-divider-ver"></div>
      <div class="vsn-entry-tags__wrapper">
        <transition-group tag="ul" name="bounce" class="vsn-add-entry__list">
          <AddEntryTag v-for="tag in tagsAdded" :key="tag.id" :tag="tag" @delete="delTag"></AddEntryTag>
        </transition-group>

        <input
          class="vsn-entry-tags__enter vsn-fc-gray-70 vsn-clear-input"
          type="text"
          :placeholder="'# ' + ENTRY_TEXT"
          @keydown.prevent.enter="addTag(false)"
          v-model="tagNameText"
        />

        <span class="vsn-underline__error">{{ errorAddTag }}</span>

        <ul class="vsn-tags-menu custom-scrollbar">
          <li class="vsn-tags-menu__item" v-for="tag in tagsFiltered" :key="tag.id" @click="addTag(tag.name)">{{ tag.name }}</li>
        </ul>
      </div>
    </div>
  </MqResponsive>

  <MqResponsive target="xs" class="vsn-entry-tags">
    <div class="vsn-entry-tags__title vsn-filters__title vsn-fc-gray-70">{{ TAGS }}</div>

    <div class="vsn-entry-tags__right">
      <div class="vsn-entry-tags__wrapper">
        <transition-group tag="ul" name="bounce" class="vsn-add-entry__list">
          <AddEntryTag v-for="tag in tagsAdded" :key="tag.id" :tag="tag" @delete="delTag"></AddEntryTag>
        </transition-group>

        <input
          class="vsn-entry-tags__enter vsn-fs-placeholder"
          type="text"
          :placeholder="'# ' + ENTRY_TEXT"
          @keydown.prevent.enter="addTag(false)"
          v-model="tagNameText"
        />

        <span class="vsn-underline__error">{{ errorAddTag }}</span>

        <ul class="vsn-tags-menu custom-scrollbar">
          <li class="vsn-tags-menu__item" v-for="tag in tagsFiltered" :key="tag.id" @click="addTag(tag.name)">{{ tag.name }}</li>
        </ul>
      </div>
    </div>
  </MqResponsive>
</template>

<script>
import AddEntryTag from './AddEntryTag.vue'
import { MqResponsive } from 'vue3-mq'

import { useStore } from 'vuex'
import { ref } from '@vue/reactivity'
import { computed, watch } from '@vue/runtime-core'

export default {
  emits: ['change-tags-list'],
  components: {
    AddEntryTag,
    MqResponsive
  },
  props: {
    isAllowCreateTags: Boolean
  },
  setup(props, { emit }) {
    const store = useStore()

    const TAGS = store.getters.getCONST_Tags
    const ENTRY_TEXT = store.getters.getCONST_EnterText

    const errorAddTag = ref('')
    const tagsAdded = ref([])
    const tagNameText = ref('')
    const tagsFiltered = ref([])
    const tagsInit = computed(() => store.getters.getTagsList)

    watch(tagNameText, cur => {
      if (cur.length > 1) {
        tagsFiltered.value = tagsInit.value.filter(t => ~t.name.toLowerCase().indexOf(cur.toLowerCase()))
      } else {
        tagsFiltered.value = []
      }
    })

    watch(errorAddTag, cur => {
      if (cur) {
        setTimeout(() => {
          errorAddTag.value = ''
        }, 3000)
      }
    })

    function emitChangeTagsList() {
      emit('change-tags-list', {
        tags: tagsAdded.value,
        fn: () => {
          tagsAdded.value = []
        }
      })
    }

    function tagExists(tagName) {
      if (tagsAdded.value.length > 0) {
        return ~tagsAdded.value.map(t => t.name).indexOf(tagName)
      }
      return false
    }

    function addTag(name) {
      const tagNew = {
        id: new Date().getTime(),
        name: ''
      }

      if (name) {
        tagNew.name = name
        errorAddTag.value = ''
      } else if (props.isAllowCreateTags) {
        tagNew.name = tagNameText.value
      } else {
        errorAddTag.value = store.getters.getCONST_ErrorAddTag
      }
      tagNameText.value = ''

      if (errorAddTag.value != '') {
        return
      }

      if (!tagExists(tagNew.name)) {
        tagsAdded.value.push(tagNew)
      }

      emitChangeTagsList()
    }

    function delTag(id) {
      tagsAdded.value = tagsAdded.value.filter(t => t.id !== id)
      emitChangeTagsList()
    }

    return {
      TAGS,
      ENTRY_TEXT,
      tagsAdded,
      errorAddTag,
      tagNameText,
      tagsFiltered,
      addTag,
      delTag
    }
  }
}
</script>

<style>
.vsn-entry-tags__right {
  display: flex;
  min-height: 2em;
  max-width: 80%;
}
.vsn-entry-tags__right .vsn-entry-tags__wrapper {
  position: relative;
  max-width: 100%;
}
.vsn-entry-tags .vsn-tags-menu {
  position: absolute;
  left: 0;
  top: auto;
  display: flex;
  width: 100%;
  max-height: 9em;
  overflow-y: auto;
  flex-direction: column;
  background-color: var(--gray-0);
  box-shadow: 0px 8px 24px 0px #0000001a;
}
.vsn-entry-tags .vsn-tags-menu .vsn-tags-menu__item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 1em;
  list-style-type: none;
  font-size: 1em;
}
.vsn-entry-tags .vsn-tags-menu .vsn-tags-menu__item:hover {
  cursor: pointer;
  background-color: var(--blue-base);
  color: var(--gray-0);
}
.vsn-entry-tags .vsn-entry-tags__title,
.vsn-entry-tags .vsn-entry-tags__right {
  align-items: center;
}
.vsn-entry-tags .vsn-entry-tags__enter {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0.25rem 0.5rem 0.25rem 0;
  box-shadow: none;
}
.vsn-entry-tags__enter::placeholder {
  color: var(--gray-50);
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-entry-tags__right,
  .vsn-entry-tags__right .vsn-entry-tags__wrapper {
    max-width: 100%;
    width: 100%;
  }
  .vsn-entry-tags__right {
    margin-top: 0.5em;
  }
  .vsn-entry-tags {
    flex-direction: column;
    padding: 0 1em;
  }
  .vsn-entry-tags .vsn-entry-tags__enter {
    padding: 0.9rem 1em;
    border: 1px solid var(--gray-50);
    border-radius: 8px;
  }
}
</style>
