<template>
  <div v-if="type == 'icon' || type == 'tab'" :class="['vsn-base-btn-frame', type, state]">
    <slot></slot>
    <div :class="['vsn-base-btn-frame__text', customClass]">{{ name }}</div>
  </div>
  <button v-else :class="['vsn-base-btn-frame vsn-base-btn-frame__text', type, state]" :disabled="disabled">
    {{ name }}
  </button>
</template>

<script>
export default {
  props: {
    name: String,
    customClass: String,
    state: String,
    type: String,
    disabled: Boolean
  },
  setup() {}
}
</script>

<style>
.vsn-base-btn-frame.button,
.vsn-base-btn-frame.tab,
.vsn-base-btn-frame.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 0.5em 0.5em 0;
  font-size: 0.9em;
  cursor: pointer;
  transition: var(--toggle-btn-trtn);
  font-family: var(--font_family);
}

.vsn-base-btn-frame.button {
  flex-shrink: 0;
  width: 8.75em;
  height: 3em;
  padding: 0.813em 1.25em;
  margin-bottom: 0;
  border: 1px solid var(--blue-base);
  border-radius: 8px;
  color: var(--blue-base);
  font-weight: 400;
  background-color: var(--gray-0);
}
.vsn-base-btn-frame.button.active,
.vsn-base-btn-frame.button:hover {
  background-color: var(--blue-base);
  color: var(--gray-0);
}
.vsn-base-btn-frame.button.active:hover {
  background-color: var(--gray-0);
  color: var(--blue-base);
}
.vsn-base-btn-frame.button:disabled,
.vsn-base-btn-frame.button:disabled:hover {
  background-color: var(--gray-40);
  border: 0;
  color: var(--gray-20);
}

.vsn-base-btn-frame.tab {
  width: 10em;
  height: 2.875em;
  padding: 0.75em 1.25em;
  border-radius: 8px;
  background-color: var(--gray-0);
  color: var(--gray-100);
  font-weight: 600;
}
.vsn-base-btn-frame.tab.active,
.vsn-base-btn-frame.tab:hover {
  background-color: var(--blue-base);
  color: var(--gray-0);
}

.vsn-base-btn-frame.icon {
  margin: 0 0.5em 0 0;
}
.vsn-base-btn-frame.icon.active {
  background-color: var(--blue-base);
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-base-btn-frame.button {
    width: 50%;
    flex-shrink: 1;
  }
}
</style>
