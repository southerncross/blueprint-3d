<template>
<li>
  <div class="collapsible-header edit-menu__header">
    <button
      class="btn-floating btn-large waves-effect waves-light tooltipped"
      data-position="right" data-delay="500" data-tooltip="选择模式"
      :class="menuBtnClassName"
      @click="setMode('select')"
    >
      <i class="icon-call_made" :class="menuIconClassName"></i>
    </button>
  </div>
  <div class="collapsible-body edit-menu__body">
    <ul>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="选中所有墙面"
          @click="selectAllWalls"
        >
          <i class="icon-apps white-text yellow darken-2"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="选中所有窗户"
          @click="selectAllWindows"
        >
          <i class="icon-apps white-text blue"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="选中门"
          @click="selectAllDoors"
        >
          <i class="icon-apps white-text green"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="选中背景图"
          @click="selectBackground"
        >
          <i class="icon-apps white-text red"></i>
        </button>
      </li>
    </ul>
  </div>
</li>
</template>

<script>
import $ from 'jquery'

import {
  removeBackground,
  removeWall,
  removeWindow,
  removeDoor
} from '../../../../vuex/actions'
import { isLineSelected } from '../../../../libs/utils'

export default {
  name: 'SelectMenu',

  vuex: {
    getters: {
      hasBackground: state => state.background.count > 0,
      hasWall: state => state.wall.count > 0,
      hasWindow: state => state.window.count > 0,
      hasDoor: state => state.window.count > 0
    },
    actions: {
      removeBackground,
      removeWall,
      removeWindow,
      removeDoor
    }
  },

  props: {
    mode: String,
    svg: Object,
    selectControl: Object,
    elemEventControl: Object,
    svgEventControl: Object,
    setMode: Function
  },

  computed: {
    isSelectMode: function() {
      return this.mode === 'select'
    },
    menuBtnClassName: function() {
      return this.mode === 'select' ? 'purple' : 'white'
    },
    menuIconClassName: function() {
      return this.mode === 'select' ? 'white-text' : 'black-text'
    }
  },

  data() {
    return {
      selectorBox: null,
      mousedown: false
    }
  },

  methods: {
    selectBackground() {
      const image = this.svg.select('image')
      this.selectControl.select(image)
    },
    selectAllWalls() {
      const walls = this.svg.selectAll('.wall')
      this.selectControl.select(walls)
    },
    selectAllWindows() {
      const windows = this.svg.selectAll('.window')
      this.selectControl.select(windows)
    },
    selectAllDoors() {
      const doors = this.svg.selectAll('.door')
      this.selectControl.select(doors)
    },
    onKeydown(event) {
      if (!this.isSelectMode) {
        return
      }

      if (event.code === 'Escape' ||
          event.keyCode === 27) {
        this.selectControl.reset()
        return
      }

      if (event.code === 'Backspace' ||
          event.keyCode === 8 ||
          event.code === 'Delete' ||
          event.keyCode === 46) {
        if (event.which === 8 && !$(event.target).is('input, textarea')) {
          event.preventDefault()
        }
        this.selectControl.selectedElems.forEach((elem) => {
          switch (elem.attr('class')) {
            case 'background':
              this.removeBackground()
              break
            case 'wall':
              this.removeWall()
              break
            case 'window':
              this.removeWindow()
              break
            case 'door':
              this.removeDoor()
              break
            default:
              break
          }
          elem.remove()
        })
        this.selectControl.reset()
      }
    }
  },

  created() {
    this.elemEventControl
    .register('mousedown', (event) => {
      event.bypass = this.isSelectMode
    })
    .register('mouseup', (event) => {
      event.bypass = this.isSelectMode
    })
    .register('click', (event) => {
      if (!this.isSelectMode) {
        return
      }
      const elem = this.svg.select(`#${event.target.id}`)
      if (elem.data('locked')) {
        return
      }
      event.bypass = true
      if (elem.data('selecting')) {
        return
      }
      this.selectControl.select(elem)
      // this.showElementUtils(elem)
    })

    this.svgEventControl
    .register('mousedown', (event) => {
      if (event.bypass) {
        return
      }
      if (!this.isSelectMode) {
        return
      }
      this.selectControl.reset()
      // this.hideElementUtils()
      const oldSelectorBox = this.svg.select('.selector-box')
      if (oldSelectorBox) {
        oldSelectorBox.remove()
      }
      this.svg.rect(
        event.offsetX,
        event.offsetY,
        0,
        0
      )
      .attr({
        class: 'selector-box',
        display: 'block',
        stroke: 'red',
        fill: 'transparent',
        strokeDasharray: '5, 5'
      })
      .data('x', event.offsetX)
      .data('y', event.offsetY)
      this.mousedown = true
    })
    .register('mousemove', (event) => {
      if (!this.mousedown) {
        return
      }
      if (!this.isSelectMode) {
        return
      }
      const selectorBox = this.svg.select('.selector-box')
      const oldX = parseInt(selectorBox.data('x'))
      const oldY = parseInt(selectorBox.data('y'))
      const newX = event.offsetX
      const newY = event.offsetY
      const width = Math.abs(oldX - newX)
      const height = Math.abs(oldY - newY)
      selectorBox.attr({
        x: Math.min(oldX, newX),
        y: Math.min(oldY, newY),
        width,
        height
      })
    })
    .register('mouseup', (event) => {
      this.mousedown = false
      if (event.bypass) {
        return
      }
      if (!this.isSelectMode) {
        return
      }
      const selectorBox = this.svg.select('.selector-box')
      if (!selectorBox) {
        return
      }
      const bbox = selectorBox.getBBox()
      const selectedElements = []
      this.svg.selectAll('line').forEach((line) => {
        if (isLineSelected(line, bbox)) {
          selectedElements.push(line)
        }
      })
      this.selectControl.select(selectedElements)
      selectorBox.remove()
    })

    document.addEventListener('keydown', this.onKeydown)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
  }
}
</script>

<style lang="stylus">
</style>