import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default function useGetEntryItem(inject) {
  const store = useStore()
  const route = useRoute()

  let entryItem = inject('entryItem')
  if (!entryItem) {
    entryItem = store.getters.getItemById(route.params.id)
  }

  return {
    store,
    route,
    entryItem
  }
}
