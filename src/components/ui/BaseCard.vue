<template>
  <div class="vsn-base-card" :class="mode">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    mode: String
  },
  setup() {}
}
</script>

<style>
.vsn-base-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
  padding: 2em;
  margin: 0;
  background-color: var(--gray-0);
  border-radius: 16px;
}

.vsn-base-card.info {
  background-color: var(--gray-5);
  border-radius: 0;
  padding: 0;
}

/* For mobile */ 
@media screen and (max-width: 576px) {
  .vsn-base-card {
    padding: 1em;
    border-radius: 8px;
  }
}
</style>
