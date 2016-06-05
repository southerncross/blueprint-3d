<template>
<div class="home">
  <topbar></topbar>
  <content></content>
</div>
</template>

<script>
import Topbar from './Topbar'
import Content from './Content'

export default {
  name: 'Home',

  components: {
    Topbar,
    Content
  }
}
</script>

<style lang="stylus">
  .home
    height 100vh
    overflow-y hidden
</style>
