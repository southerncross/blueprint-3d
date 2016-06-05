<template>
<div class="content-image">
  <div class="content-image__title__container">
    <div class="content-image__title">图样3D</div>
    <div class="content-image__title__sub">让虚拟展示从此不再困难</div>
  </div>
  <img
    v-if="show"
    transition="show-screenshot"
    class="content-image__screenshot--middle"
    src="/images/screenshot_1.png"/>
  <img
    v-if="show"
    transition="show-screenshot--left"
    class="content-image__screenshot--left"
    src="/images/screenshot_2.png"/>
  <img
    v-if="show"
    transition="show-screenshot--right"
    class="content-image__screenshot--right"
    src="/images/screenshot_3.png"/>
</div>
</template>

<script>
export default {
  name: 'ContentImage',

  data() {
    return {
      show: false
    }
  },

  ready() {
    this.show = true
  }
}
</script>

<style lang="stylus">
@import '../../../palette'

.show-screenshot-transition
  transition all 0.3s ease
  opacity 1

.show-screenshot-enter, .show-screenshot-leave
  opacity 0
  transform translateX(-50%)

.show-screenshot--left-transition
  transition all 0.7s ease
  transform translate(-70%, 20%)
  opacity 1

.show-screenshot--left-enter, .show-screenshot--left-leave
  opacity 0
  transform translate(-50%, 20%)

.show-screenshot--right-transition
  transition all 0.7s ease
  transform translate(-30%, 20%)
  opacity 1

.show-screenshot--right-enter, .show-screenshot--right-leave
  opacity 0
  transform translate(-50%, 20%)


$screenshot
  position absolute
  left 50%
  bottom 0
  width 50%
  box-shadow 0px 0px 20px 2px rgba(0, 0, 0, 0.5)

$title
  color white
  text-shadow 0px 0px 5px rgba(150, 150, 150, 1)

.content-image
  position relative
  width 100%
  height calc(100vh - 64px)
  background-color color-cyan

  &__title
    &__container
      position absolute
      left 50%
      top 5%
      transform translateX(-50%)
      text-align center
    &
      @extends $title
      font-size 3rem
    &__sub
      @extends $title
      font-size 2rem

  &__screenshot
    &--middle
      @extends $screenshot
      transform translateX(-50%)
      z-index 1
    &--left
      @extends $screenshot
      z-index 0
      animation 0.2s move-left ease-in forwards
    &--right
      @extends $screenshot
      z-index 0
      animation 0.2s move-right ease-in forwards
</style>
