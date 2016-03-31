<template>
<div class="blueprint-edit-panel__utils__item">
  <!-- <button
    class="btn-floating btn-large waves-effect waves-light tooltipped"
    data-position="left" data-delay="500" data-tooltip="画墙模式"
    :class="mode === 'wall' ? 'yellow darken-2' : 'white'"
    @click="changeMode('wall')"
  >
    <i class="icon-border_style" :class="mode === 'wall' ? 'white-text' : 'black-text'"></i>
  </button>
  <div
    v-show="mode === 'wall'"
    class="blueprint-edit-panel__utils__item__sub-utils"
    transition="slide-right-to-left"
  >
    <button
      v-show="this.configs.wall.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="锁定"
      @click="onToggleWallLockStatus"
    >
      <i class="{{ configs.wall.locked ? 'icon-lock' : 'icon-lock_open' }}"></i>
    </button>
    <button
      v-show="this.configs.wall.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="可见性"
      @click="onToggleWallVisibility"
    >
      <i class="{{ configs.wall.visibility === 'visible' ? 'icon-visibility' : 'icon-visibility_off' }}"></i>
    </button>
  </div> -->
</div>
</template>

<script>
export default {
  name: 'WallMenu'
}
</script>

<style lang="stylus">

</style>