<template>
<li>
  <div class="collapsible-header edit-menu__header">
    <button
      class="btn-floating btn-large waves-effect waves-light tooltipped"
      data-position="right" data-delay="500" data-tooltip="选择模式"
      :class="menuBtnClassName"
      @click="setMode('select')"
    >
      <i class="icon-call_made" :class="menuIconClassName"></i>
    </button>
  </div>
  <div class="collapsible-body edit-menu__body">
    <ul>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="选中所有墙面"
          @click="selectAllWalls"
        >
          <i class="icon-apps white-text yellow darken-2"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="选中所有窗户"
          @click="selectAllWindows"
        >
          <i class="icon-apps white-text blue"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="选中门"
          @click="selectAllDoors"
        >
          <i class="icon-apps white-text green"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="选中背景图"
          @click="selectBackground"
        >
          <i class="icon-apps white-text red"></i>
        </button>
      </li>
    </ul>
  </div>
</li>
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