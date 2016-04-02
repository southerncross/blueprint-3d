<template>
<div>
  <topbar></topbar>
  <content></content>
  <bottom></bottom>
</div>
</template>

<script>
import Topbar from './Topbar'
import Content from './Content'
import Bottom from './Bottom'

export default {
  name: 'Home',

  components: {
    Topbar,
    Content,
    Bottom
  }
}
</script>

<style lang="stylus"></style>
