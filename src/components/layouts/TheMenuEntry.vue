<template>
  <div class="vsn-me">
    <ul class="vsn-me__list">
      <li class="vsn-me__item" v-for="operation in operations" :key="operation" @click="operation.action">
        <BaseIcon :icon-name="operation.type" class="vsn-me__icon"></BaseIcon>
        <div class="vsn-me__item__text vsn-overflow-ellipsis">{{ operation.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  props: {
    options: Array,
    entryId: String,
    ownerId: String
  },
  emits: ['open-share', 'edit-entry', 'block-entry'],
  setup(props, { emit }) {
    const store = useStore()
    const operations = computed(() => props.options)
    const objectId = computed(() => props.entryId)
    const ownerId = computed(() => props.ownerId)

    function subsOnEntry() {
      store.dispatch('fireRmtAction', { sObjectID: objectId.value, action: 'Subscribe' })
    }

    function delEntry() {
      store.dispatch('fireRmtAction', { sObjectID: objectId.value, action: 'DeleteSocialItem' })
    }

    function delComment() {
      store.dispatch('fireRmtAction', { sObjectID: objectId.value, sOwnerID: ownerId.value, action: 'DeleteComment' })
    }

    operations.value.forEach(o => {
      switch (o.type) {
        case 'share':
          o.action = () => emit('open-share')
          break

        case 'subs':
          o.action = subsOnEntry
          break

        case 'del_entry':
          o.action = delEntry
          break

        case 'del_comment':
          o.action = delComment
          break

        case 'edit_entry':
          o.action = () => emit('edit-entry')
          break

        case 'block_entry':
          o.action = () => emit('block-entry')
          break
      }
    })

    return {
      operations
    }
  }
}
</script>

<style>
.vsn-me {
  position: absolute;
  display: flex;
  max-width: 18em;
  background-color: var(--gray-0);
  box-shadow: 0px 8px 24px 0px #0000001a;
  border-radius: 8px;
  z-index: 1;
}

.vsn-me .vsn-me__item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5em;
  color: var(--gray-100);
  font-size: 1em;
}

.vsn-me .vsn-me__item:hover {
  cursor: pointer;
  color: var(--blue-base);
}

.vsn-me .vsn-me__item .vsn-me__icon,
.vsn-me .vsn-me__item .vsn-me__icon {
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5em;
  background-size: 1em;
  background-position: center;
  background-repeat: no-repeat;
}

.vsn-me .vsn-me__item:hover .vsn-bgi-subs {
  background-image: var(--bg-image-time-icon-blue);
}

.vsn-me .vsn-me__item:hover .vsn-bgi-share {
  background-image: var(--bg-image-share-icon-blue);
}

.vsn-me .vsn-me__item:hover .vsn-bgi-del_entry,
.vsn-me .vsn-me__item:hover .vsn-bgi-del_comment {
  background-image: var(--bg-image-basket-icon-blue);
}

.vsn-me .vsn-me__item:hover .vsn-bgi-edit_entry {
  background-image: var(--bg-image-edit-icon-blue);
}

.vsn-me .vsn-me__item:hover .vsn-bgi-block_entry {
  background-image: var(--bg-image-block-icon-blue);
}
</style>
