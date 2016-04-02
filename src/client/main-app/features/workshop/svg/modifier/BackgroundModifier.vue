<template>
<div v-show="show" transition="slide-bottom-to-top">
  <div
    class="background-modifier__element-utils__item"
    transition="fade"
  >
    <span class="range-field">
      <input
        id="blueprint-edit-panel__background__opacity"
        type="range"
        min="0" max="100"
        :value="opacity"
        @input="onBackgroundOpacityChange"
      />
    </span>
  </div>
</div>
</template>

<script>
import {
  updateBackgroundOpacity
} from '../../../../vuex/actions'

export default {
  name: 'BackgroundModifier',

  vuex: {
    getters: {
      opacity: state => state.background.opacity
    },
    actions: {
      updateBackgroundOpacity
    }
  },

  props: {
    show: Boolean
  },

  methods: {
    onBackgroundOpacityChange(event) {
      this.updateBackgroundOpacity(parseFloat(event.target.value) / 100)
    }
  }
}
</script>

<style lang="stylus">

</style>