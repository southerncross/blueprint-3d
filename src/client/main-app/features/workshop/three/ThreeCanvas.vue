<template>
<div id="three-canvas"></div>
</template>

<script>
export default {
  name: 'ThreeCanvas',

  props: {
    scene: Object
  },

  ready() {
    const canvas = document.getElementById('three-canvas')
    this.scene.mount({
      mountDom: canvas,
      width: window.innerWidth,
      height: window.innerHeight
    })
    this.scene.startRendering()
    // this.scene.stopRendering()
  },

  beforeDestroy() {
    this.scene.stopRendering()
  }
}
</script>

<style lang="stylus">
#three-canvas
  overflow hidden
</style>
