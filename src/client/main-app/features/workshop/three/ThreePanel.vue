<template>
<div>
  <three-canvas
    :scene.once="scene"></three-canvas>
  <menu-container
    class="edit__menu-container"
    :mode="mode"
    :scene="scene"
    :set-mode.once="setMode"></menu-container>
</div>
</template>

<script>
import THREE from 'THREE'

import Scene from '../../../libs/three/Scene'
import ThreeCanvas from './ThreeCanvas'
import MenuContainer from './menu/MenuContainer'

export default {
  name: 'ThreePanel',

  components: {
    ThreeCanvas,
    MenuContainer
  },

  props: {
    svg: Object
  },

  data() {
    return {
      mode: 'orbit',
      scene: new Scene()
    }
  },

  methods: {
    setMode(nextMode) {
      if (nextMode === this.mode) {
        return
      }
      this.mode = nextMode
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
    }
  },

  ready() {
    this.drawWalls()
  }
}
</script>

<style lang="stylus">
</style>
