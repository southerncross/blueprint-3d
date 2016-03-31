import Vue from 'vue'
import Router from 'vue-router'

import App from './App'
import CreateBlueprint from './features/edit/CreateBlueprint'

Vue.config.debug = true
Vue.use(Router)

const router = new Router()

router.map({
  '/create-blueprint': {
    name: 'create-blueprint',
    component: CreateBlueprint
  }
})

router.beforeEach(() => {
  window.scrollTo(0, 0)
})

router.start(App, '#app')
