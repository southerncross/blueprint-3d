<template>
<div>
  <topbar></topbar>
  <router-view></router-view>
</div>
</template>

<script>
import Topbar from './Topbar'

export default {
  name: 'Workshop',

  components: {
    Topbar
  }
}
</script>

<style lang="stylus">
</style>
