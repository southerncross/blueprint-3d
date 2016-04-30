<template>
<div class="gallery">
  <ul v-if="mergedBlueprints.length > 0">
    <li v-for="blueprint in mergedBlueprints">
      <div>{{ blueprint.name }}</div>
      <div>{{ blueprint.description }}</div>
      <a class="waves-effect waves-teal btn-flat" v-link="{ name: 'edit', params: { id: blueprint.id }}"><span class="icon-edit"></span></a>
      <button class="waves-effect waves-teal btn-flat" @click="deleteBlueprint(blueprint.id)"><span class="icon-delete"></span></button>
    </li>
  </ul>
  <div v-else>
    还没有任何作品<a v-link="{ name: 'create' }">现在去创建</a>
  </div>

  <!-- Modal Structure -->
  <div id="sync-modal" class="modal bottom-sheet">
    <div class="modal-content">
      <h4>检测到当前有未同步的变动，需要同步吗？</h4>
    </div>
    <div class="modal-footer">
      <button
        class="modal-action modal-close waves-effect waves-green btn-flat"
        @click="syncBlueprints">确认</button>
      <button
        class="modal-action modal-close waves-effect waves-green btn-flat"
        @click="closeSyncModal">取消</button>
    </div>
  </div>
</div>
</template>

<script>
import request from 'superagent'
import $ from 'jquery'
import Materialize from 'Materialize'

export default {
  name: 'Gallery',

  vuex: {
    getters: {
      remoetBlueprintEntities: state => state.blueprints.entities,
      remoteBlueprints: state => Object.keys(state.blueprints.entities).map(key => state.blueprints.entities[key]),
      hasLogin: state => Object.keys(state.user).length > 0
    }
  },

  data() {
    const entities = JSON.parse(window.localStorage.getItem('blueprintWorks')) || {}
    const localBlueprints = Object.keys(entities).map((id) => entities[id])

    const mergedEntities = Object.assign({}, entities, this.remoetBlueprintEntities)
    const mergedBlueprints = Object.keys(mergedEntities).map((id) => mergedEntities[id])

    return {
      localBlueprints,
      mergedBlueprints
    }
  },

  methods: {
    deleteBlueprint(id) {
      const entities = JSON.parse(window.localStorage.getItem('blueprintWorks')) || {}
      if (!entities[id]) {
        return
      }
      delete entities[id]
      this.localBlueprints = Object.keys(entities).map((id) => entities[id])
      window.localStorage.setItem('blueprintWorks', JSON.stringify(entities))
      Materialize.toast('删除成功', 2000)
    },
    syncBlueprints() {
      request
      .post('/api/blueprints')
      .send(({ blueprints: this.localBlueprints }))
      .end((err, res) => {
        if (err || !res || !res.ok) {
          console.log(err)
          Materialize.toast(`同步失败：${err}`, 3000, 'rounded')
          return
        }
        Materialize.toast('同步成功', 3000, 'rounded')
      })
    },
    closeSyncModal() {
      $('#sync-modal').closeModal()
    }
  },

  ready() {
    console.error('boring', this.hasLogin, this.remoteBlueprints.length, this.localBlueprints.length)
    if (this.hasLogin && this.remoteBlueprints.length !== this.localBlueprints.length) {
      $('#sync-modal').openModal()
    }
  }
}
</script>

<style lang="stylus">
.gallery
  margin-top 20%
  margin-left 5%
</style>
