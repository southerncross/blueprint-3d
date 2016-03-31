<template>
<div v-show="elementUtilsType === 'background'" transition="slide-bottom-to-top">
  <div
    class="blueprint-edit-panel__element-utils__item"
    transition="fade"
  >
    <span class="range-field">
      <input
        id="blueprint-edit-panel__background__opacity"
        type="range"
        min="0" max="100"
        v-model="configs.background.opacity"
        @input="onBackgroundImgOpacityChange"
      />
    </span>
  </div>
</div>
</template>

<script>
export default {
  name: 'BackgroundModifier'
}
</script>

<style lang="stylus">

</style>