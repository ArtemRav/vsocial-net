import { EnterItem } from '@/models/entry.model.js'
import { Comment } from '@/models/comment.model.js'
import { Like } from '@/models/like.model.js'

import { computed } from '@vue/runtime-core'

export default {
  state() {
    return {
      pageNum: 0,
      pageSize: 10,
      isLoadMore: false,
      filters: {
        search: '',
        directions: '',
        dateFrom: null,
        dateTo: null
      },
      activeCollectionTargetId: ''
    }
  },
  mutations: {
    setPageNum(state, payload) {
      state.pageNum = payload
    },

    setIsLoadMore(state, payload) {
      state.isLoadMore = payload
    },

    setFilters(state, payload) {
      state.filters = {
        search: payload?.search || '',
        directions: payload?.directions || '',
        dateFrom: payload?.dateFrom || null,
        dateTo: payload?.dateTo || null
      }
    },

    setActiveCollectionTargetId(state, payload) {
      state.activeCollectionTargetId = payload
    }
  },
  actions: {
    setPageNum({ commit }, num) {
      commit('setPageNum', num)
    },

    async api({ getters }, params) {
      const routeAPI = getters.getCONST_pathToAPI

      try {
        let body = params?.body
        if (body) {
          if (!(body instanceof FormData)) {
            body = JSON.stringify(body)
          }
        } else {
          body = {}
        }

        const response = await fetch(routeAPI + params.fnAPI, {
          method: 'POST',
          body
        })

        if (!response.ok) {
          params.handlerError(`Failed to send request to ${params.route}. Error: ${response.message}`)
          throw new Error(response.message || 'Failed to send request.')
        }

        let responseJson
        try {
          responseJson = await response.json()
        } catch (e) {
          if (params.hasOwnProperty('handlerError')) {
            params.handlerError('Response JSON parse error')
          }
          throw new Error('Response JSON parse error')
        }

        return responseJson
      } catch (e) {
        return {
          error: 1,
          errorText: e
        }
      }
    },

    async init({ commit, dispatch }, params) {
      const data = await dispatch('api', {
        fnAPI: 'InitSocialFeed',
        handlerError: errorText => {
          commit('setErrorRequestAPI', errorText)
        }
      })

      if (data.error > 0) {
        commit('setErrorRequestAPI', data.errorText)
      } else {
        commit('setDirections', data.aTargetsAll)
        commit('setDirectionsForPost', data.aTargetsForPost)
        commit('setTagsList', data.aTags)
        commit('setConfig', data.oConfig)
        if (params.isLoad) {
          dispatch('getItems')
        }
      }
    },

    async getItems({ commit, dispatch, getters }, payload) {
      const pageNum = computed(() => getters.getPageNum)
      const pageSize = computed(() => getters.getPageSize)
      const curFilters = computed(() => getters.getFilters)
      const sCollectionTargetId = computed(() => getters.getActiveCollectionTargetId)

      // Drop pageNum after applying filter
      if (
        !!payload &&
        (!curFilters.value.search || !curFilters.value.directions || !curFilters.value.dateFrom || !curFilters.value.dateTo)
      ) {
        commit('setPageNum', 0)
      }

      if (!!payload) {
        commit('setFilters', payload)
      }

      const data = await dispatch('api', {
        fnAPI: 'GetSocialFeedItems',
        handlerError: errorText => {
          commit('setErrorRequestAPI', errorText)
        },
        body: {
          iPageNum: pageNum.value,
          iPageSize: pageSize.value,
          directions: payload?.directions || '',
          search: payload?.search || '',
          dateFrom: payload?.dateFrom || null,
          dateTo: payload?.dateTo || null,
          sCollectionTargetId: sCollectionTargetId.value
        }
      })

      if (data.error > 0) {
        commit('setErrorRequestAPI', data.errorText)
      } else {
        const items = Array.isArray(data.array) ? data.array.map(i => new EnterItem(i)) : []
        const prevItems = getters.getItemsList

        commit('setItemsList', [...prevItems, ...items])
        commit('setIsMoreLoaded', true)
        commit('setIsEntriesLoaded', true)

        if (items.length > 0) {
          commit('setPageNum', pageNum.value + 1)
        }

        if (items.length < pageSize.value) {
          commit('setIsLoadMore', false)
        } else {
          commit('setIsLoadMore', true)
        }
      }
    },

    async getItemComments({ dispatch }, payload) {
      const data = await dispatch('api', {
        fnAPI: 'GetSocialItemComments',
        handlerError: errorText => {
          console.log('Error: ' + errorText)
        },
        body: {
          sItemID: payload.sItemID,
          sItemType: payload.sItemType,
          sItemComments: payload.sItemComments
        }
      })

      if (data.error > 0) {
        if (data?.errorText) {
          console.log('Error: ' + data.errorText)
        } else if (data.code == 500) {
          console.error('500 Internal Server Error')
        }
      } else {
        const aObjectComments = data.array.map(c => new Comment(c)) || []
        dispatch('setItemComments', { id: payload.sItemID, comments: aObjectComments })
      }
    },

    async postItem({ commit, dispatch, getters }, payload) {
      const formData = new FormData()

      if (payload.hasOwnProperty('aFiles')) {
        let count = 0
        payload.aFiles.forEach(f => {
          if (!f?.is_already_exist) {
            formData.append('file-' + count, f)
            count++
          }
        })
        delete payload.aFiles
      }

      for (let key in payload) {
        formData.append(key, payload[key])
      }

      commit('setIsNewEntryLoaded', false)

      const data = await dispatch('api', {
        fnAPI: 'PostSocialItem',
        handlerError: errorText => {
          commit('setErrorRequestAPI', errorText)
        },
        body: formData
      })

      if (data.error > 0) {
        commit('setErrorRequestAPI', data.errorText)
      } else {
        const directionsList = getters.getDirectionsList
        const directionsPosted = formData.get('sDirections').split(',')

        if (formData.get('sEntryID')) {
          // mode edit
          dispatch('addNewItem', data.array)
        } else {
          // mode new post
          directionsList.forEach(d => {
            if (~directionsPosted.indexOf(d.id)) {
              dispatch('addNewItem', data.array)
            }
          })
        }
      }
    },

    async getItem({ commit, dispatch }, payload) {
      const data = await dispatch('api', {
        fnAPI: 'GetSocialItem',
        handlerError: errorText => {
          commit('setErrorRequestAPI', errorText)
        },
        body: payload
      })

      if (data.error > 0) {
        commit('setErrorRequestAPI', data.errorText)
      } else {
        dispatch('addNewItem', data.array)
      }
    },

    async postComment({ commit, dispatch }, payload) {
      const formData = new FormData()

      payload.aFiles.forEach((f, i) => formData.append('file-' + i, f))
      delete payload.aFiles

      for (let key in payload) {
        formData.append(key, payload[key])
      }

      const data = await dispatch('api', {
        fnAPI: 'PostComment',
        handlerError: errorText => {
          commit('setErrorRequestAPI', errorText)
        },
        body: formData
      })

      if (data.error > 0) {
        commit('setErrorRequestAPI', data.errorText)
      } else {
        dispatch('addNewComment', {
          objectId: payload.sObjectID,
          parentId: payload.sParentID,
          comment: data.array[0]
        })
      }
    },

    async setLike({ commit, dispatch }, payload) {
      const data = await dispatch('api', {
        fnAPI: 'SetLike',
        handlerError: errorText => {
          commit('setErrorRequestAPI', errorText)
        },
        body: payload
      })

      if (data.error > 0) {
        commit('setErrorRequestAPI', data.errorText)
      } else {
        const oData = new Like(data.oLike)
        if (oData?.id) {
          if (oData.ownerId) {
            dispatch('setCommentLike', oData)
          } else {
            dispatch('setItemLike', oData)
          }
        }
      }
    },

    async getViewList({ commit, dispatch }, payload) {
      const data = await dispatch('api', {
        fnAPI: 'GetViewList',
        handlerError: errorText => {
          commit('setErrorRequestAPI', errorText)
        },
        body: payload
      })

      if (data.error > 0) {
        commit('setErrorRequestAPI', data.errorText)
      } else {
        if (data.aLikePersons.length > 0) {
          if (payload.sOwnerId) {
            dispatch('setListRatedComment', {
              objectId: payload.sObjectId,
              ownerId: payload.sOwnerId,
              type: payload.sLikeType,
              viewLikes: data.aLikePersons
            })
          } else {
            dispatch('setListRatedItem', { objectId: payload.sObjectId, type: payload.sLikeType, viewLikes: data.aLikePersons })
          }
        }
      }
    },

    async fireRmtAction({ commit, dispatch, getters }, payload) {
      const data = await dispatch('api', {
        fnAPI: payload.action,
        handlerError: errorText => {
          commit('setErrorRequestAPI', errorText)
        },
        body: payload
      })

      if (data.error > 0) {
        commit('setErrorRequestAPI', data.errorText)
      } else {
        commit('setErrorRequestAPI', data.sMessage)

        switch (payload.action) {
          case 'Subscribe':
            const itemSubscribed = getters.getItemById(payload.sObjectID)
            if (itemSubscribed) {
              itemSubscribed.hasSubscription = !itemSubscribed.hasSubscription
            }
            break

          case 'DeleteSocialItem':
            dispatch('delItem', payload.sObjectID)
            break

          case 'DeleteComment':
            dispatch('getItemComments', {
              sItemID: payload.sOwnerID,
              sItemType: 'comment',
              sItemComments: ''
            })
            break

          case 'BlockSocialItem':
            const itemBlocked = getters.getItemById(payload.sObjectID)
            if (itemBlocked) {
              itemBlocked.blocked = !itemBlocked.blocked
            }
            break

          case 'RefreshTargets':
            commit('setDirections', data.aTargetsAll)
            commit('setDirectionsForPost', data.aTargetsForPost)
            break
        }
      }
    },

    setActiveCollectionTargetId({ commit }, id) {
      commit('setActiveCollectionTargetId', id)
    }
  },
  getters: {
    getPageNum: state => state.pageNum,
    getPageSize: state => state.pageSize,
    getIsLoadMore: state => state.isLoadMore,
    getFilters: state => state.filters,
    getActiveCollectionTargetId: state => state.activeCollectionTargetId
  }
}
