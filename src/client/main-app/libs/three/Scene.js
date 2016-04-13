import THREE from 'THREE'
import dat from 'dat'

import MoveControl from './MoveControl'
import OrbitControl from './OrbitControl'
import PointerLock from './PointerLock'

class Scene {
  constructor(config = {}) {
    this.config = Object.assign({
      showGrid: true,
      showAxes: true,
      showSkybox: false
    }, config)
    this.scene = new THREE.Scene()
    this.camera = null
    this.renderer = null
    this.clock = new THREE.Clock()
    this.orbitControl = null
    this.moveControl = null
    this.anaglyphEffect = false
    this.stereoEffect = false
    this.mode = 'orbit'
    this.skybox = null
    this.grid = null
    this.axes = null
    this.plane = null
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
    this.toggleAxes = this.toggleAxes.bind(this)
    this.toggleSkybox = this.toggleSkybox.bind(this)
    this.toggleGrid = this.toggleGrid.bind(this)

    this.__render = this.__render.bind(this)
  }

  add(mesh) {
    this.scene.add(mesh)
  }

  mount({ mountDom, width, height }) {
    this.renderer.setSize(width, height)
    this.anaglyphRenderer.setSize(width, height)
    this.stereoRenderer.setSize(width, height)
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
    this.scene.remove(this.floor)

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

  toggleAnaglyphEffect(value) {
    if (typeof value === 'undefined') {
      value = !this.anaglyphEffect
    }
    this.anaglyphEffect = value
    return this.anaglyphEffect
  }

  toggleStereoEffect(value) {
    if (typeof value === 'undefined') {
      value = !this.stereoEffect
    }
    this.stereoEffect = value
    if (this.stereoEffect) {
      this.stereoRenderer.init()
    } else {
      this.stereoRenderer.uninit()
    }
    return this.stereoEffect
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
    renderer.shadowMap.enabled = true
    this.renderer = renderer
    this.anaglyphRenderer = new THREE.AnaglyphEffect(renderer)
    this.stereoRenderer = new THREE.StereoEffect(renderer)
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

    // Control
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

    const hemiLight = new THREE.HemisphereLight(0xf2e9e1, 0x9b9b9b, 0.8)
    hemiLight.position.set(-200, 500, -50)
    this.scene.add(hemiLight)
    // this.scene.add(new THREE.HemisphereLightHelper(hemiLight, 50))

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

    // var geometry = new THREE.SphereGeometry(3000, 60, 40)
    // var uniforms = {
    //   texture: { type: 't', value: new THREE.TextureLoader().load('/images/skydome.jpg') }
    // }

    // const skyVertex =
    // `
    //   varying vec2 vUV;

    //   void main() {
    //     vUV = uv;
    //     vec4 pos = vec4(position, 1.0);
    //     gl_Position = projectionMatrix * modelViewMatrix * pos;
    //   }
    // `

    // const skyFragment =
    // `
    //   uniform sampler2D texture;
    //   varying vec2 vUV;

    //   void main() {
    //     vec4 sample = texture2D(texture, vUV);
    //     gl_FragColor = vec4(sample.xyz, sample.w);
    //   }
    // `

    // var material = new THREE.ShaderMaterial({
    //   uniforms: uniforms,
    //   vertexShader: skyVertex,
    //   fragmentShader: skyFragment
    // })

    // const skybox = new THREE.Mesh(geometry, material)
    // skybox.scale.set(-1, 1, 1)
    // skybox.rotation.order = 'XZY'
    // skybox.renderOrder = 1000.0
    // this.skybox = skybox
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
      camera,
      orbitControl,
      moveControl,
      mode,
      keepRendering,
      anaglyphEffect,
      stereoEffect
    } = this

    let renderer = this.renderer
    if (anaglyphEffect) {
      renderer = this.anaglyphRenderer
    }
    if (stereoEffect) {
      renderer = this.stereoRenderer
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
