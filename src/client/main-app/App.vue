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
</style>
