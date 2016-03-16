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
  <div>
    {{'x=' + mousePos.x + ', y=' + mousePos.y}}
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
      backgroundUrl: '',
      background: null,
      mousePos: { x: -1, y: -1 },
      drawingLine: null
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

      const oldBackground = this.svg.select('#blueprint-background')
      if (oldBackground) {
        oldBackground.remove()
      }

      const url = window.URL.createObjectURL(file)
      const desc = this.svg.select('desc')
      const newBackground = this.svg.image(url).attr({
        id: 'blueprint-background',
        opacity: 0.3
      })
      desc.after(newBackground)
    },

    onClick(event) {
      switch (this.mode) {
        case 'select':
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
        x1 = Number(drawingLine.attr('x2'))
        y1 = Number(drawingLine.attr('y2'))
      }

      this.drawingLine = svg.line(x1, y1, x2, y2)
      .attr({
        stroke: '#00bcd4',
        strokeWidth: 5,
        'class': 'wall'
      })
    }
  },

  ready() {
    document.getElementById('blueprint-edit-panel__svg__container').appendChild(this.svg.node)
    this.svg.attr({ 'class': 'card' })
    this.svg.click(this.onClick)
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
</style>
