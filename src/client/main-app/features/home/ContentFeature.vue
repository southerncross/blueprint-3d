<template>
<div class="content-feature" v-on:scroll="onScroll">
  <div class="content-feature__padding"></div>
  <div class="content-feature__item">
    <span class="content-feature__item--icon--left icon-magic-wand"></span>
    <div class="content-feature__item--description--right">
      <div class="content-feature__item--description__title">个性化定制</div>
      <div class="content-feature__item--description__sub-title">没有模板，想什么样就什么样</div>
    </div>
  </div>
  <div class="content-feature__line"></div>
  <div class="content-feature__item">
    <div class="content-feature__item--description--left">
      <div class="content-feature__item--description__title">急速生成</div>
      <div class="content-feature__item--description__sub-title">没有建模，轻松掌握</div>
    </div>
    <span class="content-feature__item--icon--right icon-rocket"></span>
  </div>
  <div class="content-feature__line"></div>
  <div class="content-feature__item">
    <span class="content-feature__item--icon--left icon-gift"></span>
    <div class="content-feature__item--description--right">
      <div class="content-feature__item--description__title">便捷分享</div>
      <div class="content-feature__item--description__sub-title">链接、嵌入、离线随意</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ContentFeature',

  data() {
    return {
      showFeatures: [false, false, false]
    }
  },

  methods: {
    onScroll(e) {
      console.error('boring', e)
    }
  },

  ready() {
  },

  beforeDesctory() {
  }
}
</script>

<style lang="stylus">
@import '../../../palette'

feature-height = 100px

$feature-icon
  display inline-block
  width 30%
  height 100%
  padding 0 20px
  line-height feature-height
  font-size 4rem

$feature-description
  display inline-block
  width 70%
  height 100%
  padding 20px

.content-feature
  position relative
  width 100%
  height 600px
  margin-top -1px
  background-color white
  z-index 1

  &__padding
    height 100px
  &__line
    height 1px
    width 60%
    margin 30px auto
    background-color color-grey-lighten-3

  &__item
    position relative
    height feature-height
    width 70%
    margin 0 auto
    color color-grey-darken-2
    &--icon
      &--left
        @extends $feature-icon
        text-align right
      &--right
        @extends $feature-icon
        position absolute
    &--description
      &--left
        @extends $feature-description
        text-align right
      &--right
        @extends $feature-description
        position absolute
      &__title
        font-size 2rem
      &__sub-title
        font-size 1rem
</style>
