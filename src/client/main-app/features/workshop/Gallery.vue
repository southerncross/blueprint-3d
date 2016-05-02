<template>
<div class="gallery">
  <div v-show="remoteBlueprints.length > 0">
    <div>云端图样</div>
    <ul>
      <li v-for="blueprint in remoteBlueprints">
        <div>{{ blueprint.name }}</div>
        <div>{{ blueprint.description }}</div>
        <a class="waves-effect waves-teal btn-flat" v-link="{ name: 'edit', params: { id: blueprint.localId }}"><span class="icon-edit"></span></a>
        <button class="waves-effect waves-teal btn-flat" @click="requestDelete(blueprint)"><span class="icon-delete"></span></button>
      </li>
    </ul>
  </div>

  <div v-show="localBlueprints.length > 0">
    <div>本地图样</div>
    <ul>
      <li v-for="blueprint in localBlueprints">
        <div>{{ blueprint.name }}</div>
        <div>{{ blueprint.description }}</div>
        <a class="waves-effect waves-teal btn-flat" v-link="{ name: 'edit', params: { id: blueprint.localId }}"><span class="icon-edit"></span></a>
        <button class="waves-effect waves-teal btn-flat" @click="requestDelete(blueprint)"><span class="icon-delete"></span></button>
      </li>
    </ul>
  </div>

  <div v-show="remoteBlueprints.length === 0 && localBlueprints.length === 0">
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
        @click="requestSync">确认</button>
      <button
        class="modal-action modal-close waves-effect waves-green btn-flat"
        @click="closeSyncModal">取消</button>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'jquery'
import Materialize from 'Materialize'

import request from '../../requests/requests'
import {
  replaceBlueprints,
  syncBlueprints,
  deleteBlueprints
} from '../../vuex/actions'

export default {
  name: 'Gallery',

  vuex: {
    actions: {
      replaceBlueprints,
      syncBlueprints,
      deleteBlueprints
    },
    getters: {
      remoteBlueprints: state => Object.keys(state.blueprint.remoteEntities).map(key => state.blueprint.remoteEntities[key]),
      localBlueprints: state => Object.keys(state.blueprint.localEntities).map(key => state.blueprint.localEntities[key]),
      hasLogin: state => Object.keys(state.user).length > 0
    }
  },

  methods: {
    requestDelete(blueprint) {
      if (this.hasLogin && blueprint.id) {
        // Delete blueprint remotely
        request.deleteBlueprint(blueprint)
        .then(() => {
          this.deleteBlueprints(blueprint)
          Materialize.toast('删除成功', 200)
        })
        .catch((err) => {
          console.log(err)
          Materialize.toast(`删除失败: ${err}`)
        })
      } else {
        // Delete blueprint locally
        this.deleteBlueprints(blueprint)
        Materialize.toast('删除成功', 2000)
      }
    },
    requestSync() {
      request.saveBlueprints(this.localBlueprints)
      .then((savedBlueprints) => {
        this.syncBlueprints(this.localBlueprints)
        Materialize.toast('同步成功', 3000, 'rounded')
      })
      .catch((err) => {
        Materialize.toast(`同步失败：${err}`, 3000, 'rounded')
      })
    },
    requestFetch() {
      request.fetchBlueprints()
      .then((blueprints) => {
        this.replaceBlueprints(blueprints)
        // Prompt user that he/she has some blueprints need to be synced.
        if (this.localBlueprints.length > 0) {
          $('#sync-modal').openModal()
        }
      })
      .catch((err) => {
        console.error(err)
      })
    },
    closeSyncModal() {
      $('#sync-modal').closeModal()
    }
  },

  ready() {
    if (this.hasLogin) {
      this.requestFetch()
    }
  }
}
</script>

<style lang="stylus">
.gallery
  margin-top 20%
  margin-left 5%
</style>
