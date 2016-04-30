<template>
<div>
  <topbar></topbar>
  <router-view></router-view>
</div>
</template>

<script>
import request from 'superagent'
import Topbar from './Topbar'
import { fetchBlueprints } from '../../vuex/actions'

export default {
  name: 'Workshop',

  vuex: {
    actions: {
      fetchBlueprints
    }
  },

  components: {
    Topbar
  },

  ready() {
    request
    .get('/api/blueprints')
    .end((err, res) => {
      if (err || !res || !res.ok) {
        console.error(err)
        return
      }
      this.fetchBlueprints(res.body)
    })
  }
}
</script>

<style lang="stylus">
</style>
