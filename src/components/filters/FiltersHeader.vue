<template>
  <MqResponsive target="sm-lg" class="vsn-filter__header">
    <div class="vsn-filter__header__tabs" v-if="filterTabs.length > 0">
      <FiltersTab :filter-tabs="filterTabs" @toggle-tab="updateData"></FiltersTab>
    </div>

    <div class="vsn-filter__header__controls">
      <BaseTag class="vsn-filters-title" v-if="hasFilters" :name="FILTERS" :icon="iconFilter" @click="openFilters"></BaseTag>

      <BaseButtonFrame :type="'icon'">
        <template v-slot:default>
          <BaseIcon
            :iconName="'union-center'"
            :state="iconState.expand ? 'active' : ''"
            :title="EXPAND_COMMENTS"
            @click="expandAllComments($event, 'expand')"
          ></BaseIcon>
        </template>
      </BaseButtonFrame>

      <BaseButtonFrame :type="'icon'">
        <template v-slot:default>
          <BaseIcon
            :iconName="'union'"
            :state="iconState.collapse ? 'active' : ''"
            :title="COLLAPSE_COMMENTS"
            @click="expandAllComments($event, 'collapse')"
          ></BaseIcon>
        </template>
      </BaseButtonFrame>
    </div>
  </MqResponsive>

  <MqResponsive target="xs" class="vsn-filter__header" :class="{ active: filterOpened }">
    <div class="vsn-filter__header__controls">
      <div class="vsn-filter-controls-wrapper" v-if="!filterOpened">
        <BaseCard class="vsn-filter__header__filter" v-if="hasFilters" @click="openFilters">
          <BaseIcon :icon-name="'filter'"></BaseIcon>
          <div class="vsn-filters-title">{{ FILTERS }}</div>
        </BaseCard>

        <div class="vsn-union-btns__wrapper">
          <BaseButtonFrame :type="'icon'">
            <template v-slot:default>
              <BaseIcon
                :iconName="'union-center'"
                :state="iconState.expand ? 'active' : ''"
                :title="EXPAND_COMMENTS"
                @click="expandAllComments($event, 'expand')"
              ></BaseIcon>
            </template>
          </BaseButtonFrame>

          <BaseButtonFrame :type="'icon'">
            <template v-slot:default>
              <BaseIcon
                :iconName="'union'"
                :state="iconState.collapse ? 'active' : ''"
                :title="COLLAPSE_COMMENTS"
                @click="expandAllComments($event, 'collapse')"
              ></BaseIcon>
            </template>
          </BaseButtonFrame>
        </div>
      </div>

      <BaseCard v-else>
        <div class="vsn-filters-title">{{ FILTERS }}</div>
        <BaseIcon :icon-name="'close'" @click="openFilters"></BaseIcon>
      </BaseCard>
    </div>

    <div class="vsn-filter__header__tabs" v-if="filterTabs.length > 0 && filterOpened">
      <FiltersTab :filter-tabs="filterTabs" @toggle-tab="updateData"></FiltersTab>
    </div>
  </MqResponsive>
</template>

<script>
import BaseButtonFrame from '@/components/ui/BaseButtonFrame.vue'
import FiltersTab from './FiltersTab.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { MqResponsive } from 'vue3-mq'

import { useStore } from 'vuex'
import { reactive, ref } from '@vue/reactivity'
import { computed, watch } from '@vue/runtime-core'

