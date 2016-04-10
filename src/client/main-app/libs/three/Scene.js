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
    this.anaglyphEffect = false
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
    this.toggleAnaglyphEffect = this.toggleAnaglyphEffect.bind(this)

    this.__render = this.__render.bind(this)
  }

  add(mesh) {
    this.scene.add(mesh)
  }

  mount({ mountDom, width, height }) {
    this.renderer.setSize(width, height)
    this.anaglyphRenderer.setSize(width, height)
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

  toggleAnaglyphEffect() {
    this.anaglyphEffect = !this.anaglyphEffect
  }

  __init() {
    this.__initRenderer()
    this.__initCamera()
    this.__initControls()
    this.__initLight()
    this.__initAxes()
    this.__initGrid()
    this.__initCubeMap()
  }

  __initRenderer() {
    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(new THREE.Color(0xffffff, 1.0))
    renderer.shadowMap.enabled = true
    this.renderer = renderer
    this.anaglyphRenderer = new THREE.AnaglyphEffect(renderer)
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
    // const cube = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshLambertMaterial({ color: '#ffffff' }))
    // this.scene.add(cube)

    const ambiColor = '#0c0c0c'
    const ambientLight = new THREE.AmbientLight(ambiColor)
    this.scene.add(ambientLight)

    // Control
    const ambientControl = {}
    ambientControl.color = ambiColor
    const ambientFolder = this.gui.addFolder('ambientLight')
    ambientFolder.addColor(ambientControl, 'color').onChange((e) => {
      ambientLight.color = new THREE.Color(e)
    })

    const dirColor = '#ffffff'
    const dirIntensity = 0.5
    const directionalLight = new THREE.DirectionalLight(dirColor, dirIntensity)
    directionalLight.position.set(1, 1, 1)
    this.scene.add(directionalLight)
    this.scene.add(new THREE.DirectionalLightHelper(directionalLight, 100))

    const anotherDirectionalLight = new THREE.DirectionalLight(dirColor, dirIntensity)
    anotherDirectionalLight.position.set(1, 1, -1)
    this.scene.add(anotherDirectionalLight)
    this.scene.add(new THREE.DirectionalLightHelper(anotherDirectionalLight, 100))

    // Control
    const directionalControl = {}
    directionalControl.color = dirColor
    directionalControl.intensity = dirIntensity
    const directionalFolder = this.gui.addFolder('directionalLight')
    directionalFolder.add(directionalControl, 'intensity', 0, 1.0).onChange((e) => {
      directionalLight.intensity = e
      anotherDirectionalLight.intensity = e
    })
    directionalFolder.addColor(directionalControl, 'color').onChange((e) => {
      directionalLight.color = new THREE.Color(e)
      anotherDirectionalLight.color = new THREE.Color(e)
    })

    const hemiLight = new THREE.HemisphereLight(0x898989, 0x595959, 0.6)
    hemiLight.position.set(0, 500, 0)
    this.scene.add(hemiLight)
    this.scene.add(new THREE.HemisphereLightHelper(hemiLight, 50))

    // control
    const hemiControl = {}
    hemiControl.color = '#ffffff'
    hemiControl.groundColor = '#ffffff'
    hemiControl.x = 0
    hemiControl.y = 500
    hemiControl.z = 0
    const hemiFolder = this.gui.addFolder('hemiLight')
    hemiFolder.addColor(hemiControl, 'color').onChange((e) => {
      hemiLight.color = new THREE.Color(e)
    })
    hemiFolder.addColor(hemiControl, 'groundColor').onChange((e) => {
      hemiLight.groundColor = new THREE.Color(e)
    })
    hemiFolder.add(hemiControl, 'x', -500, 500).onChange((e) => {
      hemiLight.position.x = e
    })
    hemiFolder.add(hemiControl, 'y', -500, 500).onChange((e) => {
      hemiLight.position.y = e
    })
    hemiFolder.add(hemiControl, 'z', -500, 500).onChange((e) => {
      hemiLight.position.z = e
    })
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

  __initCubeMap() {
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
    const cubeMesh = new THREE.Mesh(new THREE.CubeGeometry(5000, 5000, 5000), material)
    this.scene.add(cubeMesh)

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }))
    sphere.material.envMap = textureCube
    this.scene.add(sphere)
  }

  __render() {
    const {
      scene,
      camera,
      orbitControl,
      moveControl,
      mode,
      keepRendering,
      anaglyphEffect
    } = this

    let renderer = this.renderer
    if (anaglyphEffect) {
      renderer = this.anaglyphRenderer
    }

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
