import THREE from 'THREE'

import MoveControl from './MoveControl'
import OrbitControl from './OrbitControl'
import PointerLock from './PointerLock'

const VALID_EFFECT_NAMES = ['normal', 'anaglyph', 'stereo']

class Scene {
  constructor(config = {}) {
    this.config = Object.assign({
      showGrid: true,
      showAxes: true,
      showSkybox: false,
      cameraName: 'orbit',
      effectName: 'normal'
    }, config)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.cameras = {
      orbit: null,
      roam: null
    }
    this.effects = {
      normal: null,
      anaglyph: null,
      sterero: null
    }
    this.clock = new THREE.Clock()
    this.orbitControl = null
    this.moveControl = null
    this.skybox = null
    this.grid = null
    this.axes = null
    this.plane = null
    this.keepRendering = false

    this.__init()

    this.add = this.add.bind(this)
    this.mount = this.mount.bind(this)
    this.startRendering = this.startRendering.bind(this)
    this.stopRendering = this.stopRendering.bind(this)
    this.setOrbitCamera = this.setOrbitCamera.bind(this)
    this.setRoamCamera = this.setRoamCamera.bind(this)
    this.setEffect = this.setEffect.bind(this)
    this.toggleAxes = this.toggleAxes.bind(this)
    this.toggleSkybox = this.toggleSkybox.bind(this)
    this.toggleGrid = this.toggleGrid.bind(this)

    this.__render = this.__render.bind(this)
  }

  add(mesh) {
    this.scene.add(mesh)
  }

  remove(mesh) {
    this.scene.remove(mesh)
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

  setOrbitCamera(callback = () => {}) {
    this.cameras.orbit.position.set(100, 100, 100)
    this.cameras.orbit.lookAt(new THREE.Vector3(0, 0, 0))
    this.moveControl.disable()
    this.orbitControl.enable()
    this.config.cameraName = 'orbit'
    // this.renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)
    // this.isFullscreen = false
    this.scene.remove(this.floor)

    if (typeof callback !== 'function') {
      return
    }

    callback()
  }

  setRoamCamera(callback = () => {}) {
    this.cameras.roam.position.set(0, 0, 10)
    this.cameras.roam.lookAt(new THREE.Vector3(0, 0, 0))
    this.orbitControl.disable()
    this.moveControl.enable()
    this.config.cameraName = 'roam'
    // this.renderer.setSize(window.innerWidth, window.innerHeight)
    // this.isFullscreen = true
    this.scene.add(this.floor)

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

  setEffect(effectName, width, height) {
    if (VALID_EFFECT_NAMES.indexOf(effectName) < 0) {
      console.warn(`${effectName} is not supported.`)
      return
    }
    this.config.effectName = effectName
    this.effects[effectName].setSize(width, height)
  }

  toggleAxes(value) {
    if (typeof value === 'undefined') {
      value = !this.config.showAxes
    }
    this.config.showAxes = value
    if (this.config.showAxes) {
      this.scene.add(this.axes)
    } else {
      this.scene.remove(this.axes)
    }
    return this.config.showAxes
  }

  toggleSkybox(value) {
    if (typeof value === 'undefined') {
      value = !this.config.showSkybox
    }
    this.config.showSkybox = value
    if (this.config.showSkybox) {
      this.scene.add(this.skybox)
    } else {
      this.scene.remove(this.skybox)
    }
    return this.config.showSkybox
  }

  toggleGrid(value) {
    if (typeof value === 'undefined') {
      value = !this.config.showGrid
    }
    this.config.showGrid = value
    if (this.config.showGrid) {
      this.scene.add(this.grid)
    } else {
      this.scene.remove(this.grid)
    }
    return this.config.showGrid
  }

  __init() {
    this.__initRenderer()
    this.__initCamera()
    this.__initEffect()
    this.__initControls()
    this.__initLight()
    this.__initAxes()
    this.__initGrid()
    this.__initSkybox()
    this.__initFloor()
  }

  __initRenderer() {
    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(new THREE.Color(0xffffff, 1.0))
    renderer.shadowMap.enabled = false
    this.renderer = renderer
  }

  __initCamera() {
    this.cameras.orbit = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000)
    this.cameras.orbit.position.set(100, 100, 100)
    this.cameras.orbit.lookAt(new THREE.Vector3(0, 0, 0))

    this.cameras.roam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000)
    this.cameras.roam.position.set(100, 100, 100)
    this.cameras.roam.lookAt(new THREE.Vector3(0, 0, 0))
  }

