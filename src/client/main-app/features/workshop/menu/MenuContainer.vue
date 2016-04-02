<template>
<ul class="collapsible menu-container" data-collapsible="accordion">
  <select-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"
    :select-background.once="selectBackground"
    :select-all-walls.once="selectAllWalls"
    :select-all-windows.once="selectAllWindows"
    :select-all-doors.once="selectAllDoors"></select-menu>
  <wall-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"></wall-menu>
  <window-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"></window-menu>
  <door-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"></door-menu>
  <background-menu
    class="menu-item"
    :mode="mode"
    :svg.once="svg"
    :set-mode.once="setMode"
    :wrap-element-wight-event-handler.once="wrapElementWithEventHandler"></background-menu>
</ul>
</template>

<script>
import SelectMenu from './SelectMenu'
import WallMenu from './WallMenu'
import BackgroundMenu from './BackgroundMenu'
import WindowMenu from './WindowMenu'
import DoorMenu from './DoorMenu'

export default {
  name: 'MenuContainer',

  components: {
    SelectMenu,
    WallMenu,
    WindowMenu,
    DoorMenu,
    BackgroundMenu
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
@require './edit-menu.styl'

.menu-container
  border 0
  box-shadow none

.menu-item
  margin 20px 0
</style>