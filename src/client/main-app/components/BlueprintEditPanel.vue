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
            data-position="top" data-delay="0" data-tooltip="添加背景"
            @click="loadBackgroundImg"
          >
            <i class="icon-image"></i>
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
    </div>
  </div>
  <div>{{'x=' + mousePos.x + ', y=' + mousePos.y}}</div>
  <div class="blueprint-edit-panel__element-utils__container">
    <div v-show="elementUtilsType === 'background'" transition="slide-bottom-to-top">
      <div
        class="blueprint-edit-panel__element-utils__item"
        transition="fade"
      >
        <button
          class="waves-effect waves-teal btn-flat tooltipped"
          data-position="top" data-delay="0" data-tooltip="可见性"
          @click="onBackgroundImgVisibilityChange"
        >
          <i class="{{configs.background.visibility === 'visible' ? 'icon-visibility' : 'icon-visibility_off'}}"></i>
        </button>
      </div>
      <div
        class="blueprint-edit-panel__element-utils__item"
        transition="fade"
      >
        <button
          class="waves-effect waves-teal btn-flat tooltipped"
          data-position="top" data-delay="0" data-tooltip="编辑锁定"
          @click="configs.background.locked = !configs.background.locked"
        >
          <i class="{{configs.background.locked ? 'icon-lock' : 'icon-lock_open'}}"></i>
        </button>
      </div>
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
  </div>
  <input
    id="blueprint-edit-panel__background-input"
    type="file"
    @change="onBackgroundImgChange"
  />
</div>
</template>

<script>
import ClickControls from '../libs/ClickControls'

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
          stroke: '#00bcd4',
          strokeWidth: 5,
          strokeLinecap: 'round'
        }
      },
      elementUtilsType: null,
      mousePos: { x: -1, y: -1 },
      drawingLine: null,
      wallCount: 0,
      clickedElement: null
    }
  },

  methods: {
    changeMode(nextMode) {
      if (nextMode === this.mode) {
        return
      }
      this.mode = nextMode
      console.error('boring')
      this.clickControls.reset()
    },

    showElementUtils(elem) {
      this.elementUtilsType = elem.data('elementType')
    },

    hideElementUtils() {
      this.elementUtilsType = null
    },

    loadBackgroundImg() {
      const input = document.getElementById('blueprint-edit-panel__background-input')
      input.click()
    },

    onBackgroundImgVisibilityChange() {
      const { background } = this.configs
      background.visibility = background.visibility === 'visible' ? 'hidden' : 'visible'
      background.elem.attr({ visibility: background.visibility })
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
      this.mode = 'select'
      this.clickControls.click(background.elem)
    },

    onCanvasClick(event) {
      switch (this.mode) {
        case 'select':
          this.clickControls.reset()
          this.hideElementUtils()
          break
        case 'wall':
          this.onDrawLine(event)
          break
        case 'door':
          break
        case 'window':
          break
        default:
          break
      }
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
    },

    onMousemove(event) {
      const { mousePos, drawingLine } = this
      mousePos.x = event.offsetX
      mousePos.y = event.offsetY
      if (drawingLine) {
        const x1 = Number(drawingLine.attr('x1'))
        const y1 = Number(drawingLine.attr('y1'))
        const deltaX = Math.abs(mousePos.x - x1)
        const deltaY = Math.abs(mousePos.y - y1)
        if (deltaX > deltaY) {
          drawingLine.attr({
            x2: mousePos.x,
            y2: y1
          })
        } else {
          drawingLine.attr({
            x2: x1,
            y2: mousePos.y
          })
        }
      }
    },

    onKeydown(event) {
      // Esc
      if (event.keyCode === 27) {
        if (this.drawingLine) {
          this.drawingLine.remove()
          this.drawingLine = null
        }
      }
    },

    onDrawLine() {
      const { mousePos, svg, drawingLine, configs } = this
      let x1 = mousePos.x
      let y1 = mousePos.y
      let x2 = mousePos.x
      let y2 = mousePos.y

      if (drawingLine) {
        drawingLine.attr({
          stroke: '#006064'
        })
        .click(this.onElementClick)
        x1 = Number(drawingLine.attr('x2'))
        y1 = Number(drawingLine.attr('y2'))
      }

      this.drawingLine = svg.line(x1, y1, x2, y2)
      .attr({
        ...configs.wall,
        'class': 'wall',
        id: `wall-${this.wallCount}`
      })
      this.wallCount++
    }
  },

  ready() {
    $('.tooltipped').tooltip()
    this.clickControls = new ClickControls(this.svg)
    document.getElementById('blueprint-edit-panel__svg__container').appendChild(this.svg.node)
    this.svg.attr({ 'class': 'card blue-grey lighten-5' })
    this.svg.click(this.onCanvasClick)
    this.svg.mousemove(this.onMousemove)
    document.addEventListener('keydown', this.onKeydown)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
    this.svg.unclick(this.onDrawLine)
    this.svg.unmousemove(this.onMousemove)
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
