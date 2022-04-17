<template>
  <transition name="drop-down">
    <div class="vsn-error-alert__wrapper" :class="className" v-if="isAlert">
      <div class="vsn-error-alert__text">{{ error }}</div>
    </div>
  </transition>
</template>

<script>
import { computed, ref, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
  props: ['text', 'type'],
  setup(props) {
    const store = useStore()

    const error = computed(() => props.text)
    const className = computed(() => (props?.type ? props.type : 'error'))
    const isAlert = ref(false)

    watch(error, cur => {
      if (cur) {
        isAlert.value = true
        timerOn()
      }
    })

    function timerOn() {
      setTimeout(() => {
        isAlert.value = false
        store.dispatch('setErrorRequestAPI', '')
      }, 3000)
    }

    return {
      error,
      className,
      isAlert
    }
  }
}
</script>

<style>
.vsn-error-alert__wrapper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 3vh;
  left: 0;
  width: 100%;
  z-index: 100;
  border: none;
}
.vsn-error-alert__wrapper.error .vsn-error-alert__text {
  display: flex;
  max-width: 50%;
  border-radius: 12px;
  padding: 1em;
  word-wrap: break-word;
  text-align: center;
  background-color: var(--red);
  color: var(--gray-0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}
</style>
