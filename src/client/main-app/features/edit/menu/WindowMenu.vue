<template>
<div class="blueprint-edit-panel__utils__item">
  <!-- <button
    class="btn-floating btn-large waves-effect waves-light tooltipped"
    data-position="left" data-delay="500" data-tooltip="画窗模式"
    :class="mode === 'window' ? 'blue' : 'white'"
    @click="changeMode('window')"
  >
    <i class="icon-wb_sunny" :class="mode === 'window' ? 'white-text' : 'black-text'"></i>
  </button>
  <div
    v-show="mode === 'window'"
    class="blueprint-edit-panel__utils__item__sub-utils"
    transition="slide-right-to-left"
  >
    <button
      v-show="this.configs.window.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="锁定"
      @click="onToggleWindowLockStatus"
    >
      <i class="{{ configs.window.locked ? 'icon-lock' : 'icon-lock_open' }}"></i>
    </button>
    <button
      v-show="this.configs.window.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="可见性"
      @click="onToggleWindowVisibility"
    >
      <i class="{{ configs.window.visibility === 'visible' ? 'icon-visibility' : 'icon-visibility_off' }}"></i>
    </button>
  </div> -->
</div>
</template>

<script>
export default {
  name: 'WindowMenu'
}
</script>

<style lang="stylus">

</style>