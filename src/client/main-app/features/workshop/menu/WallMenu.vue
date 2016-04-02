<template>
<li>
  <div class="collapsible-header edit-menu__header">
    <button
      class="btn-floating btn-large waves-effect waves-light tooltipped"
      data-position="right" data-delay="500" data-tooltip="画墙模式"
      :class="menuBtnClassName"
      @click="setMode('wall')"
    >
      <i class="icon-border_style" :class="menuIconClassName"></i>
    </button>
  </div>
  <div class="collapsible-body edit-menu__body">
    <ul>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="锁定"
          @click="toggleWallLock"
        >
          <i :class="lockIconClassName"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="可见性"
          @click="toggleWallVisibility"
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
  toggleWallVisibility,
  toggleWallLock
} from '../../../vuex/actions'

export default {
  name: 'WallMenu',

  vuex: {
    getters: {
      existed: state => state.wall.count > 0,
      visibility: state => state.wall.visible ? 'visible' : 'hidden',
      locked: state => state.wall.lock
    },
    actions: {
      toggleWallVisibility,
      toggleWallLock
    }
  },

  props: {
    mode: String,
    setMode: Function
  },

  computed: {
    show: function() {
      return this.mode === 'wall'
    },
    menuBtnClassName: function() {
      return this.mode === 'wall' ? 'yellow darken-2' : 'white'
    },
    menuIconClassName: function() {
      return this.mode === 'wall' ? 'white-text' : 'black-text'
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