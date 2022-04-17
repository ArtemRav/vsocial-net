import { createStore } from 'vuex';

import constants from './modules/constants.js';
import api from './modules/api.js';
import items from './modules/items.js'

const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    constants,
    api,
    items
  },
});

export default store;
