import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  background: {
    count: 0,
    lock: false,
    visible: true,
    opacity: 0.3
  },
  wall: {
    count: 0,
    lock: false,
    visible: true
  },
  window: {
    count: 0,
    lock: false,
    visible: true
  },
  door: {
    count: 0,
    lock: false,
    visible: true
  }
}

const mutations = {
  UPDATE_BACKGROUND (state) {
    state.bakcground.count = 1
  },

  ADD_WALL (state) {
    state.wall.count++
  },

  REMOVE_WALL (state) {
    state.wall.count--
  },

  ADD_WINDOW (state) {
    state.window.count++
  },

  REMOVE_WINDOW (state) {
    state.window.count--
  },

  ADD_DOOR (state) {
    state.door.count++
  },

  REMOVE_DOOR (state) {
    state.door.count--
  },

  TOGGLE_TODO (state, todo) {
    todo.done = !todo.done
  }
}

export default new Vuex.Store({
  state,
  mutations
})
