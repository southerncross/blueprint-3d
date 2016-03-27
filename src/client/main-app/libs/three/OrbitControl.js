import THREE from 'THREE'

import '../../../vendors/OrbitControls'

class OrbitControl {
  constructor({ camera }) {
    this.control = new THREE.OrbitControls(camera)
    this.clock = new THREE.Clock()

    this.reset()
  }

  reset() {
    this.control.target.set(0, 50, 0)
  }

  update() {
    const delta = this.clock.getDelta()
    this.control.update(delta)
  }

  enable() {
    this.reset()
    this.control.enabled = true
  }

  disable() {
    this.control.enabled = false
  }
}

export default OrbitControl
