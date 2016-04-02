<template>
<ul class="collapsible menu-container" data-collapsible="accordion">
  <select-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"
    :select-control.once="selectControl"
    :svg-event-control.once="svgEventControl"
    :elem-event-control.once="elemEventControl"></select-menu>
  <wall-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"
    :svg-event-control.once="svgEventControl"
    :elem-event-control.once="elemEventControl"></wall-menu>
  <window-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"
    :svg-event-control.once="svgEventControl"
    :elem-event-control.once="elemEventControl"></window-menu>
  <door-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"
    :svg-event-control.once="svgEventControl"
    :elem-event-control.once="elemEventControl"></door-menu>
  <background-menu
    class="menu-item"
    :mode="mode"
    :svg.once="svg"
    :set-mode.once="setMode"
    :svg-event-control.once="svgEventControl"
    :elem-event-control.once="elemEventControl"></background-menu>
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
    selectControl: Object,
    elemEventControl: Object,
    svgEventControl: Object,
    setMode: Function,
    wrapElementWithEventHandler: Function
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