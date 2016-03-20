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
    this.__onEdgeResizerDragMoveCreator = this.__onEdgeResizerDragMoveCreator.bind(this)
    this.__onEdgeResizerDragStartCreator = this.__onEdgeResizerDragStartCreator.bind(this)
    this.__onEdgeResizerDragEndCreator = this.__onEdgeResizerDragEndCreator.bind(this)
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
    elem.data('matrix', elem.transform().localMatrix.clone())
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
        const matrix = this.data('matrix').clone()
        matrix.add(new Snap.Matrix().translate(dx, dy))
        this.transform(matrix)
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
        // this.data('matrix', this.transform().localMatrix)
      }
    }
  }

  __onElementDragEndCreator() {
    const that = this
    return function() {
      if (!that.multiMode) {
        that.__addResizers(this)
        this.data('matrix', this.transform().localMatrix.clone())
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

  __onCornerResizerDragStartCreator() {
  }

  __onCornerResizerDragMoveCreator() {
  }

  __onCornerResizerDragEndCreator() {
  }

  __onEdgeResizerDragMoveCreator() {
    return function(dx, dy) {
      const elem = this.data('element')
      let xr = 0
      let yr = 0
      // console.error('boring', bbox.x, bbox.y)
      switch (this.data('direction')) {
        case 'N':
          xr = 1
          yr = 1 + dy / 100
          break
        case 'E':
          xr = 1 + dx / 100
          yr = 1
          break
        case 'S':
          xr = 1
          yr = 1 + dy / 100
          break
        case 'W':
          xr = 1 + dx / 100
          yr = 1
          break
        default:
          console.warn('Unknown resizer direction: ', this.data('direction'))
          break
      }
      const matrix = elem.data('matrix').clone()
      matrix.add(new Snap.Matrix().scale(xr, yr))
      elem.transform(matrix)
    }
  }

  __onEdgeResizerDragStartCreator() {
    const that = this
    return function() {
      that.__clearResizers()
    }
  }

  __onEdgeResizerDragEndCreator() {
    const that = this
    return function() {
      if (!that.multiMode) {
        const elem = this.data('element')
        this.data('matrix', elem.transform().localMatrix.clone())
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
    const radius = 5
    const edgeResizerStyle = {
      stroke: 'red',
      strokeWidth: 2
    }
    const cornerResizerStyle = {
      fill: 'red'
    }

    const cornerResizers = [
      this.svg.circle(x1, y1, radius).data('direction', 'NW').attr(cornerResizerStyle).attr({ class: 'corner-resizer--nw' }),
      this.svg.circle(x2, y1, radius).data('direction', 'NE').attr(cornerResizerStyle).attr({ class: 'corner-resizer--ne' }),
      this.svg.circle(x2, y2, radius).data('direction', 'SE').attr(cornerResizerStyle).attr({ class: 'corner-resizer--se' }),
      this.svg.circle(x1, y2, radius).data('direction', 'SW').attr(cornerResizerStyle).attr({ class: 'corner-resizer--sw' })
    ]

    cornerResizers.forEach((resizer) => {
      resizer.data('element', elem)
    })

    this.resizers.push(...cornerResizers)

    const edgeResizers = [
      this.svg.line(x1, y1, x2, y1).data('direction', 'N').attr(edgeResizerStyle).attr({ class: 'edge-resizer--n' }),
      this.svg.line(x2, y1, x2, y2).data('direction', 'E').attr(edgeResizerStyle).attr({ class: 'edge-resizer--e' }),
      this.svg.line(x2, y2, x1, y2).data('direction', 'S').attr(edgeResizerStyle).attr({ class: 'edge-resizer--s' }),
      this.svg.line(x1, y2, x1, y1).data('direction', 'W').attr(edgeResizerStyle).attr({ class: 'edge-resizer--w' })
    ]

    edgeResizers.forEach((resizer) => {
      resizer.data('element', elem)
      resizer.drag(
        this.__onEdgeResizerDragMoveCreator(),
        this.__onEdgeResizerDragStartCreator(),
        this.__onEdgeResizerDragEndCreator()
      )
    })

    this.resizers.push(...edgeResizers)
  }
}

export default ClickControls
