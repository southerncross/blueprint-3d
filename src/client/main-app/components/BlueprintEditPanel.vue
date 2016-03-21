<template>
<div class="blueprint-edit-panel__container">
  <div>
    <div id="blueprint-edit-panel__svg__container"></div>
    <div class="blueprint-edit-panel__utils__container">
      <div class="blueprint-edit-panel__utils__item">
        <button
          class="btn-floating btn-large waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="选择模式"
          :class="mode === 'select' ? 'purple' : 'white'"
          @click="mode = 'select'"
        >
          <i class="icon-call_made" :class="mode === 'select' ? 'white-text' : 'black-text'"></i>
        </button>
      </div>
      <div class="blueprint-edit-panel__utils__item">
        <button
          class="btn-floating btn-large waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="画墙模式"
          :class="mode === 'wall' ? 'yellow darken-2' : 'white'"
          @click="mode = 'wall'"
        >
          <i class="icon-border_style" :class="mode === 'wall' ? 'white-text' : 'black-text'"></i>
        </button>
      </div>
      <div class="blueprint-edit-panel__utils__item">
        <button
          class="btn-floating btn-large waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="画门模式"
          :class="mode === 'door' ? 'green' : 'white'"
          @click="mode = 'door'"
        >
          <i class="icon-directions_run" :class="mode === 'door' ? 'white-text' : 'black-text'"></i>
        </button>
      </div>
      <div class="blueprint-edit-panel__utils__item">
        <button
          class="btn-floating btn-large waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="画窗模式"
          :class="mode === 'window' ? 'blue' : 'white'"
          @click="mode = 'window'"
        >
          <i class="icon-wb_sunny" :class="mode === 'window' ? 'white-text' : 'black-text'"></i>
        </button>
      </div>
    </div>
  </div>
  <div>{{'x=' + mousePos.x + ', y=' + mousePos.y}}</div>
  <div>
    <button
      class="btn-large waves-effect waves-light red tooltipped"
      data-position="right" data-delay="0" data-tooltip="加载背景"
      @click="loadBackgroundImg"
    >
      <i class="icon-now_wallpaper"></i>
    </button>
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

  clickControls: null,

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
      background: null,
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
    },

    loadBackgroundImg() {
      const input = document.getElementById('blueprint-edit-panel__background-input')
      input.click()
    },

    onBackgroundImgChange(event) {
      const file = event.target.files[0]
      if (!file) {
        return
      }

      if (this.background) {
        this.background.remove()
      }

      const url = window.URL.createObjectURL(file)
      const desc = this.svg.select('desc')
      this.background = this.svg.image(url)
      .attr({
        id: 'blueprint-background',
        opacity: 0.3
      })
      .click(this.onElementClick)
      // .drag(function(dx, dy, x, y) { console.error('boring', dx, dy, x, y, JSON.parse(JSON.stringify(this))) })
      // .click(this.onBackgroundClick)
      desc.after(this.background)
    },

    onCanvasClick(event) {
      switch (this.mode) {
        case 'select':
          if (this.background) {
            // this.background.drag()
            this.background.attr({ selected: false })
          }
          break
        case 'wall':
          this.onDrawLine(event)
          if (this.background) {
            // this.background.undrag()
          }
          break
        case 'door':
          if (this.background) {
            // this.background.undrag()
          }
          break
        case 'window':
          if (this.background) {
            // this.background.undrag()
          }
          break
        default:
          break
      }
    },

    onElementClick(event) {
      if (this.mode === 'select') {
        this.clickControls.click(this.svg.select(`#${event.target.id}`))
      }
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
      const { mousePos, svg, drawingLine } = this
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
        stroke: '#00bcd4',
        strokeWidth: 5,
        strokeLinecap: 'round',
        'class': 'wall',
        id: `wall-${this.wallCount}`
      })
      this.wallCount++
    }
  },

  ready() {
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
  &__utils
    &__container
      display inline-block
      width 80px
      height 90%
      text-align center
      vertical-align top
    &__item
      margin-top 30px

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
