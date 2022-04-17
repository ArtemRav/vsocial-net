<template>
  <div class="vsn-bgi-person" :style="{ 'background-image': 'url(' + personIcon + ')' }"></div>
</template>

<script>
export default {
  props: {
    personIcon: String
  },
  setup() {}
}
</script>

<style>
.vsn-bgi-person {
  width: 3em;
  height: 3em;
  background-size: cover;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms-border-radius: 50%;
  -o-border-radius: 50%;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
}
</style>
