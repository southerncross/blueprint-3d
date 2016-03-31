<template>
<div>
  <background-modifier></background-modifier>
  <wall-modifier></wall-modifier>
  <window-modifier></window-modifier>
  <door-modifier></door-modifier>
</div>
</template>

<script>
import BackgroundModifier from './BackgroundModifier'
import DoorModifier from './DoorModifier'
import WallModifier from './WallModifier'
import WindowModifier from './WindowModifier'

export default {
  name: 'ModifierContainer',

  components: {
    BackgroundModifier,
    DoorModifier,
    WallModifier,
    WindowModifier
  }
}
</script>

<style lang="stylus">

</style>