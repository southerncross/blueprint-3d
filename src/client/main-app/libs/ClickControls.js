import Snap from 'Snap'

class ClickControls {
  constructor(svg) {
    this.svg = svg
    this.elements = []
    this.resizers = []

    this.__multiClick = this.__multiClick.bind(this)
    this.__singleClick = this.__singleClick.bind(this)
    this.__onElementMove = this.__onElementMove.bind(this)
    this.__onElementDragStart = this.__onElementDragStart.bind(this)
    this.__onElementDragEnd = this.__onElementDragEnd.bind(this)
    this.__addElement = this.__addElement.bind(this)
    this.__clearElements = this.__clearElements.bind(this)
    this.__clearResizers = this.__clearResizers.bind(this)
    this.__addResizers = this.__addResizers.bind(this)
    this.__addLineResizers = this.__addLineResizers.bind(this)
    this.__addImageResizers = this.__addImageResizers.bind(this)
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
    elem.drag(this.__onElementMove, this.__onElementDragStart, this.__onElementDragEnd)
    this.__addResizers(elem)
    this.__addElement(elem)
  }

  __onElementMove(dx, dy, x, y) {
    const matrix = new Snap.Matrix()
    matrix.translate(dx, dy)
    this.elements.forEach((elem) => elem.transform(matrix))
  }

  __onElementDragStart() {
    this.__clearResizers()
  }

  __onElementDragEnd() {
    if (!this.multiMode) {
      this.__addResizers(this.elements[0])
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
    const radius = 5
    const lineStyle = {
      stroke: 'red',
      strokeWidth: 2
    }
    const circleStyle = {
      fill: 'red'
    }

    const resizerNW = this.svg.circle(x1, y1, radius).data('direction', 'NW').attr(circleStyle)
    const resizerNE = this.svg.circle(x2, y1, radius).data('direction', 'NE').attr(circleStyle)
    const resizerSE = this.svg.circle(x2, y2, radius).data('direction', 'SE').attr(circleStyle)
    const resizerSW = this.svg.circle(x1, y2, radius).data('direction', 'SW').attr(circleStyle)

    this.resizers.push(resizerNW, resizerNE, resizerSE, resizerSW)

    const resizerN = this.svg.line(x1, y1, x2, y1).data('direction', 'N').attr(lineStyle)
    const resizerE = this.svg.line(x2, y1, x2, y2).data('direction', 'E').attr(lineStyle)
    const resizerS = this.svg.line(x2, y2, x1, y2).data('direction', 'S').attr(lineStyle)
    const resizerW = this.svg.line(x1, y2, x1, y1).data('direction', 'S').attr(lineStyle)

    this.resizers.push(resizerN, resizerE, resizerS, resizerW)
  }
}

export default ClickControls
