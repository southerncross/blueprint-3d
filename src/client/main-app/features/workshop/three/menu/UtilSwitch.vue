<template>
<li>
  <div class="edit-menu__header">
    <span class="util-switch__title">{{display}}</span>
    <div class="switch text-cyan menu-switch">
      <label>
        关
        <input type="checkbox" :checked="status" @click="toggle">
        <span class="lever"></span>
        开
      </label>
    </div>
  </div>
</li>
</template>

<script>
export default {
  name: 'UtilSwitch',

  props: {
    display: String,
    status: Boolean,
    toggle: Function
  }
}
</script>

<style lang="stylus">
.menu-switch
  margin-left -28px

.util-switch__title
  text-shadow 0px 0px 5px white
</style>
