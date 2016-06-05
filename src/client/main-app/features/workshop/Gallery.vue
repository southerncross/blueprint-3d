<template>
<div class="gallery">
  <div v-show="remoteBlueprints.length > 0">
    <div class="gallery__title">
      <span class="icon-cloud_queue"></span>
      云端图样({{remoteBlueprints.length}})
    </div>
    <div class="row">
      <div class="col s12 m3" v-for="blueprint in remoteBlueprints">
        <div class="gallery__item card">
          <div class="gallery__item__title__container">
            <div class="gallery__item__title">{{ blueprint.name }}</div>
            <div class="gallery__item__title__sub">{{ blueprint.description }}</div>
            <div class="gallery__item__title__created-at">创建于{{formatDate(blueprint.createdAt)}}</div>
          </div>
          <div class="gallery__item__content">
            <a
              class="waves-effect waves-teal btn-flat gallery__item__content__action"
              v-link="{ name: 'edit', params: { localId: blueprint.localId }}">
              <span class="icon-edit"></span></a>
            <button
              v-if="blueprint.accessToken && blueprint.accessToken.valid"
              class="waves-effect waves-teal btn-flat gallery__item__content__action"
              @click="requestDeshare(blueprint)"><span class="icon-visibility"></span></button>
            <button
              v-else
              class="waves-effect waves-teal btn-flat gallery__item__content__action"
              @click="requestShare(blueprint)"><span class="icon-visibility_off"></span></button>
            <button class="waves-effect waves-teal btn-flat gallery__item__content__action" @click="downloadBlueprint(blueprint)"><span class="icon-file_download"></span></button>
            <button
              class="waves-effect waves-teal btn-flat gallery__item__content__action"
              @click="requestDelete(blueprint)"><span class="icon-delete"></span></button>
          </div>
          <div class="gallery__item__share-link__container" v-if="blueprint.shareLink">
            <a class="gallery__item__share-link" target="_blank" v-link="blueprint.shareLink">
              {{blueprint.shareLink}}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-show="localBlueprints.length > 0">
    <div class="gallery__title">
      <span class="icon-local_bar"></span>
      本地图样({{localBlueprints.length}})
    </div>
    <div class="row">
      <div class="col s12 m3" v-for="blueprint in localBlueprints">
        <div class="gallery__item card">
          <div class="gallery__item__title__container">
            <div class="gallery__item__title">{{ blueprint.name }}</div>
            <div class="gallery__item__title__sub">{{ blueprint.description }}</div>
          </div>
          <div class="gallery__item__content">
            <a class="waves-effect waves-teal btn-flat gallery__item__content__action" v-link="{ name: 'edit', params: { localId: blueprint.localId }}"><span class="icon-edit"></span></a>
            <button class="waves-effect waves-teal btn-flat gallery__item__content__action" @click="downloadBlueprint(blueprint)"><span class="icon-file_download"></span></button>
            <button class="waves-effect waves-teal btn-flat gallery__item__content__action" @click="requestDelete(blueprint)"><span class="icon-delete"></span></button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="gallery__empty-hint__container" v-show="remoteBlueprints.length === 0 && localBlueprints.length === 0">
    <div class="gallery__empty-hint__icon"><span class="icon-shocked"></span></div>
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
import moment from 'moment'
import 'moment/locale/zh-cn'

import request from '../../requests/requests'
import exportBlueprint from '../../libs/exportBlueprint'
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
    requestShare(blueprint) {
      request.shareBlueprint(blueprint)
      .then((accessToken) => {
        blueprint.accessToken = accessToken
        this.replaceBlueprints(blueprint)
        Materialize.toast('操作成功', 2000)
      })
      .catch((err) => {
        Materialize.toast(`操作失败: ${err}`, 2000)
      })
    },
    requestDeshare(blueprint) {
      request.deshareBlueprint(blueprint)
      .then((accessToken) => {
        blueprint.accessToken = accessToken
        this.replaceBlueprints(blueprint)
        Materialize.toast('操作成功', 2000)
      })
      .catch((err) => {
        Materialize.toast(`操作失败: ${err}`, 2000)
      })
    },
    closeSyncModal() {
      $('#sync-modal').closeModal()
    },
    formatDate(date) {
      return moment(date).format('L')
    },
    downloadBlueprint(blueprint) {
      exportBlueprint(JSON.parse(JSON.stringify(blueprint)))
      .catch((err) => {
        Materialize.toast(`离线导出失败: ${err}`)
      })
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
@import '../../../palette'

.icon-delete
  color color-red

.gallery
  margin 5%
  &__title
    margin-top 20px
    margin-bottom 20px
    font-size 1.5rem
  &__item
    margin 5px
    &__title
      &__container
        padding 20px
      &
        margin-bottom 2px
        font-size 1.2rem
      &__created-at
        color color-grey
    &__content
      padding 20px
      &__action
        display inline-block
        width 30px
        height 30px
        padding 0
        line-height 30px
        text-align center
    &__share-link
      &__container
        padding 20px
        border-top 1px solid color-grey-lighten-2
      &
        display inline-block
        width 100%
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
  &__empty-hint
    &__container
      width 400px
      margin auto
      font-size 1.3rem
      text-align center
    &__icon
      font-size 4rem
</style>
