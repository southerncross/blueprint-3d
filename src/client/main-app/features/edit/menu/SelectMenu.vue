<template>
<div class="blueprint-edit-panel__utils__item">
  <!-- <button
    class="btn-floating btn-large waves-effect waves-light tooltipped"
    data-position="left" data-delay="500" data-tooltip="选择模式"
    :class="mode === 'select' ? 'purple' : 'white'"
    @click="mode = 'select'"
  >
    <i class="icon-call_made" :class="mode === 'select' ? 'white-text' : 'black-text'"></i>
  </button>
  <div
    v-show="mode === 'select'"
    class="blueprint-edit-panel__utils__item__sub-utils"
    transition="slide-right-to-left"
  >
    <button
      v-show="this.configs.wall.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="选中所有墙面"
      @click="onSelectAllWalls"
    >
      <i class="icon-apps white-text yellow darken-2"></i>
    </button>
    <button
      v-show="this.configs.window.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="选中所有窗户"
      @click="onSelectAllWindows"
    >
      <i class="icon-apps white-text blue"></i>
    </button>
    <button
      v-show="this.configs.door.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="选中门"
      @click="onSelectAllDoors"
    >
      <i class="icon-apps white-text green"></i>
    </button>
    <button
      v-show="this.configs.background.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="选中背景图"
      @click="onSelectBackgroundImg"
    >
      <i class="icon-apps white-text red"></i>
    </button>
  </div> -->
</div>
</template>

<script>
export default {
  name: 'SelectMenu'
}
</script>

<style lang="stylus">

</style>