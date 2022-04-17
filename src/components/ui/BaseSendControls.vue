<template>
  <MqResponsive target="xs" class="vsn-directions__wrapper">
    <transition name="drop-down">
      <div class="vsn-entry-comment-controls__info" v-if="isEmptyForm">{{ warning }}</div>
    </transition>
  </MqResponsive>

  <div class="vsn-entry-comment-controls">
    <transition name="drop-down">
      <div class="vsn-entry-comment-controls__info" v-if="isEmptyForm && !isMobile">{{ warning }}</div>
    </transition>

    <BaseButtonFrame :name="CANCEL" :type="'button'" @click.prevent="emitCancel"></BaseButtonFrame>
    <BaseButtonFrame :name="PUBLIC" :state="'active'" :type="'button'" :disabled="isEmptyForm" @click.prevent="emitPost"></BaseButtonFrame>
  </div>
</template>

<script>
import BaseButtonFrame from '@/components/ui/BaseButtonFrame.vue'
import { MqResponsive } from 'vue3-mq'

import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import { useMq } from 'vue3-mq'

export default {
  emits: ['cancel-form', 'send-form'],
  components: {
    BaseButtonFrame,
    MqResponsive
  },
  props: {
    warning: String,
    isDisabled: Boolean
  },
  setup(props, { emit }) {
    const store = useStore()

    const CANCEL = store.getters.getCONST_CancelPostMessage
    const PUBLIC = store.getters.getCONST_PublicEntry
    const isEmptyForm = computed(() => props.isDisabled)

    const mq = useMq()
    const isMobile = computed(() => mq.current === 'xs')

    function emitCancel() {
      emit('cancel-form')
    }

    function emitPost() {
      emit('send-form')
    }

    return {
      CANCEL,
      PUBLIC,
      isEmptyForm,
      emitCancel,
      emitPost,
      isMobile
    }
  }
}
</script>

<style>
.vsn-entry-comment-controls {
  display: flex;
  width: 100%;
  margin-top: 1em;
  justify-content: flex-end;
}
.vsn-entry-comment-controls .vsn-base-btn-frame:last-child {
  margin: 0;
}
.vsn-entry-comment-controls .vsn-entry-comment-controls__info,
.vsn-directions__wrapper .vsn-entry-comment-controls__info {
  display: flex;
  height: 3em;
  width: 100%;
  align-items: center;
  font-family: var(--font_family);
  font-size: 0.75em;
  color: var(--gray-60);
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-entry-comment-controls,
  .vsn-directions__wrapper .vsn-entry-comment-controls__info {
    padding: 0 1em;
  }
}
</style>