  __initEffect() {
    this.effects.normal = this.renderer
    this.effects.stereo = new THREE.StereoEffect(this.renderer)
    this.effects.anaglyph = new THREE.AnaglyphEffect(this.renderer)
  }

  __initControls() {
    const moveControl = new MoveControl({ camera: this.cameras.roam })
    moveControl.init()
    this.scene.add(moveControl.getObject())
    this.moveControl = moveControl

    const orbitControl = new OrbitControl({ camera: this.cameras.orbit })
    this.orbitControl = orbitControl
  }

  __initLight() {
    const ambiColor = '#0c0c0c'
    const ambientLight = new THREE.AmbientLight(ambiColor)
    this.scene.add(ambientLight)

    const dirColor = '#ffffff'
    const dirIntensity = 0.3
    const directionalLight = new THREE.DirectionalLight(dirColor, dirIntensity)
    directionalLight.position.set(-1, 1, -0.2)
    this.scene.add(directionalLight)
    // this.scene.add(new THREE.DirectionalLightHelper(directionalLight, 100))
    const directionalLight2 = new THREE.DirectionalLight(dirColor, 0.05)
    directionalLight2.position.set(0.2, 0, 0.8)
    this.scene.add(directionalLight2)
    const directionalLight3 = new THREE.DirectionalLight(dirColor, 0.05)
    directionalLight3.position.set(0.3, 0, 0.2)
    this.scene.add(directionalLight3)

    const hemiLight = new THREE.HemisphereLight(0xf2e9e1, 0x9b9b9b, 0.8)
    hemiLight.position.set(-200, 500, -50)
    this.scene.add(hemiLight)
    // this.scene.add(new THREE.HemisphereLightHelper(hemiLight, 50))
  }

  __initAxes() {
    this.axes = new THREE.AxisHelper(1000)
    if (this.config.showAxes) {
      this.scene.add(this.axes)
    }
  }

  __initGrid() {
    const size = 200
    const step = 10

    this.grid = new THREE.GridHelper(size, step)
    this.grid.setColors(0x000000, 0xb0bec5)
    if (this.config.showGrid) {
      this.scene.add(this.grid)
    }
  }

  __initSkybox() {
    const size = 2000
    const loader = new THREE.CubeTextureLoader()
    loader.setPath('/images/')
    var textureCube = loader.load([
      'posx.jpg',
      'negx.jpg',
      'posy.jpg',
      'negy.jpg',
      'posz.jpg',
      'negz.jpg'
    ])

    var shader = THREE.ShaderLib['cube']
    shader.uniforms['tCube'].value = textureCube
    var material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    })
    this.skybox = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), material)
  }

  __initFloor() {
    const size = 500
    const floorGeo = new THREE.PlaneGeometry(size, size)
    const texture = new THREE.TextureLoader().load('/images/floor-texture.jpg')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(30, 30)
    const floorMat = new THREE.MeshLambertMaterial({ map: texture })
    this.floor = new THREE.Mesh(floorGeo, floorMat)
    this.floor.rotation.x = -0.5 * Math.PI
  }

  __render() {
    const {
      scene,
      config,
      orbitControl,
      moveControl,
      keepRendering
    } = this

    const renderer = this.effects[config.effectName]
    const camera = this.cameras[config.cameraName]

    switch (config.cameraName) {
      case 'orbit':
        orbitControl.update()
        break
      case 'roam':
        moveControl.move()
        break
    }

    if (keepRendering) {
      requestAnimationFrame(this.__render)
      if (renderer && camera) {
        renderer.render(scene, camera)
      }
    }
  }
}

export default Scene
