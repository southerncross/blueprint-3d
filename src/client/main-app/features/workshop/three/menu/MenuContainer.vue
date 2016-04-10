<template>
<ul class="collapsible menu-container" data-collapsible="accordion">
  <orbit-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"></orbit-menu>
  <roam-menu
    class="menu-item"
    :mode="mode"
    :set-mode.once="setMode"
    :toggle-anaglyph-effect.once="toggleAnaglyphEffect"
    :toggle-vr-effect.once="toggleVrEffect"></roam-menu>
  <anaglyph-switch
    class="menu-item"
    :anaglyph-effect="anaglyphEffect"
    :toggle-anaglyph-effect.once="toggleAnaglyphEffect"
    ></anaglyph-switch>
</ul>
</template>

<script>
import OrbitMenu from './OrbitMenu'
import RoamMenu from './RoamMenu'
import AnaglyphSwitch from './AnaglyphSwitch'

export default {
  name: 'MenuContainer',

  components: {
    OrbitMenu,
    RoamMenu,
    AnaglyphSwitch
  },

  props: {
    mode: String,
    setMode: Function,
    anaglyphEffect: Boolean,
    toggleAnaglyphEffect: Function,
    toggleVrEffect: Function
  }
}
</script>

<styl lang="stylus">
</styl>