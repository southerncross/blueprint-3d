<template>
<li>
  <div class="collapsible-header edit-menu__header">
    <button
      class="btn-floating btn-large waves-effect waves-light tooltipped"
      data-position="left" data-delay="500" data-tooltip="画门模式"
      :class="menuBtnClassName"
      @click="setMode('door')"
    >
      <i class="icon-directions_run" :class="menuIconClassName"></i>
    </button>
  </div>
  <div class="collapsible-body edit-menu__body">
    <ul>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="锁定"
          @click="toggleDoorLock"
        >
          <i :class="lockIconClassName"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="可见性"
          @click="toggleDoorVisibility"
        >
          <i :class="visibilityIconClassName"></i>
        </button>
      </li>
    </ul>
  </div>
</li>
</template>

<script>
import {
  toggleDoorVisibility,
  toggleDoorLock
} from '../../../vuex/actions'

export default {
  name: 'DoorMenu',

  vuex: {
    getters: {
      existed: state => state.door.count > 0,
      visibility: state => state.door.visible ? 'visible' : 'hidden',
      locked: state => state.door.lock
    },
    actions: {
      toggleDoorVisibility,
      toggleDoorLock
    }
  },

  props: {
    mode: String,
    setMode: Function
  },

  computed: {
    show: function() {
      return this.mode === 'door'
    },
    menuBtnClassName: function() {
      return this.mode === 'door' ? 'green' : 'white'
    },
    menuIconClassName: function() {
      return this.mode === 'door' ? 'white-text' : 'black-text'
    },
    lockIconClassName: function() {
      return this.locked ? 'icon-lock' : 'icon-lock_open'
    },
    visibilityIconClassName: function() {
      return this.visibility === 'visible' ? 'icon-visibility' : 'icon-visibility_off'
    }
  }
}
</script>

<style lang="stylus">

</style>