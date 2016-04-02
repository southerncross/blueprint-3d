<template>
<div>
  <wall-modifier :show="showWallModifier"></wall-modifier>
  <window-modifier :show="showWindowModifier"></window-modifier>
  <door-modifier :show="showDoorModifier"></door-modifier>
  <background-modifier :show="showBackgroundModifier"></background-modifier>
</div>
</template>

<script>
import WallModifier from './WallModifier'
import DoorModifier from './DoorModifier'
import WindowModifier from './WindowModifier'
import BackgroundModifier from './BackgroundModifier'

export default {
  name: 'ModifierContainer',

  components: {
    WallModifier,
    DoorModifier,
    WindowModifier,
    BackgroundModifier
  },

  props: {
    selectMode: String
  },

  computed: {
    showWallModifier: function() {
      return this.selectMode === 'wall'
    },
    showWindowModifier: function() {
      return this.selectMode === 'window'
    },
    showDoorModifier: function() {
      return this.selectMode === 'door'
    },
    showBackgroundModifier: function() {
      return this.selectMode === 'background'
    }
  }
}
</script>

<style lang="stylus">

</style>