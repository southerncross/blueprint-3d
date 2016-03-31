<template>
<div class="blueprint-edit-panel__container">
  <svg-canvas
    class="edit-page__svg-canvas"
    :svg="svg"
  >
  </svg-canvas>
  <menu-container
    class="edit-page__menu-container"
    :mode="mode"
    :svg.once="svg"
    :set-mode.once="setMode"
    :wrap-element-with-event-handler.once="wrapElementWithEventHandler"
    :select-background.once="selectBackground"
    :select-all-walls.once="selectAllWalls"
    :select-all-windows.once="selectAllWindows"
    :select-all-doors.once="selectAllDoors"
  >
  </menu-container>
<!--   <modifier-container
    class="edit-page__modifier-container"
  >
  </modifier-container> -->
</div>
</template>

<script>
import $ from 'jquery'

import SvgCanvas from './SvgCanvas'
import MenuContainer from './menu/MenuContainer'
import ModifierContainer from './modifier/ModifierContainer'
import SelectControl from '../../libs/svg/SelectControl'
import ConnectedLinePainter from '../../libs/svg/ConnectedLinePainter'
import HoverControl from '../../libs/svg/HoverControl'
import { isLineSelected } from '../../libs/utils'

export default {
  name: 'EditPage',

  components: {
    SvgCanvas,
    MenuContainer,
    ModifierContainer
  },

  props: {
    svg: {
      type: Object
    },
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      mode: 'select',
      configs: {
        background: {
          count: 0,
          visibility: 'visible',
          locked: false,
          opacity: 30
        },
        wall: {
          count: 0,
          visibility: 'visible',
          locked: false
        },
        door: {
          count: 0,
          visibility: 'visible',
          locked: false
        },
        window: {
          count: 0,
          visibility: 'visible',
          locked: false
        }
      },
      selectorBox: null,
      elementUtilsType: null,
      mouseDown: false
    }
  },

  methods: {
    setMode(nextMode) {
      if (nextMode === this.mode) {
        return
      }
      this.mode = nextMode
      this.elementUtilsType = null
      this.selectControl.reset()
      this.wallPainter.cancel()
    },

    showElementUtils(elem) {
      this.elementUtilsType = elem.data('elementType')
    },

    hideElementUtils() {
      this.elementUtilsType = null
    },

    selectBackground() {
      const image = this.svg.select('image')
      this.selectControl.select(image)
    },

    loadBackgroundImg() {
      const input = document.getElementById('blueprint-edit-panel__background-input')
      input.click()
    },

    onToggleBackgroundImgVisibility() {
      const { background } = this.configs
      background.visibility = (background.visibility === 'visible') ? 'hidden' : 'visible'
      const elem = this.svg.select('.background')
      if (elem) {
        elem.attr({ visibility: background.visibility })
      }
    },

    onToggleBackgroundImgLockStatus() {
      const { background } = this.configs
      background.locked = !background.locked
      const elem = this.svg.select('.background')
      if (elem) {
        elem.data({ 'locked': background.locked })
      }
    },

    onBackgroundImgOpacityChange(event) {
      const elem = this.svg.select('.background')
      if (elem) {
        elem.attr({ opacity: parseFloat(event.target.value) / 100 })
      }
    },

    onBackgroundImgChange(event) {
      const file = event.target.files[0]
      if (!file) {
        return
      }

      const { background } = this.configs
      const elem = this.svg.select('.background')
      if (elem) {
        elem.remove()
      }

      const url = window.URL.createObjectURL(file)
      const desc = this.svg.select('desc')
      const newElem = this.svg.image(url)
      .attr({
        class: 'background',
        id: 'blueprint-background',
        opacity: parseFloat(background.opacity) / 100
      })
      .data({ elementType: 'background' })

      this.wrapElementWithEventHandler(newElem)
      this.configs.background.count = 1

      desc.after(newElem)

      this.setMode('select')
    },

    selectAllWalls() {
      const walls = this.svg.selectAll('.wall')
      this.selectControl.select(walls)
    },

    onToggleWallVisibility() {
      const { wall } = this.configs
      wall.visibility = (wall.visibility === 'visible') ? 'hidden' : 'visible'
      this.svg.selectAll('.wall').forEach((elem) => {
        elem.attr({ visibility: wall.visibility })
      })
    },

    onToggleWallLockStatus() {
      const { wall } = this.configs
      wall.locked = !wall.locked
      this.svg.selectAll('.wall').forEach((elem) => {
        elem.data({ 'locked': wall.locked })
      })
    },

    onToggleWindowVisibility() {
      const _window = this.configs.window
      _window.visibility = (_window.visibility === 'visible') ? 'hidden' : 'visible'
      this.svg.selectAll('.window').forEach((elem) => {
        elem.attr({ visibility: _window.visibility })
      })
    },

    onToggleWindowLockStatus() {
      const _window = this.configs.window
      _window.locked = !_window.locked
      this.svg.selectAll('.window').forEach((elem) => {
        elem.data({ 'locked': _window.locked })
      })
    },

    selectAllWindows() {
      const windows = this.svg.selectAll('.window')
      this.selectControl.select(windows)
    },

    onToggleDoorVisibility() {
      const door = this.configs.door
      door.visibility = (door.visibility === 'visible') ? 'hidden' : 'visible'
      this.svg.selectAll('.door').forEach((elem) => {
        elem.attr({ visibility: door.visibility })
      })
    },

    onToggleDoorLockStatus() {
      const door = this.configs.door
      door.locked = !door.locked
      this.svg.selectAll('.door').forEach((elem) => {
        elem.data({ 'locked': door.locked })
      })
    },

    selectAllDoors() {
      const doors = this.svg.selectAll('.door')
      this.selectControl.select(doors)
    },

    onMousedown(event) {
      if (event.bypass) {
        return
      }
      switch (this.mode) {
        case 'select': {
          this.selectControl.reset()
          this.hideElementUtils()
          this.selectorBox
          .attr({
            x: event.offsetX,
            y: event.offsetY,
            width: 0,
            height: 0,
            display: 'block'
          })
          .data('x', event.offsetX)
          .data('y', event.offsetY)
          this.mouseDown = true
          break
        }
        case 'wall': {
          if (this.wallPainter.isDrawing) {
            this.configs.wall.count++
          }
          const wall = this.wallPainter.draw()
          this.wrapElementWithEventHandler(wall)
          break
        }
        case 'door': {
          const door = this.doorPainter.draw()
          if (door) {
            this.wrapElementWithEventHandler(door)
            this.configs.door.count++
          }
          break
        }
        case 'window': {
          const _window = this.windowPainter.draw()
          if (_window) {
            this.wrapElementWithEventHandler(_window)
            this.configs.window.count++
          }
          break
        }
        default:
          break
      }
    },

    onMousemove(event) {
      // Select box
      if (this.mouseDown) {
        const oldX = parseInt(this.selectorBox.data('x'))
        const oldY = parseInt(this.selectorBox.data('y'))
        const newX = event.offsetX
        const newY = event.offsetY
        const width = Math.abs(oldX - newX)
        const height = Math.abs(oldY - newY)
        this.selectorBox.attr({
          x: Math.min(oldX, newX),
          y: Math.min(oldY, newY),
          width,
          height
        })
      }
    },

    onMouseup(event) {
      this.mouseDown = false
      if (event.bypass) {
        return
      }
      this.selectorBox.attr({
        display: 'none'
      })
      const bbox = this.selectorBox.getBBox()
      const selectedElements = []
      this.svg.selectAll('line').forEach((line) => {
        if (isLineSelected(line, bbox)) {
          selectedElements.push(line)
        }
      })
      this.selectControl.select(selectedElements)
    },

    wrapElementWithEventHandler(elem) {
      elem
      .mousedown(this.onElementMousedown)
      .mouseup(this.onElementMouseup)
      .mouseover(this.onElementMouseover)
      .mouseout(this.onElementMouseout)
      .mousemove(this.onElementMousemove)
      .click(this.onElementClick)
    },

    onElementMousedown(event) {
      if (this.mode === 'select') {
        event.bypass = true
      }
    },

    onElementMouseup(event) {
      if (this.mode === 'select') {
        event.bypass = true
      }
    },

    onElementClick(event) {
      if (this.mode === 'select') {
        const elem = this.svg.select(`#${event.target.id}`)
        if (elem.data('locked')) {
          return
        }

        event.bypass = true
        if (elem.data('selecting')) {
          return
        } else {
          this.selectControl.select(elem)
          this.showElementUtils(elem)
        }
      }
    },

    onElementMouseover(event) {
      if (this.mode !== 'window' && this.mode !== 'door') {
        return
      }

      const elem = this.svg.select(`#${event.target.id}`)
      if (elem.data('locked')) {
        return
      }
      if (elem.attr('class') !== 'wall') {
        return
      }

      if (this.mode === 'window') {
        this.windowPainter.hover(event.offsetX, event.offsetY, elem)
      }

      if (this.mode === 'door') {
        this.doorPainter.hover(event.offsetX, event.offsetY, elem)
      }
    },

    onElementMousemove(event) {
      if (this.mode !== 'window' && this.mode !== 'door') {
        return
      }

      const elem = this.svg.select(`#${event.target.id}`)
      if (elem.data('locked')) {
        return
      }
      if (elem.attr('class') !== 'wall') {
        return
      }

      if (this.mode === 'window') {
        this.windowPainter.sync(event.offsetX, event.offsetY, elem)
      }
      if (this.mode === 'door') {
        this.doorPainter.sync(event.offsetX, event.offsetY, elem)
      }
    },

    onElementMouseout(event) {
      if (this.mode !== 'window' && this.mode !== 'door') {
        return
      }

      const elem = this.svg.select(`#${event.target.id}`)
      if (elem.data('locked')) {
        return
      }
      if (elem.attr('class') !== 'wall') {
        return
      }

      if (this.mode === 'window') {
        if (!this.windowPainter.isHovering(elem)) {
          this.windowPainter.cancel()
        }
      }
      if (this.mode === 'door') {
        if (!this.doorPainter.isHovering(elem)) {
          this.doorPainter.cancel()
        }
      }
    },

    onKeydown(event) {
      if (this.mode !== 'select') {
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
        event.preventDefault()
        this.selectControl.selectedElems.forEach((elem) => {
          switch (elem.attr('class')) {
            case 'background':
              this.configs.background.count = 0
              break
            case 'wall':
              this.configs.wall.count--
              break
            case 'window':
              this.configs.window.count--
              break
            case 'door':
              this.configs.door.count--
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

  ready() {
    // Init materializeCss tooltip
    $('.tooltipped').tooltip()

    // Add selector box
    this.selectorBox = this.svg
    .rect(0, 0, 0, 0)
    .attr({
      class: 'selector-box',
      id: 'selector-box',
      stroke: 'red',
      fill: 'transparent',
      strokeDasharray: '5, 5',
      display: 'none'
    })

    // Init selectControl
    this.selectControl = new SelectControl({ svg: this.svg })
    this.selectControl.init()

    // Init wall painter
    this.wallPainter = new ConnectedLinePainter({
      svg: this.svg,
      style: {
        stroke: '#212121',
        strokeWidth: 10,
        strokeLinecap: 'round'
      },
      drawingStyle: {
        stroke: '#616161',
        strokeWidth: 10,
        strokeLinecap: 'round'
      },
      className: 'wall'
    })
    this.wallPainter.init()

    // Init window painter
    this.windowPainter = new HoverControl({
      svg: this.svg,
      style: {
        stroke: '#B3E5FC'
      },
      drawingStyle: {
        stroke: '#81D4FA'
      },
      length: 50,
      className: 'window'
    })

    // Init door painter
    this.doorPainter = new HoverControl({
      svg: this.svg,
      style: {
        stroke: '#C8E6C9'
      },
      drawingStyle: {
        stroke: '#A5D6A7'
      },
      length: 50,
      className: 'door'
    })

    // Init delete event listener
    document.addEventListener('keydown', this.onKeydown)
  },

  beforeDestroy() {
    // Uninit SVG canvas
    this.svg
    .unclick(this.onDrawLine)
    .unmousedown(this.onMousedown)
    .unmousemove(this.onMousemove)
    .unmouseup(this.onMouseup)

    // Uninit WallPainter
    this.wallPainter.uninit()

    // Uninit selectControl
    this.selectControl.uninit()

    document.removeEventListener('keydown', this.onKeydown)
  }
}
</script>

<style lang="stylus">
.fade
  &-transition
    transition all .6s ease
    opacity 1
  &-enter, &-leave
    opacity 0

.slide-bottom-to-top
  &-transition
    transition all .3s ease
    margin-top 0
    opacity 1
  &-enter, &-leave
    margin-top 50px
    opacity 0

.slide-right-to-left
  &-transition
    transition all .3s ease
    margin-left 0
    opacity 1
  &-enter, &-leave
    margin-left 50px
    opacity 0

#blueprint-edit-panel
  &__background-input
    display none
  &__svg__container
    display inline-block
    vertical-align top

.blueprint-edit-panel
  &__main
    position relative
  &__utils
    &__container
      position absolute
      top 0
      left 820px
      text-align center
      vertical-align top
    &__item
      position relative
      margin-top 30px
      &__sub-utils
        position absolute
        top 50%
        left 60px
        transform translateY(-50%)
  &__element-utils
    &__container
      width 800px
    &__item
      display inline-block

.corner-resizer
  &--nw
    cursor nw-resize
  &--ne
    cursor ne-resize
  &--se
    cursor se-resize
  &--sw
    cursor sw-resize

.edge-resizer
  &--n
    cursor n-resize
  &--e
    cursor e-resize
  &--s
    cursor s-resize
  &--w
    cursor w-resize
</style>
