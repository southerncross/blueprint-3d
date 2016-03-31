<template>
<div>
  <select-menu
    :mode="mode"
    :set-mode.once="setMode"
    :select-background.once="selectBackground"
    :select-all-walls.once="selectAllWalls"
    :select-all-windows.once="selectAllWindows"
    :select-all-doors.once="selectAllDoors"
  >
  </select-menu>
  <wall-menu
    :mode="mode"
    :set-mode.once="setMode"
  >
  </wall-menu>
  <window-menu
    :mode="mode"
    :set-mode.once="setMode"
  >
  </window-menu>
  <!-- <door-menu></door-menu> -->
  <background-menu
    :mode="mode"
    :svg.once="svg"
    :set-mode.once="setMode"
    :wrap-element-wight-event-handler.once="wrapElementWithEventHandler"
  >
  </background-menu>
</div>
</template>

<script>
import SelectMenu from './SelectMenu'
import WallMenu from './WallMenu'
import BackgroundMenu from './BackgroundMenu'
import WindowMenu from './WindowMenu'
// import DoorMenu from './DoorMenu'

export default {
  name: 'MenuContainer',

  components: {
    SelectMenu,
    WallMenu,
    WindowMenu,
    BackgroundMenu
    // DoorMenu,
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