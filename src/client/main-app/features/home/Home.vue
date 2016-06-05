<template>
<div class="home">
  <topbar></topbar>
  <content-image></content-image>
  <content-feature></content-feature>
  <bottom></bottom>
</div>
</template>

<script>
import Topbar from './Topbar'
import ContentImage from './ContentImage'
import ContentFeature from './ContentFeature'
import Bottom from './Bottom'

export default {
  name: 'Home',

  components: {
    Topbar,
    ContentImage,
    ContentFeature,
    Bottom
  }
}
</script>

<style lang="stylus">
  .home
    height 100vh
    overflow-y auto
</style>
