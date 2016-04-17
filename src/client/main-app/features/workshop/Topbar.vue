<template>
<div class="navbar-fixed workshop__top-bar">
  <nav>
    <div class="nav-wrapper cyan">
      <a v-link="{ name: 'home' }"><span class="icon-cube logo"></span></a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a v-link="{ name: 'gallery' }">我的作品</a></li>
        <li><a v-link="{ name: 'create' }">新建作品</a></li>
      </ul>
    </div>
  </nav>
</div>
</template>

<script>
export default {
  name: 'Topbar'
}
</script>

<style lang="stylus">
.logo
  font-size x-large
  vertical-align middle

.workshop__top-bar
  position fixed
  left 0
  top 0

.nav-wrapper
  padding 0 2%
</style>
