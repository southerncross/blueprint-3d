import { makeId } from './utils'

class WallPainter {
  constructor({ svg }) {
    this.mousePos = { x: 0, y: 0 }
    this.drawingLine = null
    this.svg = svg
    this.drawingLineStyle = {
      stroke: '#006064'
    }
    this.lineStyle = {
      stroke: '#00bcd4',
      strokeWidth: 5,
      strokeLinecap: 'round'
    }

    this.init = this.init.bind(this)
    this.uninit = this.uninit.bind(this)
    this.draw = this.draw.bind(this)
    this.cancel = this.cancel.bind(this)

    this.__onMousemove = this.__onMousemove.bind(this)
    this.__onKeydown = this.__onKeydown.bind(this)
  }

  init() {
    this.svg.mousemove(this.__onMousemove)
    document.addEventListener('keydown', this.__onKeydown)
  }

  uninit() {
    document.removeEventListener('keydown', this.__onKeydown)
    this.svg.unmousemove(this.__onMousemove)
  }

  draw() {
    const { mousePos, svg, drawingLine, drawingLineStyle, lineStyle } = this
    let x1 = mousePos.x
    let y1 = mousePos.y
    let x2 = mousePos.x
    let y2 = mousePos.y

    if (drawingLine) {
      drawingLine
      .attr(drawingLineStyle)
      x1 = Number(drawingLine.attr('x2'))
      y1 = Number(drawingLine.attr('y2'))
    }

    this.drawingLine = svg.line(x1, y1, x2, y2)
    .attr(lineStyle)
    .attr({
      class: 'wall',
      id: `wall-${makeId()}`
    })

    return this.drawingLine
  }

  cancel() {
    if (this.drawingLine) {
      this.drawingLine.remove()
      this.drawingLine = null
    }
  }

  __onMousemove(event) {
    const { mousePos, drawingLine } = this
    mousePos.x = event.offsetX
    mousePos.y = event.offsetY
    if (drawingLine) {
      const x1 = parseFloat(drawingLine.attr('x1'))
      const y1 = parseFloat(drawingLine.attr('y1'))
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
  }

  __onKeydown(event) {
    // Esc
    if (event.keyCode === 27) {
      this.cancel()
    }
  }
}

export default WallPainter
