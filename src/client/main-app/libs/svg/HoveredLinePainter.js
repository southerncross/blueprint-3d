import { makeId } from '../utils'

function constrain(a, a1, a2) {
  const minA = Math.min(a1, a2)
  const maxA = Math.max(a1, a2)
  a = Math.max(a, minA)
  a = Math.min(a, maxA)
  return a
}

class HoveredLinePainter {
  constructor({ svg, style, drawingStyle, className }) {
    this.drawingLine = null
    this.hoverElemId = null
    this.svg = svg
    this.drawingLineStyle = drawingStyle
    this.lineStyle = style
    this.className = className

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

  /**
   * Draw a line on another line(hovered line).
   *
   * @param  {String} hoverElemId Id of the hovered line.
   * @param  {Number} x X offset of mouse position.
   * @param  {Number} y Y offset of mouse position.
   * @return {Snap object} Element if drawing is finished, otherwise null.
   */
  draw(hoverElemId, x, y) {
    const { svg, drawingLine, drawingLineStyle, lineStyle } = this

    if (drawingLine) {
      // Finish drawing.
      const line = drawingLine
      .attr(lineStyle)
      .attr({
        x2: x,
        y2: y
      })
      .data('hoverElemId', hoverElemId)
      this.drawingLine = null
      const hoveredLineIds = this.hoverElem.data('hoveredLineIds') || []
      hoveredLineIds.push(line.attr('id'))
      this.hoverElem.data('hoveredLineIds', hoveredLineIds)
      this.hoverElem = null
      return line
    } else {
      // Start drawing.
      const hoverElem = svg.select(`#${hoverElemId}`)
      const strokeWidth = hoverElem.attr('strokeWidth')
      this.drawingLine = svg.line(x, y, x, y)
      .attr(drawingLineStyle)
      .attr({
        class: this.className,
        id: `${this.className}-${makeId()}`,
        strokeWidth
      })
      this.hoverElem = hoverElem
      return null
    }
  }

  cancel() {
    if (this.drawingLine) {
      this.drawingLine.remove()
      this.drawingLine = null
    }
  }

  get isDrawing() {
    return !!this.drawingLine
  }

  __onMousemove(event) {
    const { drawingLine } = this
    if (!drawingLine) {
      return
    }

    // hover element and its position, 2 possible scenarios:
    //
    // I:
    // (bx1 | hx1, by1 | hy1)
    //        o-----+
    //        |\    |   (mx, my)
    //        | \   |     o
    //        |  \  |
    //        |   \ |
    //        |    \|
    //        +-----o
    //    (bx2 | hx2, by2 | hy2)
    //
    // II:
    // (bx1, by1) (hx1, hy1)
    //        o-----o
    //        |    /|   (mx, my)
    //        |   / |     o
    //        |  /  |
    //        | /   |
    //        |/    |
    //        o-----o
    // (hx2, hy2) (hx2, hy2)
    const hoverElem = this.hoverElem
    const bbox = hoverElem.getBBox()
    const bx1 = bbox.x
    const by1 = bbox.y
    const bx2 = bbox.x2
    const by2 = bbox.y2
    const hx1 = Number(hoverElem.attr('x1'))
    const hy1 = Number(hoverElem.attr('y1'))
    const hx2 = Number(hoverElem.attr('x2'))
    const hy2 = Number(hoverElem.attr('y2'))
    // mouse position
    const mx = event.offsetX
    const my = event.offsetY
    // target position
    // (sx, sy)
    //    o
    //     \
    //      \
    //       \
    //        o
    //     (tx, ty)
    const sx = Number(drawingLine.attr('x1'))
    const sy = Number(drawingLine.attr('x1'))
    let tx = mx
    let ty = my

    if (bx1 === bx2) {
      // vertical line, use y and keep x
      ty = my
      tx = sx
    } else if (by1 === by2) {
      // horizontal line, use x and keep y
      tx = mx
      ty = sy
    } else {
      // normal line
      const k = Math.abs((hy2 - hy1) / (hx2 - hx1))
      const dir = { x: mx - sx, y: my - sy }
      if (k >= 1) {
        // steep line, use y and adjust x
        const deltaY = Math.abs(my - sy)
        ty = sy + (dir.y > 0 ? 1 : -1) * deltaY
        tx = sx + (dir.x > 0 ? 1 : -1) * deltaY / k
      } else {
        // relaxed line, use x and adjust y
        const deltaX = Math.abs(mx - sx)
        tx = sx + (dir.x > 0 ? 1 : -1) * deltaX
        ty = sy + (dir.y > 0 ? 1 : -1) * deltaX * k
      }
    }

    tx = constrain(tx, hx1, hx2)
    ty = constrain(ty, hx1, hy2)

    drawingLine.attr({
      x2: tx,
      y2: ty
    })
  }

  __onKeydown(event) {
    // Esc
    if (event.keyCode === 27) {
      this.cancel()
    }
  }
}

export default HoveredLinePainter
