<template>
  <div class="app full-height">
    <three-panel :svg.once="svg"></three-panel>
  </div>
</template>

<script>
import Snap from 'Snap'

import ThreePanel from './components/ThreePanel'

export default {
  name: 'App',

  components: {
    ThreePanel
  },

  data() {
    return {
      blueprint: window['blueprint-3d'].data,
      svg: null
    }
  },

  methods: {

  },

  ready() {
    Snap.load(`http://7xrvhn.com1.z0.glb.clouddn.com/${this.blueprint.svgKey}`, (svg) => {
      if (!svg) {
        console.log('加载失败')
        return
      }
      this.svg = svg
      svg.selectAll('.window').forEach((_window) => {
        // Don't forget to restore hoveredLineIds because three canvas need it to render correctly.
        const hoverWallId = _window.attr('hover-elem-id')
        const hoverWall = this.svg.select(`#${hoverWallId}`)
        if (hoverWall) {
          const hoveredLineIds = hoverWall.data('hoveredLineIds') || []
          hoveredLineIds.push(_window.attr('id'))
          hoverWall.data('hoveredLineIds', hoveredLineIds)
        }
      })
      svg.selectAll('.door').forEach((door) => {
        const hoverWallId = door.attr('hover-elem-id')
        const hoverWall = this.svg.select(`#${hoverWallId}`)
        if (hoverWall) {
          const hoveredLineIds = hoverWall.data('hoveredLineIds') || []
          hoveredLineIds.push(door.attr('id'))
          hoverWall.data('hoveredLineIds', hoveredLineIds)
        }
      })
    })
  }
}
</script>

<style lang="stylus">
</style>
