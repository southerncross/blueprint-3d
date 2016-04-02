<template>
<div>
  <svg-canvas
    class="edit__svg-canvas"
    :svg="svg"
    :select-control="selectControl">
  </svg-canvas>
  <menu-container
    class="edit__menu-container"
    :mode="mode"
    :svg.once="svg"
    :select-control="selectControl"
    :elem-event-control="elemEventControl"
    :svg-event-control="svgEventControl"
    :set-mode.once="setMode"
    :wrap-element-with-event-handler.once="wrapElementWithEventHandler">
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
  }
}
</script>

<style lang="stylus">
</style>
