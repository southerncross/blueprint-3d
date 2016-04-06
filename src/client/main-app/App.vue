<template>
<div>
  <router-view></router-view>
</div>
</template>

<script>
import store from './vuex/store'

export default {
  name: 'App',

  store,

  data() {
    return {
      user: {}
    }
  },

  ready() {
    this.user = window['blueprint-3d'].data
  }
}
</script>

<style lang="stylus">
body
  overflow hidden

// Debug boring
.dg.ac
  top 100px
  & .cr.string input[type=text]
    height auto
  & .cr.number input[type=text]
    height auto

.hue-field, .dg .c
  box-sizing content-box
</style>
