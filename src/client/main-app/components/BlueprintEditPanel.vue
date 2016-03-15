<template>
<div class="blueprint-edit-panel__container">
  <div id="blueprint-edit-panel__svg-container">
    <div>
      {{'x=' + mousePos.x + ', y=' + mousePos.y}}
    </div>
  </div>
  <div class="fixed-action-btn vertical click-to-toggle">
    <a class="btn-floating btn-large cyan">
      <i class="large mdi-navigation-menu"></i>
    </a>
    <ul>
      <li>
        <div
          class="btn-floating red tooltipped"
          data-position="left"
          data-delay="50"
          data-tooltip="背景"
          @click="loadBackgroundImg"
        >
          <i class="icon-now_wallpaper"></i>
        </div>
      </li>
      <li>
        <div class="btn-floating yellow darken-1 tooltipped" data-position="left" data-delay="50" data-tooltip="墙">
          <i class="icon-border_style"></i>
        </div>
      </li>
      <li>
        <div class="btn-floating green tooltipped" data-position="left" data-delay="50" data-tooltip="门">
          <i class="icon-directions_walk"></i>
        </div>
      </li>
      <li>
        <div class="btn-floating blue tooltipped" data-position="left" data-delay="50" data-tooltip="窗户">
          <i class="icon-wb_sunny"></i>
        </div>
      </li>
    </ul>
  </div>
  <input
    class="hidden"
    id="blueprint-edit-panel__background-input"
    type="file"
    @change="onBackgroundImgChange"
  />
</div>
</template>

<script>
const DEFAULT_SIZE = 600

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
      backgroundUrl: '',
      background: null,
      mousePos: { x: -1, y: -1 },
      drawingLine: null
    }
  },

  methods: {
    loadBackgroundImg() {
      const input = document.getElementById('blueprint-edit-panel__background-input')
      input.click()
    },

    onBackgroundImgChange(event) {
      const that = this
      const file = event.target.files[0]
      const url = window.URL.createObjectURL(file)
      this.svg.image(url).attr({
        id: 'blueprint-background',
        opacity: 0.3
      })
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
    document.getElementById('blueprint-edit-panel__svg-container').appendChild(this.svg.node)
    this.svg.click(this.onDrawLine)
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
svg
  display block
  margin 0 auto
  border 1px solid grey
  box-sizing border-box

.hidden
  display none

.blueprint-edit-panel
  &__container
    position relative
</style>
