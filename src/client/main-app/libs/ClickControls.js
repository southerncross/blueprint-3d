import Snap from 'Snap'

class ClickControls {
  constructor({ svg }) {
    this.svg = svg
    this.elements = []
    this.resizers = []

    this.__multiClick = this.__multiClick.bind(this)
    this.__singleClick = this.__singleClick.bind(this)
    this.__addElement = this.__addElement.bind(this)
    this.__clearElements = this.__clearElements.bind(this)
    this.__clearResizers = this.__clearResizers.bind(this)
    this.__addResizers = this.__addResizers.bind(this)
    this.__addLineResizers = this.__addLineResizers.bind(this)
    this.__addImageResizers = this.__addImageResizers.bind(this)

    this.__onElementMoveCreator = this.__onElementMoveCreator.bind(this)
    this.__onElementDragStartCreator = this.__onElementDragStartCreator.bind(this)
    this.__onElementDragEndCreator = this.__onElementDragEndCreator.bind(this)
    this.__onResizerDragMoveCreator = this.__onResizerDragMoveCreator.bind(this)
    this.__onResizerDragStartCreator = this.__onResizerDragStartCreator.bind(this)
    this.__onResizerDragEndCreator = this.__onResizerDragEndCreator.bind(this)
    this.__onPositionResizerDragMoveCreator = this.__onPositionResizerDragMoveCreator.bind(this)
    this.__onPositionResizerDragStartCreator = this.__onPositionResizerDragStartCreator.bind(this)
    this.__onPositionResizerDragEndCreator = this.__onPositionResizerDragEndCreator.bind(this)
  }

  reset() {
    this.__clearElements()
    this.__clearResizers()
  }

  click(elem) {
    if (this.multiMode && this.elements.length > 0) {
      this.__multiClick(elem)
    } else {
      this.__singleClick(elem)
    }
  }

  __multiClick(elem) {
  }

  __singleClick(elem) {
    if (this.elements.length > 0) {
      this.reset()
    }

    elem.drag(this.__onElementMoveCreator(), this.__onElementDragStartCreator(), this.__onElementDragEndCreator())
    this.__addResizers(elem)
    this.__addElement(elem)
  }

  __onElementMoveCreator() {
    const that = this
    return function(dx, dy) {
      if (that.multiMode && that.elements.length > 0) {
        // TODO
      } else {
        switch (this.type) {
          case 'line': {
            const { x1, y1, x2, y2 } = this.data('originPosition')
            this.attr({
              x1: x1 + dx,
              y1: y1 + dy,
              x2: x2 + dx,
              y2: y2 + dy
            })
            break
          }
          default:
            this.transform(new Snap.Matrix().translate(dx, dy))
            break
        }
      }
    }
  }

  __onElementDragStartCreator() {
    const that = this
    return function() {
      if (that.multiMode && that.elements.length > 0) {
        // TODO
      } else {
        that.__clearResizers()
        switch (this.type) {
          case 'line': {
            const x1 = parseFloat(this.attr('x1'))
            const y1 = parseFloat(this.attr('y1'))
            const x2 = parseFloat(this.attr('x2'))
            const y2 = parseFloat(this.attr('y2'))
            this.data('originPosition', { x1, y1, x2, y2 })
            break
          }
          default:
            break
        }
      }
    }
  }

  __onElementDragEndCreator() {
    const that = this
    return function() {
      if (!that.multiMode) {
        that.__addResizers(this)
        switch (this.type) {
          case 'line':
            break
          default: {
            const bbox = this.getBBox()
            this.attr({
              x: bbox.x,
              y: bbox.y
            })
            this.transform('')
            break
          }
        }
      }
    }
  }

  __addElement(elem) {
    const backupStyles = {}
    const styleNames = ['color', 'fill', 'stroke']

    styleNames.forEach((style) => {
      if (elem.attr(style)) {
        backupStyles[style] = elem.attr(style)
      }
    })
    elem.data({ backupStyles })

    switch (elem.type) {
      case 'line':
        elem.attr({ stroke: 'red' })
        break
    }
    this.elements.push(elem)
  }

  __clearElements() {
    this.elements.forEach((elem) => {
      elem.undrag()
      elem.attr(elem.data('backupStyles'))
      elem.removeData('backupStyles')
    })
    this.elements = []
  }

  __onResizerDragMoveCreator() {
    return function(dx, dy) {
      const elem = this.data('elem')
      const { x, y, width, height } = elem.data('originPosition')
      const direction = this.data('direction')
      let xRate = 1
      let yRate = 1
      let xCenter = x
      let yCenter = y

      for (const dir of direction) {
        switch (dir) {
          case 'N':
            yRate = 1 - dy / height
            yCenter = y + height
            break
          case 'S':
            yRate = 1 + dy / height
            yCenter = y
            break
          case 'E':
            xRate = 1 + dx / width
            xCenter = x
            break
          case 'W':
            xRate = 1 - dx / width
            xCenter = x + width
            break
        }
      }
      elem.transform(new Snap.Matrix().scale(xRate, yRate, xCenter, yCenter))
    }
  }

