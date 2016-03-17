class ClickControls {
  constructor() {
    this.elements = []
    this.resizers = []
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

    elem.drag(this.__onElementMove, this.__onElementDragStart, this.__onElementDragEnd)
    this.__addResizers(elem)
  }

  __onElementMove() {
  }

  __onElementDragStart() {
    this.__clearResizers()
  }

  __onElementDragEnd() {
    if (!this.multiMode) {
      this.__addResizers(this.elements[0])
    }
  }

  __clearElements() {
    this.elements.forEach((elem) => elem.undrag())
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
  }

  __addImageResizers(elem) {
  }
}

export default ClickControls
