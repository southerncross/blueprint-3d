<template>
<div>
  <div id="three-panel__svg-canvas"></div>
  <orbit-view-menu
    v-show="showOrbitMenu()"
    :scene.once="scene">
  </orbit-view-menu>
  <roam-view-menu
    v-show="showRoamMenu()"
    :scene.once="scene">
  </roam-view-menu>
</div>
</template>

<script>
import OrbitViewMenu from './OrbitViewMenu'
import RoamViewMenu from './RoamViewMenu'

export default {
  name: 'ThreePanel',

  components: {
    OrbitViewMenu,
    RoamViewMenu
  },

  data() {
    return {
      mode: 'orbit'
    }
  },

  methods: {
    showOrbitMenu() {
      return this.mode === 'orbit'
    },
    showRoamMenu() {
      return this.mode === 'roam'
    }
  }
}
</script>

<style lang="stylus">
</style>
