<template>
<li>
  <div class="edit-menu__header">
    <div class="switch text-cyan menu-switch">
      <label>
        Off
        <input type="checkbox" :checked="anaglyphEffect" @click="toggleAnaglyphEffect">
        <span class="lever"></span>
        On
      </label>
    </div>
  </div>
</li>
</template>

<script>
export default {
  name: 'AnaglyphSwitch',

  props: {
    anaglyphEffect: Boolean,
    toggleAnaglyphEffect: Function
  }
}
</script>

<style lang="stylus">
.menu-switch
  margin-left -28px
</style>
