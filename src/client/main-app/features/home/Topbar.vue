<template>
<nav class="topbar">
  <div class="nav-wrapper cyan">
    <a v-link="{ name: 'home' }"><span class="icon-cube logo"></span></a>
    <ul id="nav-mobile" class="right hide-on-med-and-down">
      <li>
        <a v-link="{ name: 'workshop' }">工作台</a>
      </li>
    </ul>
  </div>
</nav>
</template>

<script>
export default {
  name: 'Topbar'
}
</script>

<style lang="stylus">
@require '../../../palette'

.topbar
  height 64px

.logo
  font-size x-large
  vertical-align middle

.nav-wrapper
  padding 0 2%
</style>
