<template>
<li>
  <div class="collapsible-header edit-menu__header">
    <button
      class="btn-floating btn-large waves-effect waves-light tooltipped"
      data-position="right" data-delay="500" data-tooltip="画窗模式"
      :class="menuBtnClassName"
      @click="setMode('window')"
    >
      <i class="icon-wb_sunny" :class="menuIconClassName"></i>
    </button>
  </div>
  <div class="collapsible-body edit-menu__body">
    <ul>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="锁定"
          @click="toggleWindowLock"
        >
          <i :class="lockIconClassName"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="可见性"
          @click="toggleWindowVisibility"
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
  toggleWindowVisibility,
  toggleWindowLock,
  addWindow
} from '../../../../vuex/actions'

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
      toggleWindowLock,
      addWindow
    }
  },

  props: {
    mode: String,
    elemEventControl: Object,
    svgEventControl: Object,
    windowPainter: Object,
    setMode: Function
  },

  computed: {
    isWindowMode: function() {
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
  },

  created() {
    this.elemEventControl
    .register('mouseover', (event) => {
      if (!this.isWindowMode) {
        return
      }
      const elem = this.svg.select(`#${event.target.id}`)
      if (elem.data('locked')) {
        return
      }
      if (elem.attr('class') !== 'wall') {
        return
      }
      this.windowPainter.hover(event.offsetX, event.offsetY, elem)
    })
    .register('mousemove', (event) => {
      if (!this.isWindowMode) {
        return
      }
      const elem = this.svg.select(`#${event.target.id}`)
      if (elem.data('locked')) {
        return
      }
      if (elem.attr('class') !== 'wall') {
        return
      }
      this.windowPainter.sync(event.offsetX, event.offsetY, elem)
    })

    this.svgEventControl
    .register('mousedown', (event) => {
      if (event.bypass) {
        return
      }
      if (!this.isWindowMode) {
        return
      }
      const _window = this.windowPainter.draw()
      if (_window) {
        this.elemEventControl.wrap(_window)
        this.addWindow()
      }
    })
  }
}
</script>

<style lang="stylus">

</style>