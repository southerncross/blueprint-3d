<template>
<div class="blueprint-view-panel__container">
  <div :class="{ 'fullscreen': isFullscreen }" id="create-blueprint__canvas--3d"></div>
  <div class="blueprint-view-panel__buttons">
    <button
      v-if="!isFullscreen"
      class="btn-large waves-effect waves-light red tooltipped"
      data-position="right" data-delay="0" data-tooltip="全屏"
      @click="enterFullscreen"
    >
      <i class="icon-fullscreen"></i>
    </button>
    <button
      v-else
      class="btn-large waves-effect waves-light red tooltipped"
      data-position="right" data-delay="0" data-tooltip="全屏"
      @click="leaveFullscreen"
    >
      <i class="icon-fullscreen_exit"></i>
    </button>
  </div>
</div>
</template>

<script>
import THREE from 'THREE'

import MoveControl from '../libs/MoveControl'
import OrbitControl from '../libs/OrbitControl'
import Fullscreen from '../libs/Fullscreen'
import PointerLock from '../libs/PointerLock'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

export default {
  name: 'BlueprintViewPanel',

  props: {
    svg: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      keepRendering: false,
      isFullscreen: false,
      isPointerLocked: false
    }
  },

  renderer: null,
  scene: null,
  camera: null,
  orbitControl: null,
  moveControl: null,

  methods: {
    render() {
      const { renderer, scene, camera, orbitControl, moveControl, keepRendering, isFullscreen } = this

      if (isFullscreen) {
        moveControl.move()
        if (keepRendering) {
          requestAnimationFrame(this.render)
          renderer.render(scene, camera)
        }
      } else {
        orbitControl.update()
        if (keepRendering) {
          requestAnimationFrame(this.render)
          renderer.render(scene, camera)
        }
      }
    },

    drawWalls() {
      const wallGeo = new THREE.Geometry()
      this.svg.selectAll('.wall').forEach((wall, idx) => {
        const scale = 5
        const planeSize = 200
        const height = 30
        let depth = 1
        let width = 1
        const x1 = Number(wall.attr('x1'))
        const y1 = Number(wall.attr('y1'))
        const x2 = Number(wall.attr('x2'))
        const y2 = Number(wall.attr('y2'))
        const x = (x1 + x2) / 2 / scale
        const y = (y1 + y2) / 2 / scale
        if (x1 === x2) {
          depth = Math.abs(y1 - y2) / scale + width
        } else {
          width = Math.abs(x1 - x2) / scale + depth
        }

        const boxGeo = new THREE.BoxGeometry(width, height, depth)
        boxGeo.translate(x - planeSize / 2 / scale, height / 2, y - planeSize / 2 / scale)
        const wallMesh = new THREE.Mesh(boxGeo)
        wallMesh.updateMatrix()
        wallGeo.merge(wallMesh.geometry, wallMesh.matrix)
      })
      const wallMat = new THREE.MeshLambertMaterial({ color: 0xffffff })
      const wallMesh = new THREE.Mesh(wallGeo, wallMat)
      this.scene.add(wallMesh)
    },

    enterFullscreen() {
      this.camera.position.set(0, 0, 10)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))
      this.orbitControl.disable()
      this.moveControl.enable()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.isFullscreen = true

      try {
        Fullscreen.requestFullscreen()
      } catch (ohoh) {
        try {
          PointerLock.requestPointerLock()
        } catch (err) {
          console.error(err)
        }
      }
    },

    leaveFullscreen() {
      this.camera.position.set(100, 100, 100)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))
      this.moveControl.disable()
      this.orbitControl.enable()
      this.renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)
      this.isFullscreen = false
    },

    fullscreenListener(err, inFullscreen) {
      if (err) {
        console.error(err)
      }
      if (inFullscreen) {
        try {
          PointerLock.requestPointerLock()
        } catch (err) {
          console.error(err)
        }
      }
    },

    pointerLockListener(err, isPointerLocked) {
      if (err) {
        console.error(err)
      }
      this.isPointerLocked = !err && isPointerLocked
    }
  },

  ready() {
    Fullscreen.addFullscreenListener(this.fullscreenListener)
    PointerLock.addPointerLockListener(this.pointerLockListener)

    const canvasDom = document.getElementById('create-blueprint__canvas--3d')

    this.clock = new THREE.Clock()

    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(new THREE.Color(0x000000, 1.0))
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)
    renderer.shadowMap.enabled = true
    renderer.domElement.className = 'card'
    canvasDom.appendChild(renderer.domElement)
    this.renderer = renderer

    const scene = new THREE.Scene()
    this.scene = scene

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(100, 100, 100)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.camera = camera

    const control = new MoveControl({ camera })
    control.init()
    this.scene.add(control.getObject())
    this.moveControl = control

    const orbitControl = new OrbitControl({ camera })
    this.orbitControl = orbitControl

    // const ambientLight = new THREE.AmbientLight(0xffffff)
    // scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.color.setHSL(0.1, 1, 0.95)
    dirLight.position.set(-1, 1.75, 1)
    dirLight.position.multiplyScalar(50)
    scene.add(dirLight)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
    hemiLight.color.setHSL(0.6, 1, 0.6)
    hemiLight.groundColor.setHSL(0.095, 1, 0.75)
    hemiLight.position.set(0, 500, 0)
    scene.add(hemiLight)

    const axes = new THREE.AxisHelper(200)
    scene.add(axes)

    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500),
      new THREE.MeshBasicMaterial({ color: 0xcccccc })
    )
    planeMesh.receiveShadow = true
    planeMesh.rotation.x = -0.5 * Math.PI
    scene.add(planeMesh)

    this.drawWalls()

    this.keepRendering = true
    this.render()
  },

  beforeDestroy() {
    Fullscreen.removeFullscreenListener(this.fullscreenListener)
    PointerLock.removePointerLockListener(this.pointerLockListener)
    this.keepRendering = false
  }
}
</script>

<style lang="stylus">
.blueprint-view-panel
  &__container
    width 900px
    margin auto
  &__buttons
    position absolute
    bottom 50px
    left 200px
    z-index 100
  &__fullscreen
    &__hint
      position absolute
      left 50%
      top 50%
      z-index 100
      padding 20px
      text-align center
      transform translate(-50%, -50%)
      background-color rgba(white, 70%)
    &__item
      font-size 23px
      margin 30px
    &__start
      font-size 23px
      margin 30px
      padding 10px 30px
      cursor pointer
      color white
      border none
      border-radius 30px
      background-color color-cyan
      box-shadow 3px 3px 3px color-grey
      &:hover
        background-color color-cyan-lighten-1

#create-blueprint__canvas--3d.fullscreen
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  z-index 70
</style>
