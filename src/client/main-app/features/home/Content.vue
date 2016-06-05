<template>
<div class="content">
  <div class="content__title__container">
    <div class="content__title">图样3D</div>
    <div class="content__title__sub">人人都能制作虚拟展示</div>
    <a class="btn waves-effect waves-light white grey-text darken-4-text content__title__start" v-link="{ name: 'create' }">
      Let's have fun!<span class="icon-wink2 content__title__start__icon"></span>
    </a>
  </div>
  <img
    v-if="show"
    transition="show-screenshot"
    class="content__screenshot--middle"
    src="/images/screenshot_1.png"/>
  <img
    v-if="show"
    transition="show-screenshot--left"
    class="content__screenshot--left"
    src="/images/screenshot_2.png"/>
  <img
    v-if="show"
    transition="show-screenshot--right"
    class="content__screenshot--right"
    src="/images/screenshot_3.png"/>
</div>
</template>

<script>
export default {
  name: 'Content',

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
  max-width 650px
  min-width 600px
  border-radius 2px
  box-shadow 0px 0px 20px 2px rgba(0, 0, 0, 0.5)

$title
  color white
  text-shadow 0px 0px 5px rgba(150, 150, 150, 1)

.content
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
    &__start
      margin-top 50px
      &__icon
        margin-left 10px

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
