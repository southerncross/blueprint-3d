import Snap from 'Snap'

class ClickControls {
  constructor(svg) {
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

    elem.data('colorBackup', elem.attr('color'))
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
        this.transform(new Snap.Matrix().translate(dx, dy))
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
      }
    }
  }

  __onElementDragEndCreator() {
    const that = this
    return function() {
      if (!that.multiMode) {
        that.__addResizers(this)
        const bbox = this.getBBox()
        this.attr({
          x: bbox.x,
          y: bbox.y
        })
        this.transform('')
      }
    }
  }

  __addElement(elem) {
    this.elements.push(elem)
  }

  __clearElements() {
    this.elements.forEach((elem) => {
      elem.undrag()
      elem.attr({ color: elem.data('colorBackup') })
      elem.removeData('colorBackup')
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
    const radius = 5

    const resizer1 = this.svg.circle(x1, y1, radius)
    const resizer2 = this.svg.circle(x2, y2, radius)

    this.resizers.push(resizer1, resizer2)
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
      this.svg.line(x1, y1, x2, y1).data('direction', 'N').attr({ class: 'edge-resizer--n' }),
      this.svg.line(x2, y1, x2, y2).data('direction', 'E').attr({ class: 'edge-resizer--e' }),
      this.svg.line(x2, y2, x1, y2).data('direction', 'S').attr({ class: 'edge-resizer--s' }),
      this.svg.line(x1, y2, x1, y1).data('direction', 'W').attr({ class: 'edge-resizer--w' })
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
