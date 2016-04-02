import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './features/home/Home'
import Workshop from './features/workshop/Workshop'
import Gallery from './features/workshop/Gallery'
import Edit from './features/workshop/Edit'
import View from './features/workshop/View'
import Notfound from './common/Notfound'

Vue.config.debug = true
Vue.use(VueRouter)

const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

router.map({
  '/workshop': {
    name: 'workshop',
    component: Workshop,
    subRoutes: {
      '/': {
        name: 'gallery',
        component: Gallery
      },
      '/view/:id': {
        name: 'view',
        component: View
      },
      '/edit/:id': {
        name: 'edit',
        component: Edit
      }
    }
  },

  '/home': {
    name: 'home',
    component: Home
  },

  '*': {
    component: Notfound
  }
})

router.redirect({
  '/': '/home'
})

router.beforeEach(() => {
  window.scrollTo(0, 0)
})

const App = Vue.extend(require('./App.vue'))
router.start(App, '#app')
