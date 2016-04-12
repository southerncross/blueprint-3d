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
      scene: new Scene()
    }
  },

  methods: {
    drawWalls() {
      const scale = 10
      const planeSize = 100
      const wallHeight = 30
      const wallDepth = 1
      const windowHeight = 12
      const windowOffsetGround = 10
      const doorHeight = 20
      const offsetX = -window.innerWidth / 2
      const offsetY = -window.innerHeight / 2

      const wallGeo = new THREE.Geometry()
      this.svg.selectAll('.wall').forEach((wall, idx) => {
        let depth = wallDepth
        let width = wallDepth
        const x1 = Number(wall.attr('x1')) + offsetX
        const y1 = Number(wall.attr('y1')) + offsetY
        const x2 = Number(wall.attr('x2')) + offsetX
        const y2 = Number(wall.attr('y2')) + offsetY
        const x = (x1 + x2) / 2 / scale
        const y = (y1 + y2) / 2 / scale
        if (x1 === x2) {
          depth = Math.abs(y1 - y2) / scale + width
        } else {
          width = Math.abs(x1 - x2) / scale + depth
        }

        const boxGeo = new THREE.BoxGeometry(width, wallHeight, depth)
        boxGeo.translate(x - planeSize / 2 / scale, wallHeight / 2, y - planeSize / 2 / scale)
        const wallMesh = new THREE.Mesh(boxGeo)
        wallMesh.updateMatrix()
        wallGeo.merge(wallMesh.geometry, wallMesh.matrix)
      })

      const windowGeo = new THREE.Geometry()
      this.svg.selectAll('.window').forEach((wall, idx) => {
        let depth = wallDepth
        let width = wallDepth
        const x1 = Number(wall.attr('x1')) + offsetX
        const y1 = Number(wall.attr('y1')) + offsetY
        const x2 = Number(wall.attr('x2')) + offsetX
        const y2 = Number(wall.attr('y2')) + offsetY
        const x = (x1 + x2) / 2 / scale
        const y = (y1 + y2) / 2 / scale
        if (x1 === x2) {
          depth = Math.abs(y1 - y2) / scale + width
        } else {
          width = Math.abs(x1 - x2) / scale + depth
        }

        const boxGeo = new THREE.BoxGeometry(width, windowHeight, depth)
        boxGeo.translate(x - planeSize / 2 / scale, windowHeight / 2 + windowOffsetGround, y - planeSize / 2 / scale)
        const windowMesh = new THREE.Mesh(boxGeo)
        windowMesh.updateMatrix()
        windowGeo.merge(windowMesh.geometry, windowMesh.matrix)
      })

      const doorGeo = new THREE.Geometry()
      this.svg.selectAll('.door').forEach((door, idx) => {
        let depth = wallDepth
        let width = wallDepth
        const x1 = Number(door.attr('x1')) + offsetX
        const y1 = Number(door.attr('y1')) + offsetY
        const x2 = Number(door.attr('x2')) + offsetX
        const y2 = Number(door.attr('y2')) + offsetY
        const x = (x1 + x2) / 2 / scale
        const y = (y1 + y2) / 2 / scale
        if (x1 === x2) {
          depth = Math.abs(y1 - y2) / scale + width
        } else {
          width = Math.abs(x1 - x2) / scale + depth
        }

        const boxGeo = new THREE.BoxGeometry(width, doorHeight, depth)
        boxGeo.translate(x - planeSize / 2 / scale, doorHeight / 2, y - planeSize / 2 / scale)
        const doorMesh = new THREE.Mesh(boxGeo)
        doorMesh.updateMatrix()
        doorGeo.merge(doorMesh.geometry, doorMesh.matrix)
      })

      const wallBSP = new ThreeBSP(wallGeo)
      let newBSP = wallBSP
      if (this.windowCount > 0) {
        const windowBSP = new ThreeBSP(windowGeo)
        newBSP = wallBSP.subtract(windowBSP)
      }
      if (this.doorCount > 0) {
        const doorBSP = new ThreeBSP(doorGeo)
        newBSP = wallBSP.subtract(doorBSP)
      }
      const bumpTexture = new THREE.TextureLoader().load('/images/wall-texture.jpg')
      bumpTexture.wrapS = THREE.RepeatWrapping
      bumpTexture.wrapT = THREE.RepeatWrapping
      bumpTexture.repeat.set(3, 3)
      const material = new THREE.MeshPhongMaterial({ bumpMap: bumpTexture, bumpScale: 0.1 })
      const newMesh = newBSP.toMesh(material)
      this.scene.add(newMesh)

      // const wallMat = new THREE.MeshLambertMaterial({ color: 0xffffff })
      // const wallMesh = new THREE.Mesh(finalWallGeo, wallMat)
      // const wallMesh = new THREE.Mesh(wallGeo, wallMat)

      // this.scene.add(wallMesh)
    }
  },

  ready() {
    this.drawWalls()
  }
}
</script>

<style lang="stylus">
</style>
