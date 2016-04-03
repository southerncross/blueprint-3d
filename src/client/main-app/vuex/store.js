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
  // Background
  UPDATE_BACKGROUND (state) {
    state.bakcground.count = 1
  },
  REMOVE_BACKGROUND (state) {
    state.background.count = 0
  },
  TOGGLE_BACKGROUND_LOCK (state) {
    state.background.lock = !state.background.lock
  },
  TOGGLE_BACKGROUND_VISIBILITY (state) {
    state.background.visible = !state.background.visible
  },
  UPDATE_BACKGROUND_OPACITY (state, opacity) {
    state.background.opacity = opacity
  },

  // Wall
  ADD_WALL (state) {
    state.wall.count++
  },
  REMOVE_WALL (state) {
    state.wall.count--
  },
  TOGGLE_WALL_LOCK (state) {
    state.wall.lock = !state.wall.lock
  },
  TOGGLE_WALL_VISIBILITY (state) {
    state.wall.visible = !state.wall.visible
  },

  // Window
  ADD_WINDOW (state) {
    state.window.count++
  },
  REMOVE_WINDOW (state) {
    state.window.count--
  },
  TOGGLE_WINDOW_LOCK (state) {
    state.window.lock = !state.window.lock
  },
  TOGGLE_WINDOW_VISIBILITY (state) {
    state.window.visible = !state.window.visible
  },

  // Door
  ADD_DOOR (state) {
    state.door.count++
  },
  REMOVE_DOOR (state) {
    state.door.count--
  },
  TOGGLE_DOOR_LOCK (state) {
    state.door.lock = !state.door.lock
  },
  TOGGLE_DOOR_VISIBILITY (state) {
    state.door.visible = !state.door.visible
  }
}

export default new Vuex.Store({
  state,
  mutations
})
