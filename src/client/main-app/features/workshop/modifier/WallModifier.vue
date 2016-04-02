<template>
<div v-show="show" transition="slide-bottom-to-top">
  <div
    class="wall-modifier__element-utils__item"
    transition="fade"
  >
  </div>
</div>
</template>

<script>
export default {
  name: 'WallModifier',

  props: {
    show: Boolean
  }
}
</script>

<style lang="stylus">

</style>