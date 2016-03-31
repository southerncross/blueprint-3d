<template>
  <div>
    <nav-column class="app__nav-column" :user="user"></nav-column>
    <div class="app__main-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavColumn from './layout/NavColumn'
import store from './vuex/store'

export default {
  name: 'App',

  store,

  components: {
    NavColumn
  },

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
nav-column-width = 80px

.app
  &__nav-column
    position fixed
    left 0
    top 0
    z-index 50
    width nav-column-width
    height 100%
  &__main-view
    margin-left nav-column-width
</style>