  __onResizerDragStartCreator() {
    const that = this
    return function() {
      const elem = this.data('elem')
      that.__clearResizers()
      const bbox = elem.getBBox()
      elem.data('originPosition', {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height
      })
    }
  }

  __onResizerDragEndCreator() {
    const that = this
    return function() {
      if (!that.multiMode) {
        const elem = this.data('elem')
        const bbox = elem.getBBox()
        elem.attr({
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height
        })
        elem.transform('')
        that.__addResizers(elem)
      }
    }
  }

  __onPositionResizerDragMoveCreator() {
    return function(dx, dy) {
      const elem = this.data('elem')
      const { x1, y1, x2, y2 } = elem.data('originPosition')
      const order = this.data('order')
      if (order === 1) {
        elem.attr({ x1: parseFloat(x1) + dx, y1: parseFloat(y1) + dy })
      } else {
        elem.attr({ x2: parseFloat(x2) + dx, y2: parseFloat(y2) + dy })
      }
    }
  }

  __onPositionResizerDragStartCreator() {
    const that = this
    return function() {
      const elem = this.data('elem')
      that.__clearResizers()
      elem.data('originPosition', {
        x1: elem.attr('x1'),
        y1: elem.attr('y1'),
        x2: elem.attr('x2'),
        y2: elem.attr('y2')
      })
    }
  }

  __onPositionResizerDragEndCreator() {
    const that = this
    return function() {
      const elem = this.data('elem')
      that.__addResizers(elem)
    }
  }

  __clearResizers() {
    this.resizers.forEach((resizer) => resizer.remove())
    this.resizers = []
  }

  __addResizers(elem) {
    switch (elem.type) {
      case 'line':
        this.__addLineResizers(elem)
        break
      case 'image':
        this.__addImageResizers(elem)
        break
      default:
        break
    }
  }

  __addLineResizers(elem) {
    const x1 = elem.attr('x1')
    const y1 = elem.attr('y1')
    const x2 = elem.attr('x2')
    const y2 = elem.attr('y2')
    const radius = 7
    const positionResizerStyle = {
      fill: 'red'
    }

    const positionResizers = [
      this.svg.circle(x1, y1, radius).data({ order: 1 }).attr({ class: 'position-resizer' }),
      this.svg.circle(x2, y2, radius).data({ order: 2 }).attr({ class: 'position-resizer' })
    ]

    positionResizers.forEach((resizer) => {
      resizer
      .attr(positionResizerStyle)
      .data('elem', elem)
      .drag(
        this.__onPositionResizerDragMoveCreator(),
        this.__onPositionResizerDragStartCreator(),
        this.__onPositionResizerDragEndCreator()
      )
    })

    this.resizers.push(...positionResizers)
  }

  __addImageResizers(elem) {
    const bbox = elem.getBBox()
    const x1 = bbox.x
    const y1 = bbox.y
    const x2 = bbox.x2
    const y2 = bbox.y2
    const radius = 7
    const edgeResizerStyle = {
      stroke: 'red',
      strokeWidth: 4
    }
    const cornerResizerStyle = {
      fill: 'red'
    }

    const cornerResizers = [
      this.svg.circle(x1, y1, radius).data('direction', 'NW').attr({ class: 'corner-resizer--nw' }),
      this.svg.circle(x2, y1, radius).data('direction', 'NE').attr({ class: 'corner-resizer--ne' }),
      this.svg.circle(x2, y2, radius).data('direction', 'SE').attr({ class: 'corner-resizer--se' }),
      this.svg.circle(x1, y2, radius).data('direction', 'SW').attr({ class: 'corner-resizer--sw' })
    ]

    cornerResizers.forEach((resizer) => {
      resizer
      .attr(cornerResizerStyle)
      .data('elem', elem)
      .drag(
        this.__onResizerDragMoveCreator(),
        this.__onResizerDragStartCreator(),
        this.__onResizerDragEndCreator()
      )
    })
    this.resizers.push(...cornerResizers)

    const edgeResizers = [
      this.svg.line(x1 + radius, y1, x2 - radius, y1).data('direction', 'N').attr({ class: 'edge-resizer--n' }),
      this.svg.line(x2, y1 + radius, x2, y2 - radius).data('direction', 'E').attr({ class: 'edge-resizer--e' }),
      this.svg.line(x2 - radius, y2, x1 + radius, y2).data('direction', 'S').attr({ class: 'edge-resizer--s' }),
      this.svg.line(x1, y2 - radius, x1, y1 - radius).data('direction', 'W').attr({ class: 'edge-resizer--w' })
    ]

    edgeResizers.forEach((resizer) => {
      resizer
      .attr(edgeResizerStyle)
      .data('elem', elem)
      .drag(
        this.__onResizerDragMoveCreator(),
        this.__onResizerDragStartCreator(),
        this.__onResizerDragEndCreator()
      )
    })
    this.resizers.push(...edgeResizers)
  }
}

export default ClickControls
