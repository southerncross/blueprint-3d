<template>
<div>
  <svg-canvas
    class="edit__svg-canvas"
    :svg.once="svg"
    :select-control.once="selectControl">
  </svg-canvas>
  <menu-container
    class="edit__menu-container"
    :mode="mode"
    :svg.once="svg"
    :select-control.once="selectControl"
    :elem-event-control.once="elemEventControl"
    :svg-event-control.once="svgEventControl"
    :wall-painter.once="wallPainter"
    :window-painter.once="windowPainter"
    :door-painter.once="doorPainter"
    :set-mode.once="setMode"
  </menu-container>
  <modifier-container
    class="edit__modifier-container">
  </modifier-container>
</div>
</template>

<script>
import SvgCanvas from './SvgCanvas'
import MenuContainer from './menu/MenuContainer'
import ModifierContainer from './modifier/ModifierContainer'
import SelectControl from '../../../libs/svg/SelectControl'
import EventControl from '../../../libs/svg/EventControl'
import HoverControl from '../../../libs/svg/HoverControl'
import ConnectedLinePainter from '../../../libs/svg/ConnectedLinePainter'

export default {
  name: 'SvgPanel',

  components: {
    SvgCanvas,
    MenuContainer,
    ModifierContainer
  },

  props: {
    svg: Object
  },

  data() {
    return {
      mode: 'select',
      selectControl: new SelectControl({
        svg: this.svg
      }),
      elemEventControl: new EventControl(),
      svgEventControl: new EventControl(),
      wallPainter: new ConnectedLinePainter({
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
      }),
      windowPainter: new HoverControl({
        svg: this.svg,
        style: {
          stroke: '#B3E5FC'
        },
        drawingStyle: {
          stroke: '#81D4FA'
        },
        length: 50,
        className: 'window'
      }),
      doorPainter: new HoverControl({
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
    }
  },

  ready() {
    this.selectControl.init()
    this.wallPainter.init()
    this.svgEventControl.wrap(this.svg)
  },

  beforeDestroy() {
    this.wallPainter.uninit()
    this.selectControl.uninit()
  }
}
</script>

<style lang="stylus">
</style>
