<template>
<li>
  <div class="collapsible-header edit-menu__header">
    <button
      class="btn-floating btn-large waves-effect waves-light tooltipped"
      :class="menuBtnClassName"
      data-position="right" data-delay="500" data-tooltip="背景"
      @click="setMode('background')">
      <i class="icon-now_wallpaper" :class="menuIconClassName"></i>
    </button>
  </div>
  <div class="collapsible-body edit-menu__body">
    <ul>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="添加背景"
          @click="loadBackground"
        >
          <i class="icon-image"></i>
        </button>
      </li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="锁定"
          @click="toggleBackgroundLock"
        >
          <i :class="lockIconClassName"></i>
        </button>
      <li>
      <button
        class="btn-floating btn-small waves-effect waves-light tooltipped"
        data-position="right" data-delay="0" data-tooltip="可见性"
        @click="toggleBackgroundVisibility"
      >
        <i :class="visibilityIconClassName"></i>
      </button>
      </li>
    </ul>
  </div>
  <input
    id="background-menu__background-input"
    type="file"
    @change="onBackgroundChange"
  />
</li>
</template>

<script>
import {
  updateBackground,
  toggleBackgroundLock,
  toggleBackgroundVisibility,
  updateBackgroundOpacity
} from '../../../vuex/actions'

export default {
  name: 'BackgroundMenu',

  vuex: {
    getters: {
      existed: state => state.background.count > 0,
      visibility: state => state.background.visible ? 'visible' : 'hidden',
      locked: state => state.background.lock,
      opacity: state => state.background.opacity
    },
    actions: {
      updateBackground,
      toggleBackgroundLock,
      toggleBackgroundVisibility,
      updateBackgroundOpacity
    }
  },

  props: {
    mode: String,
    svg: Object,
    className: String,
    setMode: Function,
    wrapElementWithEventHandler: Function
  },

  computed: {
    show: function() {
      return this.mode === 'background'
    },
    menuBtnClassName: function() {
      return this.mode === 'background' ? 'red' : 'white'
    },
    menuIconClassName: function() {
      return this.mode === 'background' ? 'white-text' : 'black-text'
    },
    lockIconClassName: function() {
      return this.locked ? 'icon-lock' : 'icon-lock_open'
    },
    visibilityIconClassName: function() {
      return this.visibility === 'visible' ? 'icon-visibility' : 'icon-visibility_off'
    }
  },

  methods: {
    loadBackground() {
      const input = document.getElementById('background-menu__background-input')
      input.click()
    },
    onBackgroundChange(event) {
      const file = event.target.files[0]
      if (!file) {
        return
      }

      const elem = this.svg.select(`.${this.className}`)
      if (elem) {
        elem.remove()
      }

      const url = window.URL.createObjectURL(file)
      const desc = this.svg.select('desc')
      const newElem = this.svg.image(url)
      .attr({
        class: this.className,
        id: this.className,
        opacity: parseFloat(this.opacity) / 100
      })

      this.wrapElementWithEventHandler(newElem)
      this.existed = true

      desc.after(newElem)
    }
  }
}
</script>

<style lang="stylus">
#background-menu__background-input
  display none
</style>