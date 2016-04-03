class EventControl {
  constructor() {
    this.handlers = {
      mousedown: [],
      mouseup: [],
      mousemove: [],
      mouseout: [],
      mouseover: [],
      click: []
    }

    this.register = this.register.bind(this)
    this.wrap = this.wrap.bind(this)
  }

  register(name, handler) {
    this.handlers[name].push(handler)
    return this
  }

  wrap(elem) {
    Object.keys(this.handlers).forEach((handlerName) => {
      this.handlers[handlerName].forEach((handler) => {
        elem[handlerName](handler)
      })
    })
  }
}

export default EventControl
