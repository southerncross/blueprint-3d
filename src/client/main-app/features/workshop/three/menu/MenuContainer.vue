<template>
<ul class="collapsible menu-container" data-collapsible="accordion">
  <orbit-menu
    class="menu-item"
    :mode="mode"
    :enter-orbit.once="enterOrbitView"></orbit-menu>
  <roam-menu
    class="menu-item"
    :mode="mode"
    :enter-roam.once="enterRoamView"></roam-menu>
  <util-switch
    class="menu-item"
    display="红蓝3D"
    :status="anaglyphEffect"
    :toggle.once="toggleAnaglyphEffect"></util-switch>
  <util-switch
    class="menu-item"
    display="坐标轴"
    :status="showAxes"
    :toggle.once="toggleShowAxes"></util-switch>
  <util-switch
    class="menu-item"
    display="水平网格"
    :status="showGrid"
    :toggle.once="toggleShowGrid"></util-switch>
  <util-switch
    class="menu-item"
    display="立方贴图"
    :status="showSkybox"
    :toggle.once="toggleShowSkybox"></util-switch>
</ul>
</template>

<script>
import OrbitMenu from './OrbitMenu'
import RoamMenu from './RoamMenu'
import UtilSwitch from './UtilSwitch'

export default {
  name: 'MenuContainer',

  components: {
    OrbitMenu,
    RoamMenu,
    UtilSwitch
  },

  props: {
    scene: Object
  },

  data() {
    return {
      mode: 'orbit',
      showAxes: true,
      showGrid: true,
      showSkybox: false,
      anaglyphEffect: false
    }
  },

  methods: {
    enterOrbitView() {
      if (this.mode === 'orbit') {
        return
      }
      this.mode = 'orbit'
      this.scene.setOrbitView()
    },
    enterRoamView() {
      if (this.mode === 'roam') {
        return
      }
      this.mode = 'roam'
      this.scene.setRoamView()
    },
    toggleShowAxes() {
      this.showAxes = this.scene.toggleAxes()
    },
    toggleShowGrid() {
      this.showGrid = this.scene.toggleGrid()
    },
    toggleShowSkybox() {
      this.showSkybox = this.scene.toggleSkybox()
    },
    toggleAnaglyphEffect() {
      this.anaglyphEffect = this.scene.toggleAnaglyphEffect()
    }
  }
}
</script>

<styl lang="stylus">
</styl>