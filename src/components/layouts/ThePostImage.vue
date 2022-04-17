<template>
  <div class="vsn-post-img__wrapper">
    <img class="vsn-post-img__img" :src="imgUrl" :alt="imgName" />
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: String,
    imgName: String
  },
  setup() {}
}
</script>

<style>
.vsn-post-img__wrapper {
  display: flex;
  max-width: 100%;
  padding: 0 1.5rem 1.5rem 1.5em;
}
.vsn-post-img__img {
  width: 100%;
  height: auto;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: var(--gray-30);
  object-fit: contain;
}
</style>
