<template>
  <div :class="['vsn-tag', customClass, state]">
    <div class="vsn-tag__text vsn-overflow-ellipsis" v-if="isNotFile">{{ name }}</div>
    <slot v-else name="text"></slot>

    <div class="vsn-tag__icon" v-if="iconClassName">
      <BaseIcon :iconName="iconClassName"></BaseIcon>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'

export default {
  props: {
    name: String,
    icon: String,
    customClass: String,
    state: String
  },
  setup(props) {
    const iconClassName = computed(() => props.icon)

    const isNotFile = computed(() => !!props?.name)

    return {
      isNotFile,
      iconClassName
    }
  }
}
</script>

<style>
.vsn-tag {
  display: flex;
  padding: 0.25em 0.625em;
  justify-content: center;
  align-items: center;
}
.vsn-tag.item {
  justify-content: flex-start;
  align-items: center;
  padding: 0.25rem 0.625em;
  margin: 0 0.5rem 0.5rem 0;
  border-radius: 4px;
  background-color: var(--gray-10);
  transition: var(--toggle-btn-trtn);
}
.vsn-tag.item:hover {
  background-color: var(--gray-80);
  color: var(--gray-0);
}
.vsn-tag.item.is-active {
  background-color: var(--blue-base);
  color: var(--gray-0);
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-tag.item {
    width: fit-content;
    max-width: 100%;
  }
}
</style>
