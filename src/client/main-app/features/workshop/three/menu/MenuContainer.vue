<template>
<ul class="collapsible menu-container" data-collapsible="accordion">
  <orbit-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"></orbit-menu>
  <roam-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"></roam-menu>
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
    mode: String,
    scene: Object,
    setMode: Function
  },

  data() {
    return {
      showAxes: true,
      showGrid: true,
      showSkybox: false,
      anaglyphEffect: false
    }
  },

  methods: {
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