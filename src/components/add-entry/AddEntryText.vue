<template>
  <div class="vsn-add-entry-textarea__wrapper">
    <textarea
      class="vsn-add-entry-text"
      name="textarea"
      rows="6"
      :placeholder="ENTER_TEXT"
      :value="modelValue"
      @input="updateValue"
    ></textarea>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: String
  },
  setup(_, { emit }) {
    const store = useStore()

    const ENTER_TEXT = store.getters.getCONST_EnterText

    function updateValue(e) {
      emit('update:modelValue', e.target.value)
    }

    return {
      ENTER_TEXT,
      updateValue
    }
  }
}
</script>

<style>
.vsn-add-entry-textarea__wrapper {
  display: flex;
}
.vsn-add-entry-text {
  display: flex;
  width: 100%;
  margin-bottom: 2em;
  min-height: 9.875em;
  resize: vertical;
  padding: 0.813rem 1.25em;
  border: 1px solid var(--gray-50);
  border-radius: 8px;
  font-family: var(--font_family);
  font-size: 0.9em;
  color: var(--gray-100);
}
textarea::placeholder {
  color: var(--gray-50);
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-add-entry-textarea__wrapper {
    padding: 0 1em;
  }
  .vsn-add-entry-text {
    margin-bottom: 1em;
    min-height: 8em;
  }
}
</style>