export default {
  components: {
    BaseButtonFrame,
    FiltersTab,
    BaseTag,
    BaseCard,
    MqResponsive
  },
  emits: ['open-filters'],
  setup(_, { emit }) {
    const store = useStore()

    const hasFilters = ref(false)
    const filterTabs = ref([])
    const gConfig = computed(() => store.getters.getGConfig)
    watch(gConfig, cur => {
      hasFilters.value = cur.bAllowFilters && gConfig.value.aFilters.length > 0
      if (
        Array.isArray(cur.sTargetCollectionId) &&
        cur.sTargetCollectionId.length > 0 &&
        cur.sTargetCollectionId[0].hasOwnProperty('name')
      ) {
        filterTabs.value = cur.sTargetCollectionId
      }
    })

    const FILTERS = store.getters.getCONST_Filters
    const EXPAND_COMMENTS = store.getters.getCONST_ExpandComments
    const COLLAPSE_COMMENTS = store.getters.getCONST_CollapseComments
    const iconFilter = ref('plus-blue')
    const filterOpened = ref(false)
    const iconState = reactive({
      expand: false,
      collapse: true
    })

    function expandAllComments(_, type) {
      if (type == 'expand') {
        store.dispatch('setAllExpandComments', true)
        iconState['expand'] = true
        iconState['collapse'] = false
      } else {
        store.dispatch('setAllExpandComments', false)
        iconState['collapse'] = true
        iconState['expand'] = false
      }
    }

    function openFilters() {
      filterOpened.value = !filterOpened.value
      if (filterOpened.value) {
        iconFilter.value = 'minus-blue'
      } else {
        iconFilter.value = 'plus-blue'
      }
      emit('open-filters', filterOpened.value)
    }

    function updateData(id) {
      _dropPrevData()
      _getNewData(id)
      _setActiveTab(id)
    }

    function _dropPrevData() {
      store.commit('setIsEntriesLoaded', false)
      store.commit('setDirectionsForPost', [])
      store.commit('setPageNum', 0)
      store.commit('setItemsList', [])
    }

    function _getNewData(id) {
      store.dispatch('fireRmtAction', { sCollectionTargetId: id, action: 'RefreshTargets' })
      store.dispatch('setActiveCollectionTargetId', id)
      store.dispatch('getItems')
    }

    function _setActiveTab(id) {
      filterTabs.value.forEach(t => {
        if (t.id == id) {
          t.state = 'active'
        } else {
          t.state = ''
        }
      })
    }

    return {
      FILTERS,
      EXPAND_COMMENTS,
      COLLAPSE_COMMENTS,
      hasFilters,
      iconFilter,
      iconState,
      expandAllComments,
      filterTabs,
      updateData,
      filterOpened,
      openFilters
    }
  }
}
</script>

<style>
.vsn-filter__header {
  display: flex;
  flex-grow: 1;
  width: 100%;
  /* justify-content: space-between; */
  justify-content: flex-end;
}
.vsn-filter__header .vsn-filter__header__tabs,
.vsn-filter__header .vsn-filter__header__controls {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
}

.vsn-filter__header .vsn-filter__header__controls {
  flex-grow: 0;
}

.vsn-filter__header .vsn-filter__header__controls .vsn-filters-title {
  font-size: 0.75em;
  color: var(--blue-base);
  cursor: pointer;
}
.vsn-filter__header .vsn-filter__header__controls .vsn-filters-title .vsn-tag__text {
  margin-right: 0.5em;
}

/* For mobile */
@media screen and (max-width: 576px) {
  .vsn-filter__header {
    flex-direction: column;
  }
  .vsn-filter__header .vsn-filter__header__filter {
    flex-direction: row;
    max-width: 7.25em;
    border-radius: 8px;
  }
  .vsn-filter__header .vsn-filter__header__filter .vsn-filters-title {
    color: var(--gray-100);
    font-weight: bold;
    font-size: 0.788em;
  }
  .vsn-filter__header .vsn-filter__header__controls,
  .vsn-filter__header .vsn-filter-controls-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .vsn-filter__header.active .vsn-filter__header__controls {
    border-bottom: 1px solid var(--gray-30);
  }
  .vsn-filter__header.active .vsn-filter__header__controls .vsn-base-card {
    justify-content: space-between;
  }
  .vsn-filter__header .vsn-union-btns__wrapper {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }
  .vsn-filter__header .vsn-base-card {
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem 1.4em;
    border-radius: 0;
  }
  .vsn-filter__header.active .vsn-base-card {
    padding: 1em;
    justify-content: unset;
  }
  .vsn-filter__header .vsn-filter-controls-wrapper .vsn-base-card {
    border-radius: 8px;
  }
  .vsn-filter__header.active .vsn-filters-title {
    color: var(--gray-100);
    font-size: 1.164em;
    font-weight: 600;
  }
  .vsn-filter__header .vsn-bgi-close {
    width: 1.4em;
    height: 1.4em;
    background-size: 1.4em;
  }
}
</style>
