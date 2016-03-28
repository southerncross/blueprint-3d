import { makeId } from '../utils'

class HoverControl {
  constructor({ svg, length, drawingStyle, style, className }) {
    this.svg = svg
    this.length = length
    this.drawingStyle = drawingStyle
    this.style = style
    this.className = className
    this.hoverElem = null

    this.hover = this.hover.bind(this)
    this.sync = this.sync.bind(this)
    this.isHovering = this.isHovering.bind(this)
    this.draw = this.draw.bind(this)
    this.cancel = this.cancel.bind(this)

    this.__onHoverElemMousemoveCreator = this.__onHoverElemMousemoveCreator.bind(this)
    this.__onHoverElemMouseoutCreator = this.__onHoverElemMouseoutCreator.bind(this)
  }

  hover(x, y, elem) {
    if (elem.attr('class') !== 'wall') {
      return
    }

    this.cancel()

    // TODO fix the bug that bbox may not reflect true line
    const strokeWidth = elem.attr('strokeWidth')
    const bbox = elem.getBBox()
    const x1 = Number(bbox.x)
    const y1 = Number(bbox.y)
    const x2 = Number(bbox.x2)
    const y2 = Number(bbox.y2)
    let hx1 = 0
    let hy1 = 0
    let hx2 = 0
    let hy2 = 0

    if (x1 === x2) {
      hx1 = x1
      hx2 = x2
      hy1 = Math.max(y1, y - this.length / 2)
      hy2 = Math.min(y2, y + this.length / 2)
    } else if (y1 === y2) {
      hx1 = Math.max(x1, x - this.length / 2)
      hx2 = Math.min(x2, x + this.length / 2)
      hy1 = y1
      hy2 = y2
    } else {
      const k = (y1 - y2) / (x1 - x2)
      const b = y1 - k * x1
      const theta = Math.atan(k)
      if (Math.abs(k) < 1) {
        hx1 = Math.max(x1, x - this.length / 2 * Math.cos(theta))
        hx2 = Math.min(x2, x + this.length / 2 * Math.cos(theta))
        hy1 = Math.max(y1, k * x + b - this.length / 2 * Math.sin(theta))
        hy2 = Math.min(y2, k * x + b + this.length / 2 * Math.sin(theta))
      } else {
        hx1 = Math.max(x1, (y - b) / k - this.length / 2 * Math.cos(theta))
        hx2 = Math.min(x2, (y - b) / k + this.length / 2 * Math.cos(theta))
        hy1 = Math.max(y1, y - this.length / 2 * Math.sin(theta))
        hy2 = Math.min(y2, y + this.length / 2 * Math.sin(theta))
      }
    }

    this.hoverElem = this.svg.line(hx1, hy1, hx2, hy2)
    .attr(this.drawingStyle)
    .attr({ strokeWidth })
    .data('ownerId', elem.attr('id'))
    .mousemove(this.__onHoverElemMousemoveCreator())
    .mouseout(this.__onHoverElemMouseoutCreator())
  }

