<template>
  <div class="vsn-cos-btn__wrapper">
    <div class="vsn-fc-blue-base vsn-entry-light-gray-fnt vsn-overflow-ellipsis">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: String
  },
  setup() {}
}
</script>

<style>
.vsn-cos-btn__wrapper {
  display: flex;
  height: 100%;
  align-items: center;
  margin-right: 0.5em;
  cursor: pointer;
}
.vsn-cos-btn__wrapper.disabled > div {
  cursor: unset;
  opacity: 0.4;
}
</style>
