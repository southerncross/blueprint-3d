<template>
<div class="blueprint-edit-panel__container">
  <div class="blueprint-edit-panel__main">
    <div id="blueprint-edit-panel__svg__container"></div>
    <div class="blueprint-edit-panel__utils__container">
      <div class="blueprint-edit-panel__utils__item">
        <button
          class="btn-floating btn-large waves-effect waves-light tooltipped"
          data-position="left" data-delay="0" data-tooltip="选择模式"
          :class="mode === 'select' ? 'purple' : 'white'"
          @click="mode = 'select'"
        >
          <i class="icon-call_made" :class="mode === 'select' ? 'white-text' : 'black-text'"></i>
        </button>
        <div
          v-show="mode === 'select'"
          class="blueprint-edit-panel__utils__item__sub-utils"
          transition="slide-right-to-left"
        >
          <button
            v-show="configs.wall.elems.length > 0"
            class="waves-effect waves-teal btn-flat tooltipped"
            data-position="right" data-delay="0" data-tooltip="选中所有墙面"
            @click="onSelectAllWalls"
          >
            <i class="icon-apps white-text yellow darken-2"></i>
          </button>
          <button
            v-show="configs.background.elem"
            class="waves-effect waves-teal btn-flat tooltipped"
            data-position="right" data-delay="0" data-tooltip="选中背景图"
            @click="onSelectBackgroundImg"
          >
            <i class="icon-apps white-text red"></i>
          </button>
        </div>
      </div>
      <div class="blueprint-edit-panel__utils__item">
        <button
          class="btn-floating btn-large waves-effect waves-light tooltipped"
          data-position="left" data-delay="0" data-tooltip="画墙模式"
          :class="mode === 'wall' ? 'yellow darken-2' : 'white'"
          @click="changeMode('wall')"
        >
          <i class="icon-border_style" :class="mode === 'wall' ? 'white-text' : 'black-text'"></i>
        </button>
        <div
          v-show="mode === 'wall'"
          class="blueprint-edit-panel__utils__item__sub-utils"
          transition="slide-right-to-left"
        >
          <button
            v-show="configs.wall.elems.length > 0"
            class="waves-effect waves-teal btn-flat tooltipped"
            data-position="right" data-delay="0" data-tooltip="锁定"
            @click="onToggleWallLockStatus"
          >
            <i class="{{ configs.wall.locked ? 'icon-lock' : 'icon-lock_open' }}"></i>
          </button>
          <button
            v-show="configs.wall.elems.length > 0"
            class="waves-effect waves-teal btn-flat tooltipped"
            data-position="right" data-delay="0" data-tooltip="可见性"
            @click="onToggleWallVisibility"
          >
            <i class="{{ configs.wall.visibility === 'visible' ? 'icon-visibility' : 'icon-visibility_off' }}"></i>
          </button>
        </div>
      </div>
      <div class="blueprint-edit-panel__utils__item">
        <button
          class="btn-floating btn-large waves-effect waves-light tooltipped"
          data-position="left" data-delay="0" data-tooltip="画门模式"
          :class="mode === 'door' ? 'green' : 'white'"
          @click="changeMode('door')"
        >
          <i class="icon-directions_run" :class="mode === 'door' ? 'white-text' : 'black-text'"></i>
        </button>
      </div>
      <div class="blueprint-edit-panel__utils__item">
        <button
          class="btn-floating btn-large waves-effect waves-light tooltipped"
          data-position="left" data-delay="0" data-tooltip="画窗模式"
          :class="mode === 'window' ? 'blue' : 'white'"
          @click="changeMode('window')"
        >
          <i class="icon-wb_sunny" :class="mode === 'window' ? 'white-text' : 'black-text'"></i>
        </button>
      </div>
      <div class="blueprint-edit-panel__utils__item">
        <button
          class="btn-floating btn-large waves-effect waves-light tooltipped"
          data-position="left" data-delay="0" data-tooltip="背景"
          :class="mode === 'background' ? 'red' : 'white'"
          @click="changeMode('background')"
        >
          <i class="icon-now_wallpaper" :class="mode === 'background' ? 'white-text' : 'black-text'"></i>
        </button>
        <div
          v-show="mode === 'background'"
          class="blueprint-edit-panel__utils__item__sub-utils"
          transition="slide-right-to-left"
        >
          <button
            class="waves-effect waves-teal btn-flat tooltipped"
            data-position="right" data-delay="0" data-tooltip="添加背景"
            @click="loadBackgroundImg"
          >
            <i class="icon-image"></i>
          </button>
          <button
            v-show="configs.background.elem"
            class="waves-effect waves-teal btn-flat tooltipped"
            data-position="right" data-delay="0" data-tooltip="锁定"
            @click="onToggleBackgroundImgLockStatus"
          >
            <i class="{{ configs.background.locked ? 'icon-lock' : 'icon-lock_open' }}"></i>
          </button>
          <button
            v-show="configs.background.elem"
            class="waves-effect waves-teal btn-flat tooltipped"
            data-position="right" data-delay="0" data-tooltip="可见性"
            @click="onToggleBackgroundImgVisibility"
          >
            <i class="{{ configs.background.visibility === 'visible' ? 'icon-visibility' : 'icon-visibility_off' }}"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="blueprint-edit-panel__element-utils__container">
    <div v-show="elementUtilsType === 'background'" transition="slide-bottom-to-top">
      <div
        class="blueprint-edit-panel__element-utils__item"
        transition="fade"
      >
        <span class="range-field">
          <input
            id="blueprint-edit-panel__background__opacity"
            type="range"
            min="0" max="100"
            v-model="configs.background.opacity"
            @input="onBackgroundImgOpacityChange"
          />
        </span>
      </div>
    </div>
    <div v-show="elementUtilsType === 'line'" transition="slide-bottom-to-top">
      <div
        class="blueprint-edit-panel__element-utils__item"
        transition="fade"
      >
      </div>
    </div>
  </div>
  <input
    id="blueprint-edit-panel__background-input"
    type="file"
    @change="onBackgroundImgChange"
  />
