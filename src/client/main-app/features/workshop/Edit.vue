<template>
<div>
  <div class="switch text-cyan edit__switch">
    <label>
      3D
      <input type="checkbox" :checked="mode === 'svg'" @click="toggleMode">
      <span class="lever"></span>
      2D
    </label>
  </div>
  <svg-panel
    v-show="showSvgPanel()"
    transition="fade"
    :svg.once="svg"></svg-panel>
  <three-panel
    v-if="showThreePanel()"
    transition="fade"
    :svg.once="svg"></three-panel>
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
@import '../../transition'

.edit
  &__menu-container
    position fixed
    left 40px
    top 50%
    transform translateY(-50%)
  &__switch
    position absolute
    top 100px
    left 10px

</style>
