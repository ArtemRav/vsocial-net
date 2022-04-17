<template>
  <MqResponsive target="sm-lg">
    <div class="vsn-datepicker">
      <div class="vsn-datepicker__label">{{ label }}</div>
      <flat-pickr
        class="vsn-datepicker__control vsn-clear-input"
        v-model="modelValue"
        :config="config"
        :value="modelValue"
        @input="updateValue($event, false)"
      ></flat-pickr>

      <div :class="['vsn-datepicker__icon', icon]" @click="updateValue(_, true)"></div>
    </div>
  </MqResponsive>

  <MqResponsive target="xs" class="vsn-datepicker">
    <flat-pickr
      class="vsn-datepicker__control"
      v-model="modelValue"
      :config="config"
      :value="modelValue"
      :placeholder="label"
      @input.self.prevent="updateValue($event, false)"
    ></flat-pickr>

    <div :class="['vsn-datepicker__icon', icon]" @click.self.prevent="updateValue(_, true)"></div>
  </MqResponsive>
</template>

<script>
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import { ref } from '@vue/reactivity'

import { MqResponsive } from 'vue3-mq'

export default {
  components: {
    MqResponsive
  },
  props: {
    label: String,
    modelValue: String
  },
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const config = { locale: Russian, dateFormat: 'd.m.Y', disableMobile: 'true' }

    const icon = ref('calendar')

    const updateValue = (e, reset) => {
      if (reset) {
        emit('update:modelValue', null)
        icon.value = 'calendar'
      } else {
        emit('update:modelValue', e.target.value)
        icon.value = 'close'
      }
    }

    return {
      icon,
      config,
      updateValue
    }
  }
}
</script>

<style>
.vsn-datepicker {
  position: relative;
  display: flex;
  height: 100%;
}
.vsn-datepicker .vsn-datepicker__label {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 0.9em;
  color: var(--gray-50);
  font-size: 1em;
}
.vsn-datepicker .vsn-datepicker__control {
  padding: 0 0 0 0.9em;
  width: 10em;
  border: none;
  outline: none;
  box-sizing: border-box;
  font-family: var(--font_family);
  font-size: 1em;
  box-shadow: none;
}
.vsn-datepicker__icon {
  position: absolute;
  top: 0.5em;
  right: 1em;
  width: 1em;
  height: 1em;
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  -ms-border-radius: 0;
  -o-border-radius: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1em;
  cursor: pointer;
}
.vsn-datepicker__icon.calendar {
  background-image: var(--bg-image-calendar-icon-black);
}
.vsn-datepicker:hover .vsn-datepicker__icon.calendar {
  background-image: var(--bg-image-calendar-icon-blue);
}
.vsn-datepicker__icon.close {
  background-image: var(--bg-image-close-icon-gray);
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-datepicker {
    position: relative;
    display: flex;
    flex-grow: 1;
    border-radius: 8px;
  }
  .vsn-datepicker .vsn-datepicker__label {
    padding: 0;
  }
  .vsn-datepicker .vsn-datepicker__control {
    height: 3em;
    width: 100%;
    padding: 1.2rem 0.813em;
    border-radius: 8px;
    border: 1px solid var(--gray-50);
  }
  .vsn-datepicker:first-child .vsn-datepicker__control {
    margin-right: 0.4em;
  }
  .vsn-datepicker .vsn-datepicker__icon {
    top: 1em;
  }
}
</style>
