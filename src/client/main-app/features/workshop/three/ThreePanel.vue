<template>
<div>
  <three-canvas
    :scene.once="scene"></three-canvas>
  <menu-container
    class="edit__menu-container"
    :scene="scene"></menu-container>
</div>
</template>

<script>
import THREE from 'THREE'
import ThreeBSP from 'ThreeBSP'
import dat from 'dat'

import Scene from '../../../libs/three/Scene'
import ThreeCanvas from './ThreeCanvas'
import MenuContainer from './menu/MenuContainer'

export default {
  name: 'ThreePanel',

  components: {
    ThreeCanvas,
    MenuContainer
  },

  vuex: {
    getters: {
      windowCount: state => state.window.count,
      doorCount: state => state.door.count
    }
  },

  props: {
    svg: Object
  },

  data() {
    return {
      gui: new dat.GUI(),
      scene: new Scene(),
      offsetX: -window.innerWidth / 2,
      offsetY: -window.innerHeight / 2
    }
  },

  methods: {
    initGUI() {
      this.config = {
        scale: 10,
        planeSize: 100,
        wallDepth: 1,
        wallHeight: 35,
        windowHeight: 15,
        windowOffsetGround: 10,
        doorHeight: 23
      }

      let meta = this.svg.select('blueprint-meta')
      if (meta) {
        Object.keys(this.config).forEach((key) => {
          if (meta.attr(key)) {
            this.config[key] = Number(meta.attr(key))
          }
        })
      } else {
        meta = this.svg.el('blueprint-meta', this.config)
        meta.toDefs()
      }
      this.gui.add(this.config, 'scale', 1, 50).onChange((value) => {
        this.clear()
        this.config.scale = value
        meta.attr('scale', value)
        this.draw()
      })
      this.gui.add(this.config, 'wallDepth', 1, 5).onChange((value) => {
        this.clear()
        this.config.wallDepth = value
        meta.attr('wallDepth', value)
        this.draw()
      })
      this.gui.add(this.config, 'wallHeight', 35, 50).onChange((value) => {
        this.clear()
        this.config.wallHeight = value
        meta.attr('wallHeight', value)
        this.draw()
      })
      this.gui.add(this.config, 'windowHeight', 10, 20).onChange((value) => {
        this.clear()
        this.config.windowHeight = value
        meta.attr('windowHeight', value)
        this.draw()
      })
      this.gui.add(this.config, 'windowOffsetGround', 5, 15).onChange((value) => {
        this.clear()
        this.config.windowOffsetGround = value
        meta.attr('windowOffsetGround', value)
        this.draw()
      })
      this.gui.add(this.config, 'doorHeight', 20, 30).onChange((value) => {
        this.clear()
        this.config.doorHeight = value
        meta.attr('doorHeight', value)
        this.draw()
      })
    },
    clear() {
      this.wallMeshes.forEach((mesh) => {
        this.scene.remove(mesh)
      })
      this.wallMeshes = []
    },
    createLineGeo(svgElem, { scale, depth, height, heightOffsetGround, offsetX, offsetY }) {
      const x1 = Number(svgElem.attr('x1')) / scale
      const y1 = Number(svgElem.attr('y1')) / scale
      const x2 = Number(svgElem.attr('x2')) / scale
      const y2 = Number(svgElem.attr('y2')) / scale
      // center point
      const length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) + depth

      let theta = 0
      if (x1 === x2) {
        theta = 0.5 * Math.PI // It's pretty weird because we can not use 90 deg directly.
      } else {
        theta = -Math.atan((y1 - y2) / (x1 - x2))
      }
      const localX = (x1 + x2) / 2 + offsetX / scale
      const localZ = (y1 + y2) / 2 + offsetY / scale
      const localY = height / 2 + (heightOffsetGround || 0)

      // const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
      const lineGeo = new THREE.BoxGeometry(length, height, depth)
      lineGeo.rotateY(theta)
      lineGeo.translate(localX, localY, localZ)

      return lineGeo
    },
    draw() {
      const material = this.wallMaterial
      const {
        scale,
        wallHeight,
        wallDepth,
        doorHeight,
        windowHeight,
        windowOffsetGround
      } = this.config
      const { offsetX, offsetY } = this

      // const wallGeo = new THREE.Geometry()
      this.svg.selectAll('.wall').forEach((wallElem, idx) => {
        const wallGeo = this.createLineGeo(wallElem, {
          depth: wallDepth,
          height: wallHeight,
          scale, offsetX, offsetY
        })

        let wallBSP = new ThreeBSP(wallGeo)

        const windowOrDoorIds = wallElem.data('hoveredLineIds')
        if (windowOrDoorIds) {
          windowOrDoorIds.forEach((id) => {
            const elem = this.svg.select(`#${id}`)
            if (!elem) {
              return
            }
            if (elem.attr('class') === 'window') {
              const windowGeo = this.createLineGeo(elem, {
                depth: wallDepth,
                height: windowHeight,
                heightOffsetGround: windowOffsetGround,
                scale, offsetX, offsetY
              })
              const windowBSP = new ThreeBSP(windowGeo)
              wallBSP = wallBSP.subtract(windowBSP)
            } else if (elem.attr('class') === 'door') {
              const doorGeo = this.createLineGeo(elem, {
                depth: wallDepth,
                height: doorHeight,
                scale, offsetX, offsetY
              })
              const doorBSP = new ThreeBSP(doorGeo)
              wallBSP = wallBSP.subtract(doorBSP)
            }
          })
        }

        const wallMesh = wallBSP.toMesh(material)
        this.wallMeshes.push(wallMesh)
        this.scene.add(wallMesh)
      })
    }
  },

  ready() {
    this.wallMeshes = []

    const bumpTexture = new THREE.TextureLoader().load('/images/wall-texture.jpg')
    bumpTexture.wrapS = THREE.RepeatWrapping
    bumpTexture.wrapT = THREE.RepeatWrapping
    bumpTexture.repeat.set(3, 3)
    this.wallMaterial = new THREE.MeshPhongMaterial({ bumpMap: bumpTexture, bumpScale: 0.1 })

    this.initGUI()
    this.draw()
  }
}
</script>

<style lang="stylus">
</style>