  sync(x, y, ownerElem) {
    if (!this.hoverElem) {
      return
    }

    const bbox = ownerElem.getBBox()
    const x1 = Number(bbox.x)
    const y1 = Number(bbox.y)
    const x2 = Number(bbox.x2)
    const y2 = Number(bbox.y2)
    let nx1 = 0
    let nx2 = 0
    let ny1 = 0
    let ny2 = 0

    if (x1 === x2) {
      nx1 = x1
      nx2 = x2
      ny1 = Math.max(y - this.length / 2, y1)
      ny2 = Math.min(y + this.length / 2, y2)
    } else if (y1 === y2) {
      nx1 = Math.max(x - this.length / 2, x1)
      nx2 = Math.min(x + this.length / 2, x2)
      ny1 = y1
      ny2 = y2
    } else {
      const k = (y1 - y2) / (x1 - x2)
      const b = y1 - k * x1
      const theta = Math.atan(k)
      if (Math.abs(k) < 1) {
        nx1 = Math.max(x1, x - this.length / 2 * Math.cos(theta))
        nx2 = Math.min(x2, x + this.length / 2 * Math.cos(theta))
        ny1 = Math.max(y1, k * x + b - this.length / 2 * Math.sin(theta))
        ny2 = Math.min(y2, k * x + b + this.length / 2 * Math.sin(theta))
      } else {
        nx1 = Math.max(x1, (y - b) / k - this.length / 2 * Math.cos(theta))
        nx2 = Math.min(x2, (y - b) / k + this.length / 2 * Math.cos(theta))
        ny1 = Math.max(y1, y - this.length / 2 * Math.sin(theta))
        ny2 = Math.min(y2, y + this.length / 2 * Math.sin(theta))
      }
    }

    this.hoverElem.attr({
      x1: nx1,
      y1: ny1,
      x2: nx2,
      y2: ny2
    })
  }

  isHovering(elem) {
    return this.hoverElem && this.hoverElem.data('ownerId') === elem.attr('id')
  }

  draw() {
    const elem = this.hoverElem
    this.hoverElem = null
    // Copy a new element, because we have to clean up mouse event handler
    let copiedElem = null
    if (elem) {
      copiedElem = this.svg.line(
        elem.attr('x1'),
        elem.attr('y1'),
        elem.attr('x2'),
        elem.attr('y2')
      )
      .attr(Object.assign({}, this.drawingStyle, this.style))
      .attr({
        strokeWidth: elem.attr('strokeWidth'),
        class: this.className,
        id: `${this.className}-${makeId()}`
      })
      elem.remove()
    }
    return copiedElem
  }

  cancel() {
    if (this.hoverElem) {
      this.hoverElem.remove()
    }
    this.hoverElem = null
  }

  __onHoverElemMousemoveCreator() {
    const that = this
    return function(event) {
      // Old coordination
      const bbox = that.svg.select(`#${this.data('ownerId')}`).getBBox()
      const ox1 = Number(bbox.x)
      const oy1 = Number(bbox.y)
      const ox2 = Number(bbox.x2)
      const oy2 = Number(bbox.y2)
      // hover element coordination
      const x1 = Number(this.attr('x1'))
      const y1 = Number(this.attr('y1'))
      const x2 = Number(this.attr('x2'))
      const y2 = Number(this.attr('y2'))
      // next coordination of hover element
      let nx1 = 0
      let ny1 = 0
      let nx2 = 0
      let ny2 = 0

      if (x1 === x2) {
        nx1 = ox1
        nx2 = ox2
        ny1 = Math.max(y1 + event.movementY, oy1)
        ny2 = Math.min(y2 + event.movementY, oy2)
      } else if (y1 === y2) {
        nx1 = Math.max(x1 + event.movementX, ox1)
        nx2 = Math.min(x2 + event.movementX, ox2)
        ny1 = oy1
        ny2 = oy2
      } else {
        const k = (oy1 - oy2) / (ox1 - ox2)
        if (Math.abs(k) < 1) {
          nx1 = Math.max(x1 + event.movementX, ox1)
          nx2 = Math.min(x2 + event.movementX, ox2)
          ny1 = Math.max(y1 + event.movementX * k, oy1)
          ny2 = Math.min(y2 + event.movementX * k, oy2)
        } else {
          nx1 = Math.max(x1 + event.movementY / k, ox1)
          nx2 = Math.max(x2 + event.movementY / k, ox2)
          ny1 = Math.max(y1 + event.movementY, oy1)
          ny2 = Math.min(y2 + event.movementY, oy2)
        }
      }

      this.attr({
        x1: nx1,
        y1: ny1,
        x2: nx2,
        y2: ny2
      })
    }
  }

  __onHoverElemMouseoutCreator() {
    const that = this
    return function(event) {
      this.remove()
      that.hoverElem = null
    }
  }
}

export default HoverControl
