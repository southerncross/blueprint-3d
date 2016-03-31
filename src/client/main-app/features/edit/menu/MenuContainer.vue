<template>
<div>
  <select-menu
    :mode="mode"
    :set-mode.once="setMode"
    :select-background.once="selectBackground"
    :select-all-walls.once="selectAllWalls"
    :select-all-windows.once="selectAllWindows"
    :select-all-doors.once="selectAllDoors"
    class-name="select"
  >
  </select-menu>
  <!-- <wall-menu></wall-menu>
  <window-menu></window-menu>
  <door-menu></door-menu> -->
  <background-menu
    :mode="mode"
    :svg.once="svg"
    :set-mode.once="setMode"
    :wrap-element-wight-event-handler.once="wrapElementWithEventHandler"
    class-name="background"
  >
  </background-menu>
</div>
</template>

<script>
import SelectMenu from './SelectMenu'
import BackgroundMenu from './BackgroundMenu'
// import DoorMenu from './DoorMenu'
// import WallMenu from './WallMenu'
// import WindowMenu from './WindowMenu'

export default {
  name: 'MenuContainer',

  components: {
    SelectMenu,
    BackgroundMenu
    // DoorMenu,
    // WallMenu,
    // WindowMenu
  },

  props: {
    mode: String,
    svg: Object,
    setMode: Function,
    wrapElementWithEventHandler: Function,
    selectBackground: Function,
    selectAllWalls: Function,
    selectAllWindows: Function,
    selectAllDoors: Function
  }
}
</script>

<style lang="stylus">

</style>