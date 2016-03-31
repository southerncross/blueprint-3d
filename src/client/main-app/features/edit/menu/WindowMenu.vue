<template>
<div>
  <button
    class="btn-floating btn-large waves-effect waves-light tooltipped"
    data-position="left" data-delay="500" data-tooltip="画窗模式"
    :class="menuBtnClassName"
    @click="setMode('window')"
  >
    <i class="icon-wb_sunny" :class="menuIconClassName"></i>
  </button>
  <div
    v-show="show"
    class="window-menu__utils__item__sub-utils"
    transition="slide-right-to-left"
  >
    <button
      v-show="existed"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="锁定"
      @click="toggleWindowLock"
    >
      <i :class="lockIconClassName"></i>
    </button>
    <button
      v-show="existed"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="可见性"
      @click="toggleWindowVisibility"
    >
      <i :class="visibilityIconClassName"></i>
    </button>
  </div>
</div>
</template>

<script>
import {
  toggleWindowVisibility,
  toggleWindowLock
} from '../../../vuex/actions'

export default {
  name: 'WindowMenu',

  vuex: {
    getters: {
      existed: state => state.window.count > 0,
      visibility: state => state.window.visible ? 'visible' : 'hidden',
      locked: state => state.window.lock
    },
    actions: {
      toggleWindowVisibility,
      toggleWindowLock
    }
  },

  props: {
    mode: String,
    setMode: Function
  },

  computed: {
    show: function() {
      return this.mode === 'window'
    },
    menuBtnClassName: function() {
      return this.mode === 'window' ? 'blue' : 'white'
    },
    menuIconClassName: function() {
      return this.mode === 'window' ? 'white-text' : 'black-text'
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