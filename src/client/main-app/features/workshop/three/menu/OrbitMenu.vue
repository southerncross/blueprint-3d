<template>
<li>
  <div class="edit-menu__header">
    <button
      class="btn-floating btn-large waves-effect waves-light tooltipped"
      data-position="right" data-delay="500" data-tooltip="上帝视角"
      :class="menuBtnClassName"
      @click="enterOrbit"
    >
      <i class="icon-public" :class="menuIconClassName"></i>
    </button>
  </div>
</li>
</template>

<script>
export default {
  name: 'OrbitMenu',

  props: {
    mode: String,
    enterOrbit: Function
  },

  computed: {
    isOrbitMode: function() {
      return this.mode === 'orbit'
    },
    menuBtnClassName: function() {
      return this.mode === 'orbit' ? 'blue' : 'white'
    },
    menuIconClassName: function() {
      return this.mode === 'orbit' ? 'white-text' : 'black-text'
    }
  }
}
</script>

<style lang="stylus">
</style>