</div>
</template>

<script>
import $ from 'jquery'

import ClickControls from '../libs/ClickControls'
import WallPainter from '../libs/WallPainter'

export default {
  name: 'BlueprintEditPanel',

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
          elem: null,
          visibility: 'visible',
          locked: false,
          opacity: 30
        },
        wall: {
          elems: [],
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
    changeMode(nextMode) {
      if (nextMode === this.mode) {
        return
      }
      this.mode = nextMode
      this.elementUtilsType = null
      this.clickControls.reset()
      this.wallPainter.cancel()
    },

    showElementUtils(elem) {
      this.elementUtilsType = elem.data('elementType')
    },

    hideElementUtils() {
      this.elementUtilsType = null
    },

    onSelectBackgroundImg() {
      const image = this.svg.select('image')
      this.clickControls.click(image)
    },

    loadBackgroundImg() {
      const input = document.getElementById('blueprint-edit-panel__background-input')
      input.click()
    },

    onToggleBackgroundImgVisibility() {
      const { background } = this.configs
      background.visibility = (background.visibility === 'visible') ? 'hidden' : 'visible'
      background.elem.attr({ visibility: background.visibility })
    },

    onToggleBackgroundImgLockStatus() {
      const { background } = this.configs
      background.locked = !background.locked
      background.elem.data({ 'locked': background.locked })
    },

    onBackgroundImgOpacityChange(event) {
      const { background } = this.configs
      background.elem.attr({ opacity: parseFloat(event.target.value) / 100 })
    },

    onBackgroundImgChange(event) {
      const file = event.target.files[0]
      if (!file) {
        return
      }

      const { background } = this.configs
      if (background.elem) {
        background.elem.remove()
      }

      const url = window.URL.createObjectURL(file)
      const desc = this.svg.select('desc')
      background.elem = this.svg.image(url)
      .attr({
        id: 'blueprint-background',
        opacity: parseFloat(background.opacity) / 100
      })
      .data({ elementType: 'background' })
      .click(this.onElementClick)

      desc.after(background.elem)

      this.changeMode('select')
    },

    onSelectAllWalls() {
      const walls = this.svg.selectAll('.wall')
      this.clickControls.click(walls)
    },

    onToggleWallVisibility() {
      const { wall } = this.configs
      wall.visibility = (wall.visibility === 'visible') ? 'hidden' : 'visible'
      wall.elems.forEach((elem) => {
        elem.attr({ visibility: wall.visibility })
      })
    },

    onToggleWallLockStatus() {
      const { wall } = this.configs
      wall.locked = !wall.locked
      wall.elems.forEach((elem) => {
        elem.data({ 'locked': wall.locked })
      })
    },

    onMousedown(event) {
      switch (this.mode) {
        case 'select': {
          this.clickControls.reset()
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
          const wall = this.wallPainter.draw().click(this.onElementClick)
          this.configs.wall.elems.push(wall)
          break
        }
        case 'door':
          break
        case 'window':
          break
        default:
          break
      }
    },

    onMousemove(event) {
      if (!this.mouseDown) {
        return
      }
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
    },

    onMouseup(event) {
      this.mouseDown = false
      this.selectorBox.attr({
        display: 'none'
      })
    },

    onElementClick(event) {
      if (this.mode !== 'select') {
        return
      }

      const elem = this.svg.select(`#${event.target.id}`)
      if (elem.data('locked')) {
        return
      }

      event.stopPropagation()
      this.clickControls.click(elem)
      this.showElementUtils(elem)
    }
  },

  ready() {
    // Init materializeCss tooltip
    $('.tooltipped').tooltip()

    // Init SVG canvas
    this.svg
    .attr({ 'class': 'card blue-grey lighten-5' })
    .mousedown(this.onMousedown)
    .mousemove(this.onMousemove)
    .mouseup(this.onMouseup)
    document.getElementById('blueprint-edit-panel__svg__container').appendChild(this.svg.node)

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

    // Init ClickControls
    this.clickControls = new ClickControls({ svg: this.svg })
    this.clickControls.init()

    // Init WallPainter
    this.wallPainter = new WallPainter({ svg: this.svg })
    this.wallPainter.init()
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

    // Uninit ClickControls
    this.clickControls.uninit()
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
  &__container
    width 900px
    margin auto
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
