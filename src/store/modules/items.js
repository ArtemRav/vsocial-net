import { Config } from '@/models/config.model.js'
import { EnterItem } from '@/models/entry.model.js'
import { Comment } from '@/models/comment.model.js'
import { useSetViewLikes } from '@/hooks/view-likes.js'

export default {
  state() {
    return {
      errorRequestAPI: '',
      gIsCommentsExpanded: false,
      isEntriesLoaded: false,
      isNewEntryLoaded: true,
      isMoreLoaded: true,
      itemsList: [],
      tagsList: [],
      gConfig: {},
      directionsList: [],
      directionsListForPost: []
    }
  },
  mutations: {
    setConfig(state, payload) {
      state.gConfig = new Config(payload)
    },

    setAllExpandComments(state, payload) {
      state.gIsCommentsExpanded = payload
    },

    setErrorRequestAPI(state, payload) {
      state.errorRequestAPI = payload
    },

    setIsEntriesLoaded(state, payload) {
      state.isEntriesLoaded = payload
    },

    setIsNewEntryLoaded(state, payload) {
      state.isNewEntryLoaded = payload
    },

    setIsMoreLoaded(state, payload) {
      state.isMoreLoaded = payload
    },

    setItemsList(state, payload) {
      state.itemsList = payload
    },

    setDirections(state, payload) {
      state.directionsList = payload
    },

    setDirectionsForPost(state, payload) {
      state.directionsListForPost = payload
    },

    setTagsList(state, payload) {
      state.tagsList = payload
    }
  },
  actions: {
    setIsEntriesLoaded({ commit }, is_loaded) {
      commit('setIsEntriesLoaded', is_loaded)
    },

    setIsNewEntryLoaded({ commit }, is_loaded) {
      commit('setIsNewEntryLoaded', is_loaded)
    },

    setAllExpandComments({ commit }, id_expand) {
      commit('setAllExpandComments', id_expand)
    },

    setIsMoreLoaded({ commit }, is_loaded) {
      commit('setIsMoreLoaded', is_loaded)
    },

    setErrorRequestAPI({ commit }, errorText) {
      commit('setErrorRequestAPI', errorText)
    },

    setItemsList({ commit }, items) {
      commit('setItemsList', items)
    },

    setItemComments({ getters }, params) {
      const item = getters.getItemById(params.id)
      if (item) {
        item.comments = params.comments
      }
    },

    addNewItem({ commit, getters }, items) {
      const aItemsCreated = items.map(i => new EnterItem(i))
      let aItemsInit = getters.getItemsList
      let isChanged = false

      items.forEach(a => {
        const itemIndex = aItemsInit.map(i => i.id).indexOf(a.id)
        if (~itemIndex) {
          aItemsInit.splice(itemIndex, 1, a)
          isChanged = true
        }
      })

      if (isChanged) {
        commit('setItemsList', aItemsInit)
      } else {
        commit('setItemsList', [...aItemsCreated, ...aItemsInit])
      }

      commit('setIsNewEntryLoaded', true)
    },

    delItem({ commit, getters }, id) {
      const newListItems = getters.getItemsList
      commit(
        'setItemsList',
        newListItems.filter(i => i.id != id)
      )
    },

    addNewComment({ getters }, payload) {
      let aObjectComments = getters.getItemCommentsById(payload.objectId)
      aObjectComments.unshift(new Comment(payload.comment))
    },

    setItemLike({ getters }, params) {
      const item = getters.getItemById(params.objectId)

      if (item) {
        const curUser = getters.getGConfig.curUser
        useSetViewLikes(item, params, curUser)
      }
    },

    setCommentLike({ getters }, params) {
      const comment = getters.getObjectComment({ id: params.objectId, ownerId: params.ownerId })

      if (comment) {
        const curUser = getters.getGConfig.curUser
        useSetViewLikes(comment, params, curUser)
      }
    },

    setListRatedComment({ getters }, params) {
      const comment = getters.getObjectComment({ id: params.objectId, ownerId: params.ownerId })

      if (comment) {
        if (params.type == 'like') {
          comment.viewLikePersons = params.viewLikes
        } else {
          comment.viewDislikePersons = params.viewLikes
        }
      }
    },

    setListRatedItem({ getters }, params) {
      const item = getters.getItemById(params.objectId)

      if (item) {
        if (params.type == 'like') {
          item.viewLikePersons = params.viewLikes
        } else {
          item.viewDislikePersons = params.viewLikes
        }
      }
    }
  },
  getters: {
    getGConfig: state => state.gConfig,
    getHasConfig: state => state.gConfig && Object.keys(state.gConfig).length > 0,
    getgIsCommentsExpanded: state => state.gIsCommentsExpanded,
    getErrorRequestAPI: state => state.errorRequestAPI,
    getIsEntriesLoaded: state => state.isEntriesLoaded,
    getIsNewEntryLoaded: state => state.isNewEntryLoaded,
    getIsMoreLoaded: state => state.isMoreLoaded,
    getItemsList: state => state.itemsList,
    getTagsList: state => state.tagsList,
    getItemById: (_, getters) => id => getters.getItemsList.filter(i => i.id == id)[0],
    getItemCommentsById: (_, getters) => id => {
      const item = getters.getItemById(id)
      if (item && item?.comments) {
        return item.comments
      }
      return []
    },
    getItemType: (_, getters) => {
      const itemsList = getters.getItemsList
      if (itemsList.length > 0) {
        return itemsList[0]?.type || ''
      }
      return ''
    },
    getObjectComment: (_, getters) => params => {
      const itemComments = getters.getItemCommentsById(params.ownerId)
      return itemComments.filter(c => c.id == params.id)[0]
    },
    getCommentChildren: (_, getters) => params => {
      const entryComments = getters.getItemCommentsById(params.entryId)
      const commentsChildren = entryComments.filter(c => c.parentId === params.id)
      var iCount = commentsChildren.length

      function countDeepCommentsTree(acc) {
        acc.forEach(c => {
          const childComments = entryComments.filter(ch => ch.parentId === c.id)
          iCount += childComments.length

          if (childComments.length > 0) {
            countDeepCommentsTree(childComments)
          } else {
            return iCount
          }
        })
      }

      if (iCount > 0) {
        countDeepCommentsTree(commentsChildren)
      }

      return iCount
    },
    getDirectionsList: state => state.directionsList,
    getDirectionsListForPost: state => state.directionsListForPost
  }
}
