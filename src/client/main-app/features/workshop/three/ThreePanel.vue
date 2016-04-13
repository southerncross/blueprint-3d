<template>
<div>
  <three-canvas
    :scene.once="scene"></three-canvas>
  <menu-container
    class="edit__menu-container"
    :scene="scene"
    :set-mode.once="setMode"></menu-container>
</div>
</template>

<script>
import THREE from 'THREE'
import ThreeBSP from 'ThreeBSP'

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
      scene: new Scene(),
      scale: 10,
      planeSize: 100,
      wallDepth: 1,
      wallHeight: 35,
      windowHeight: 15,
      windowOffsetGround: 10,
      doorHeight: 23,
      offsetX: -window.innerWidth / 2,
      offsetY: -window.innerHeight / 2
    }
  },

  methods: {
    createWallGeo(wallElem) {
      const { scale, offsetX, offsetY, wallHeight, planeSize } = this
      let depth = this.wallDepth
      let width = this.wallDepth
      const x1 = Number(wallElem.attr('x1')) + offsetX
      const y1 = Number(wallElem.attr('y1')) + offsetY
      const x2 = Number(wallElem.attr('x2')) + offsetX
      const y2 = Number(wallElem.attr('y2')) + offsetY
      const x = (x1 + x2) / 2 / scale
      const y = (y1 + y2) / 2 / scale
      if (x1 === x2) {
        depth = Math.abs(y1 - y2) / scale + width
      } else {
        width = Math.abs(x1 - x2) / scale + depth
      }
      const wallGeo = new THREE.BoxGeometry(width, wallHeight, depth)
      wallGeo.translate(x - planeSize / 2 / scale, wallHeight / 2, y - planeSize / 2 / scale)
      return wallGeo
    },
    createWindowGeo(windowElem) {
      const { scale, offsetX, offsetY, windowHeight, windowOffsetGround, planeSize } = this
      let depth = this.wallDepth
      let width = this.wallDepth
      const x1 = Number(windowElem.attr('x1')) + offsetX
      const y1 = Number(windowElem.attr('y1')) + offsetY
      const x2 = Number(windowElem.attr('x2')) + offsetX
      const y2 = Number(windowElem.attr('y2')) + offsetY
      const x = (x1 + x2) / 2 / scale
      const y = (y1 + y2) / 2 / scale
      if (x1 === x2) {
        depth = Math.abs(y1 - y2) / scale + width
      } else {
        width = Math.abs(x1 - x2) / scale + depth
      }

      const windowGeo = new THREE.BoxGeometry(width, windowHeight, depth)
      windowGeo.translate(x - planeSize / 2 / scale, windowHeight / 2 + windowOffsetGround, y - planeSize / 2 / scale)
      return windowGeo
    },
    createDoorGeo(doorElem) {
      const { scale, offsetX, offsetY, doorHeight, planeSize } = this
      let depth = this.wallDepth
      let width = this.wallDepth
      const x1 = Number(doorElem.attr('x1')) + offsetX
      const y1 = Number(doorElem.attr('y1')) + offsetY
      const x2 = Number(doorElem.attr('x2')) + offsetX
      const y2 = Number(doorElem.attr('y2')) + offsetY
      const x = (x1 + x2) / 2 / scale
      const y = (y1 + y2) / 2 / scale
      if (x1 === x2) {
        depth = Math.abs(y1 - y2) / scale + width
      } else {
        width = Math.abs(x1 - x2) / scale + depth
      }

      const doorGeo = new THREE.BoxGeometry(width, doorHeight, depth)
      doorGeo.translate(x - planeSize / 2 / scale, doorHeight / 2, y - planeSize / 2 / scale)
      return doorGeo
    },
    draw() {
      const bumpTexture = new THREE.TextureLoader().load('/images/wall-texture.jpg')
      bumpTexture.wrapS = THREE.RepeatWrapping
      bumpTexture.wrapT = THREE.RepeatWrapping
      bumpTexture.repeat.set(3, 3)
      const material = new THREE.MeshPhongMaterial({ bumpMap: bumpTexture, bumpScale: 0.1 })

      // const wallGeo = new THREE.Geometry()
      this.svg.selectAll('.wall').forEach((wallElem, idx) => {
        const wallGeo = this.createWallGeo(wallElem)

        let wallBSP = new ThreeBSP(wallGeo)

        const windowOrDoorIds = wallElem.data('hoveredLineIds')
        if (windowOrDoorIds) {
          windowOrDoorIds.forEach((id) => {
            const elem = this.svg.select(`#${id}`)
            if (!elem) {
              return
            }
            if (elem.attr('class') === 'window') {
              const windowGeo = this.createWindowGeo(elem)
              const windowBSP = new ThreeBSP(windowGeo)
              wallBSP = wallBSP.subtract(windowBSP)
            } else if (elem.attr('class') === 'door') {
              const doorGeo = this.createDoorGeo(elem)
              const doorBSP = new ThreeBSP(doorGeo)
              wallBSP = wallBSP.subtract(doorBSP)
            }
          })
        }

        const wallMesh = wallBSP.toMesh(material)
        this.scene.add(wallMesh)
      })
    }
  },

  ready() {
    this.draw()
  }
}
</script>

<style lang="stylus">
</style>
