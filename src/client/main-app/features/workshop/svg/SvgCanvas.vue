<template>
<div>
  <div id="svg-canvas"></div>
  <canvas id="svg-canvas__background"></canvas>
</div>
</template>

<script>
function drawGrids(canvasDom) {
  const width = window.innerWidth
  const height = window.innerHeight
  const ctx = canvasDom.getContext('2d')
  canvasDom.width = width
  canvasDom.height = height

  ctx.lineWidth = '0.5'
  ctx.strokeStyle = '#eceff1'
  ctx.setLineDash([3, 3])
  for (let x = 0; x < width; x += 50) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y < height; y += 50) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

export default {
  name: 'SvgCanvas',

  props: {
    svg: {
      type: Object
    }
  },

  ready() {
    drawGrids(document.getElementById('svg-canvas__background'))

    document.getElementById('svg-canvas').appendChild(this.svg.node)
  }
}
</script>

<style lang="stylus">
$svg-canvas
  position fixed
  top 0
  right 0
  bottom 0
  left 0

#svg-canvas
  @extends $svg-canvas
  z-index -10
  background-color transparent
  &__background
    @extends $svg-canvas
    z-index -20

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
