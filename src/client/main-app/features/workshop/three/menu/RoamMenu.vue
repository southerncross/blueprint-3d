<template>
<li>
  <div class="edit-menu__header">
    <button
      class="btn-floating btn-large waves-effect waves-light tooltipped"
      data-position="right" data-delay="500" data-tooltip="漫游视角"
      :class="menuBtnClassName"
      @click="enterRoam"
    >
      <i class="icon-accessibility" :class="menuIconClassName"></i>
    </button>
  </div>
</li>
</template>

<script>
export default {
  name: 'RoamMenu',

  props: {
    mode: String,
    enterRoam: Function
  },

  computed: {
    isRoamMode: function() {
      return this.mode === 'roam'
    },
    menuBtnClassName: function() {
      return this.mode === 'roam' ? 'red' : 'white'
    },
    menuIconClassName: function() {
      return this.mode === 'roam' ? 'white-text' : 'black-text'
    }
  }
}
</script>

<style lang="stylus">
</style>
