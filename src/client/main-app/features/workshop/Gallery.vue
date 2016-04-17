<template>
<div class="gallery">
  <ul v-if="works.length > 0">
    <li v-for="work in works">
      <div>{{ work.name }}</div>
      <div>{{ work.description }}</div>
      <a class="waves-effect waves-teal btn-flat" v-link="{ name: 'edit', params: { id: work.id }}"><span class="icon-edit"></span></a>
      <button class="waves-effect waves-teal btn-flat" @click="deleteWork(work.id)"><span class="icon-delete"></span></button>
    </li>
  </ul>
  <div v-else>
    还没有任何作品<a v-link="{ name: 'create' }">现在去创建</a>
  </div>
</div>
</template>

<script>
import Materialize from 'Materialize'

import { localStorageAvailable } from '../../libs/utils'

export default {
  name: 'Gallery',

  data() {
    let entities = {}
    if (localStorageAvailable()) {
      entities = JSON.parse(window.localStorage.getItem('blueprintWorks')) || {}
    }
    const works = Object.keys(entities).map((id) => entities[id])

    return {
      works
    }
  },

  methods: {
    deleteWork(id) {
      const entities = JSON.parse(window.localStorage.getItem('blueprintWorks')) || {}
      if (!entities[id]) {
        return
      }
      delete entities[id]
      this.works = Object.keys(entities).map((id) => entities[id])
      window.localStorage.setItem('blueprintWorks', JSON.stringify(entities))
      Materialize.toast('删除成功', 2000)
    }
  }
}
</script>

<style lang="stylus">
.gallery
  margin-top 20%
  margin-left 5%
</style>
