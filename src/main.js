import "normalize.css"
import { createApp, defineAsyncComponent } from 'vue'
import { Vue3Mq } from 'vue3-mq'
import App from './App.vue'

import { router } from './router.js'
import store from './store/index.js'

import './styles/variables.css'
import './styles/classes.css'
import './styles/fonts.css'
import './styles/main.css'

import VueFlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

import directives from './directives'

const BaseIcon = defineAsyncComponent(() => import('./components/ui/BaseIcon.vue'))
const BaseComment = defineAsyncComponent(() => import('./components/ui/BaseComment.vue'))
const BaseLoader = defineAsyncComponent(() => import('./components/ui/BaseLoader.vue'))
const BaseCommentsList = defineAsyncComponent(() => import('./components/ui/BaseCommentsList.vue'))
const TheMenuEntry = defineAsyncComponent(() => import('./components/layouts/TheMenuEntry.vue'))
const TheLikeUsersView = defineAsyncComponent(() => import('./components/layouts/TheLikeUsersView.vue'))
const EntryShare = defineAsyncComponent(() => import('./components/entries/EntryShare.vue'))
const EntryEdit = defineAsyncComponent(() => import('./components/entries/EntryEdit.vue'))

const app = createApp(App)

app.component('BaseIcon', BaseIcon)
app.component('BaseComment', BaseComment)
app.component('BaseLoader', BaseLoader)
app.component('BaseCommentsList', BaseCommentsList)
app.component('TheMenuEntry', TheMenuEntry)
app.component('TheLikeUsersView', TheLikeUsersView)
app.component('EntryShare', EntryShare)
app.component('EntryEdit', EntryEdit)

directives(app)

app.use(router)
app.use(store)
app.use(VueFlatPickr)
app.use(Vue3Mq, {
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 1024
  }
})

app.mount('#vsocial-net-app')
