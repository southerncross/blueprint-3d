<template>
<div>
  <div>
    switch
  </div>
  <svg-panel
    v-show="showSvgPanel"
    :svg.once="svg"></svg-panel>
  <three-panel></three-panel>
</div>
</template>

<script>
import Snap from 'Snap'
import $ from 'jquery'

import SvgPanel from './svg/SvgPanel'
import ThreePanel from './three/ThreePanel'

export default {
  name: 'Edit',

  components: {
    SvgPanel,
    ThreePanel
  },

  data() {
    return {
      mode: 'svg',
      svg: new Snap('100%', '100%')
      // elementUtilsType: null,
    }
  },

  methods: {
    showSvgPanel() {
      return this.mode === 'svg'
    },
    showThreePanel() {
      return this.mode === 'three'
    },
    toggleMode() {
      this.mode = this.mode === 'svg' ? 'three' : 'svg'
    }
  },

  ready() {
    // Init materializeCss tooltip
    $('.tooltipped').tooltip()
  }
}
</script>

<style lang="stylus">
.edit
  &__menu-container
    position fixed
    left 40px
    top 50%
    transform translateY(-50%)

</style>
