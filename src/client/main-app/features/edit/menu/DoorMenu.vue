<template>
<div class="blueprint-edit-panel__utils__item">
  <!-- <button
    class="btn-floating btn-large waves-effect waves-light tooltipped"
    data-position="left" data-delay="500" data-tooltip="画门模式"
    :class="mode === 'door' ? 'green' : 'white'"
    @click="changeMode('door')"
  >
    <i class="icon-directions_run" :class="mode === 'door' ? 'white-text' : 'black-text'"></i>
  </button>
  <div
    v-show="mode === 'door'"
    class="blueprint-edit-panel__utils__item__sub-utils"
    transition="slide-right-to-left"
  >
    <button
      v-show="this.configs.door.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="锁定"
      @click="onToggleDoorLockStatus"
    >
      <i class="{{ configs.door.locked ? 'icon-lock' : 'icon-lock_open' }}"></i>
    </button>
    <button
      v-show="this.configs.door.count > 0"
      class="waves-effect waves-teal btn-flat tooltipped"
      data-position="right" data-delay="0" data-tooltip="可见性"
      @click="onToggleDoorVisibility"
    >
      <i class="{{ configs.door.visibility === 'visible' ? 'icon-visibility' : 'icon-visibility_off' }}"></i>
    </button>
  </div> -->
</div>
</template>

<script>
export default {
  name: 'DoorMenu'
}
</script>

<style lang="stylus">

</style>