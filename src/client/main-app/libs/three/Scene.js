import THREE from 'THREE'
import dat from 'dat'

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
    this.mode = 'orbit'
    this.keepRendering = false
    // Debug boring
    this.controls = {}
    this.gui = new dat.GUI()
    // gui.add(this.controls, 'message')
    // gui.add(this.controls, 'speed', -5, 5)
    // gui.addColor(this.controls, 'color')

    this.__init()

    this.add = this.add.bind(this)
    this.mount = this.mount.bind(this)
    this.startRendering = this.startRendering.bind(this)
    this.stopRendering = this.stopRendering.bind(this)
    this.setOrbitView = this.setOrbitView.bind(this)
    this.setRoamView = this.setRoamView.bind(this)

    this.__render = this.__render.bind(this)
  }

  add(mesh) {
    this.scene.add(mesh)
  }

  mount({ mountDom, width, height }) {
    this.renderer.setSize(width, height)
    mountDom.appendChild(this.renderer.domElement)
  }

  startRendering() {
    this.keepRendering = true
    this.__render()
  }

  stopRendering() {
    this.keepRendering = false
  }

  setOrbitView(callback = () => {}) {
    this.camera.position.set(100, 100, 100)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.moveControl.disable()
    this.orbitControl.enable()
    this.mode = 'orbit'
    // this.renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)
    // this.isFullscreen = false

    if (typeof callback !== 'function') {
      return
    }

    callback()
  }

  setRoamView(callback = () => {}) {
    this.camera.position.set(0, 0, 10)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.orbitControl.disable()
    this.moveControl.enable()
    this.mode = 'roam'
    // this.renderer.setSize(window.innerWidth, window.innerHeight)
    // this.isFullscreen = true

    if (typeof callback !== 'function') {
      return
    }

    const listener = () => {
      PointerLock.removePointerLockListener(listener)
      callback()
    }

    try {
      PointerLock.addPointerLockListener(listener)
      PointerLock.requestPointerLock()
    } catch (err) {
      console.error(err)
      PointerLock.removePointerLockListener(listener)
    }
  }

  __init() {
    this.__initRenderer()
    this.__initCamera()
    this.__initControls()
    this.__initLight()
    this.__initAxes()
    this.__initGrid()
  }

  __initRenderer() {
    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(new THREE.Color(0xffffff, 1.0))
    renderer.shadowMap.enabled = true
    this.renderer = renderer
  }

  __initCamera() {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000)
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
    const ambiColor = '#0c0c0c'
    const ambientLight = new THREE.AmbientLight(ambiColor)
    this.scene.add(ambientLight)
    const ambientControl = {}
    ambientControl.color = ambiColor
    const ambientFolder = this.gui.addFolder('ambientLight')
    ambientFolder.addColor(ambientControl, 'color').onChange((e) => {
      ambientLight.color = new THREE.Color(e)
    })

    const dirColor = '#ffffff'
    const dirIntensity = 0.5
    const directionalLight = new THREE.DirectionalLight(dirColor, dirIntensity)
    directionalLight.position.set(-1, 1.75, 1)
    directionalLight.position.multiplyScalar(50)
    this.scene.add(directionalLight)
    const directionalControl = {}
    directionalControl.color = dirColor
    directionalControl.intensity = dirIntensity
    const directionalFolder = this.gui.addFolder('directionalLight')
    directionalFolder.add(directionalControl, 'intensity', 0, 1.0).onChange((e) => {
      directionalLight.intensity = e
    })
    directionalFolder.addColor(directionalControl, 'color').onChange((e) => {
      directionalLight.color = new THREE.Color(e)
    })

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

  __initGrid() {
    const size = 200
    const step = 10

    const gridHelper = new THREE.GridHelper(size, step)
    gridHelper.setColors(0x000000, 0xb0bec5)
    this.scene.add(gridHelper)
  }

  __render() {
    const {
      renderer,
      scene,
      camera,
      orbitControl,
      moveControl,
      mode,
      keepRendering
    } = this

    switch (mode) {
      case 'orbit': {
        orbitControl.update()
        if (keepRendering) {
          requestAnimationFrame(this.__render)
          renderer.render(scene, camera)
        }
        break
      }
      case 'roam': {
        moveControl.move()
        if (keepRendering) {
          requestAnimationFrame(this.__render)
          renderer.render(scene, camera)
        }
        break
      }
      default:
        break
    }
  }
}

export default Scene
