import THREE from 'THREE'

import MoveControl from './MoveControl'
import OrbitControl from './OrbitControl'
import PointerLock from './PointerLock'

class Scene {
  constructor() {
    this.scene = new THREE.Scene()
    this.camera = null
    this.renderer = null
    this.clock = new THREE.Clock()
    this.orbitControl = null
    this.moveControl = null

    this.init = this.init.bind(this)
    this.add = this.add.bind(this)
    this.setOrbitView = this.setOrbitView.bind(this)
    this.setRoamView = this.setRoamView.bind(this)
  }

  init({ canvas, width, height }) {
    this.__initRenderer(canvas, width, height)
    this.__initCamera()
    this.__initControls()
    this.__initLight()
    this.__initAxes()
    this.__initPlane()
  }

  add(mesh) {
    this.scene.add(mesh)
  }

  setOrbitView(callback) {
    this.camera.position.set(100, 100, 100)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.moveControl.disable()
    this.orbitControl.enable()
    // this.renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)
    // this.isFullscreen = false
    callback()
  }

  setRoamView(callback) {
    this.camera.position.set(0, 0, 10)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.orbitControl.disable()
    this.moveControl.enable()
    // this.renderer.setSize(window.innerWidth, window.innerHeight)
    // this.isFullscreen = true

    const listener = () => {
      PointerLock.removePointerLockListener(listener)
      callback()
    }

    try {
      PointerLock.requestPointerLock()
      PointerLock.addPointerLockListener(listener)
    } catch (err) {
      console.error(err)
      PointerLock.removePointerLockListener(listener)
    }
  }

  __initRenderer(canvas, width, height) {
    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(new THREE.Color(0x000000, 1.0))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.domElement.className = 'card'
    canvas.appendChild(renderer.domElement)
    this.renderer = renderer
  }

  __initCamera() {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(100, 100, 100)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.camera = camera
  }

  __initControls() {
    const moveControl = new MoveControl({ camera: this.camera })
    moveControl.init()
    this.scene.add(moveControl.getObject())
    this.moveControl = moveControl

    const orbitControl = new OrbitControl({ camera: this.camera })
    this.orbitControl = orbitControl
  }

  __initLight() {
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.color.setHSL(0.1, 1, 0.95)
    dirLight.position.set(-1, 1.75, 1)
    dirLight.position.multiplyScalar(50)
    this.scene.add(dirLight)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
    hemiLight.color.setHSL(0.6, 1, 0.6)
    hemiLight.groundColor.setHSL(0.095, 1, 0.75)
    hemiLight.position.set(0, 500, 0)
    this.scene.add(hemiLight)
  }

  __initAxes() {
    const axes = new THREE.AxisHelper(1000)
    this.scene.add(axes)
  }

  __initPlane() {
    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500),
      new THREE.MeshBasicMaterial({ color: 0xcccccc })
    )
    planeMesh.receiveShadow = true
    planeMesh.rotation.x = -0.5 * Math.PI
    this.scene.add(planeMesh)
  }
}

export default Scene
