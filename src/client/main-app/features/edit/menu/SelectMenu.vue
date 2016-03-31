<template>
<div>
  <button
    class="btn-floating btn-large waves-effect waves-light tooltipped"
    data-position="left" data-delay="500" data-tooltip="选择模式"
    :class="menuBtnClassName"
    @click="setMode('select')"
  >
    <i class="icon-call_made" :class="menuIconClassName"></i>
  </button>
  <div
    v-show="show"
    class="select-menu__utils__item__sub-utils"
    transition="slide-right-to-left"
  >
    <button
      v-show="hasWall"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="选中所有墙面"
      @click="selectAllWalls"
    >
      <i class="icon-apps white-text yellow darken-2"></i>
    </button>
    <button
      v-show="hasWindow"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="选中所有窗户"
      @click="selectAllWindows"
    >
      <i class="icon-apps white-text blue"></i>
    </button>
    <button
      v-show="hasDoor"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="选中门"
      @click="selectAllDoors"
    >
      <i class="icon-apps white-text green"></i>
    </button>
    <button
      v-show="hasBackground"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="选中背景图"
      @click="selectBackground"
    >
      <i class="icon-apps white-text red"></i>
    </button>
  </div>
</div>
</template>

<script>
export default {
  name: 'SelectMenu',

  vuex: {
    getters: {
      hasBackground: state => state.background.count > 0,
      hasWall: state => state.wall.count > 0,
      hasWindow: state => state.window.count > 0,
      hasDoor: state => state.window.count > 0
    }
  },

  props: {
    mode: String,
    setMode: Function,
    selectBackground: Function,
    selectAllWalls: Function,
    selectAllWindows: Function,
    selectAllDoors: Function
  },

  computed: {
    show: function() {
      return this.mode === 'select'
    },
    menuBtnClassName: function() {
      return this.mode === 'select' ? 'purple' : 'white'
    },
    menuIconClassName: function() {
      return this.mode === 'select' ? 'white-text' : 'black-text'
    }
  }
}
</script>

<style lang="stylus">

</style>