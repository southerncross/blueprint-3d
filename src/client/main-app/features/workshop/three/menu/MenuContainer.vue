<template>
<ul class="collapsible menu-container" data-collapsible="accordion">
  <orbit-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"></orbit-menu>
  <roam-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"></roam-menu>
</ul>
</template>

<script>
import OrbitMenu from './OrbitMenu'
import RoamMenu from './RoamMenu'

export default {
  name: 'MenuContainer',

  components: {
    OrbitMenu,
    RoamMenu
  },

  props: {
    mode: String,
    setMode: Function
  }
}
</script>

<styl lang="stylus">
</styl>