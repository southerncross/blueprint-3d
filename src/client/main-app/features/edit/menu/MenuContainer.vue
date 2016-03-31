<template>
<div>
<!--   <select-menu></select-menu>
  <wall-menu></wall-menu>
  <window-menu></window-menu>
  <door-menu></door-menu> -->
  <background-menu></background-menu>
</div>
</template>

<script>
import BackgroundMenu from './BackgroundMenu'
// import DoorMenu from './DoorMenu'
// import SelectMenu from './SelectMenu'
// import WallMenu from './WallMenu'
// import WindowMenu from './WindowMenu'

export default {
  name: 'MenuContainer',

  components: {
    BackgroundMenu
    // DoorMenu,
    // SelectMenu,
    // WallMenu,
    // WindowMenu
  }
}
</script>

<style lang="stylus">

</style>