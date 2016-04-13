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
          @click="onToggleWallLock"
        >
          <i :class="lockIconClassName"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="可见性"
          @click="onToggleWallVisibility"
        >
          <i :class="visibilityIconClassName"></i>
        </button>
      </li>
      <li>
        <div class="range-field edit-menu__range">
          <input type="range" min="0" max="100" :value="opacity" @input="changeOpacity"/>
        </div>
      </li>
    </ul>
  </div>
</li>
</template>

<script>
import {
  toggleWallVisibility,
  toggleWallLock,
  addWall
} from '../../../../vuex/actions'

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
      toggleWallLock,
      addWall
    }
  },

  props: {
    mode: String,
    svg: Object,
    elemEventControl: Object,
    svgEventControl: Object,
    wallPainter: Object,
    setMode: Function
  },

  computed: {
    isWallMode: function() {
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
  },

  data() {
    return {
      opacity: 100
    }
  },

  created() {
    this.svgEventControl
    .register('mousedown', (event) => {
      if (event.bypass) {
        return
      }
      if (!this.isWallMode) {
        return
      }
      if (this.wallPainter.isDrawing) {
        this.addWall()
      }
      const wall = this.wallPainter.draw()
      this.elemEventControl.wrap(wall)
    })
  },

  methods: {
    changeOpacity(event) {
      this.opacity = event.target.value
      this.svg.selectAll('.wall').forEach((wall) => {
        wall.attr({ opacity: this.opacity / 100 })
      })
    },
    onToggleWallLock() {
      this.toggleWallLock()
      this.svg.selectAll('.wall').forEach((wall) => {
        wall.data('locked', this.locked)
      })
    },
    onToggleWallVisibility() {
      this.toggleWallVisibility()
      console.error('boring', this.visibility)
      this.svg.selectAll('.wall').forEach((wall) => {
        wall.attr({ visibility: this.visibility })
      })
    }
  }
}
</script>

<style lang="stylus">
.edit-menu__range
  transform rotate(90deg)
  margin 10px 0 0 0
  padding 0
  width 50px
</style>