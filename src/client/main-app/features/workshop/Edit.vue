<template>
<div>
  <div class="switch text-cyan edit__switch">
    <label>
      3D
      <input type="checkbox" :checked="mode === 'svg'" @click="toggleMode">
      <span class="lever"></span>
      2D
    </label>
  </div>
  <svg-panel
    v-show="showSvgPanel()"
    transition="fade"
    :svg.once="svg"
    :elem-event-control.once="elemEventControl"></svg-panel>
  <three-panel
    v-if="showThreePanel()"
    transition="fade"
    :svg.once="svg"></three-panel>

  <div class="edit__save">
    <a
      class="waves-effect waves-teal btn-flat"
      @click="openSaveModal">
      <span class="icon-save"></span>保存
    </a>
  </div>

  <!-- Modal Structure -->
  <div id="save-modal" class="modal bottom-sheet">
    <div class="modal-content">
      <h4>保存</h4>
      <form>
        <div class="input-field">
          <input
            id="blueprint-name"
            type="text"
            class="validate"
            v-model="blueprint.name">
          <label for="blueprint-name">名字(必填)</label>
        </div>
        <div class="input-field">
          <textarea
            id="blueprint-description"
            class="materialize-textarea"
            v-model="blueprint.description"></textarea>
          <label for="blueprint-description">简单介绍(选填)</label>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button
        class="modal-action modal-close waves-effect waves-green btn-flat"
        @click="saveBlueprint">确认</button>
    </div>
  </div>
</div>
</template>

<script>
import Snap from 'Snap'
import $ from 'jquery'
import Materialize from 'Materialize'
import moment from 'moment'

import { replaceBlueprints } from '../../vuex/actions'
import EventControl from '../../libs/svg/EventControl'
import SvgPanel from './svg/SvgPanel'
import ThreePanel from './three/ThreePanel'
import { makeId } from '../../libs/utils'
import request from '../../requests/requests'

export default {
  name: 'Edit',

  vuex: {
    actions: {
      replaceBlueprints
    },
    getters: {
      localEntities: state => state.blueprint.localEntities,
      remoteEntities: state => state.blueprint.remoteEntities,
      hasLogin: state => Object.keys(state.user).length > 0
    }
  },

  components: {
    SvgPanel,
    ThreePanel
  },

  props: {
    id: String
  },

  data() {
    return {
      mode: 'svg',
      elemEventControl: new EventControl(), // we have to put it here because we will use it to wrap loaded elements
      svg: new Snap('100%', '100%'),
      blueprint: {
        name: '',
        description: ''
      },
      autoSaveInterval: 1000 * 60,
      savedAt: null
    }
  },

  methods: {
    showSvgPanel() {
      return this.mode === 'svg'
    },
    showThreePanel() {
      return this.mode === 'three'
    },
    toggleMode() {
      this.mode = this.mode === 'svg' ? 'three' : 'svg'

      // Remove dat.GUI when switching between svg mode and three mode
      if (this.mode === 'svg') {
        $('.dg.main.a').remove()
      }
    },
    openSaveModal() {
      $('#save-modal').openModal()
    },
    saveBlueprint() {
      function __save(blueprint) {
        // Notify vuex to update
        this.replaceBlueprints(blueprint)
        // Update latest save operation timestamp
        this.saveAt = moment()
        this.gotoBlueprintEditPage(blueprint.localId)
      }
      this.blueprint.localId = this.$route.params.id || makeId()
      // We can not use Object.assign directly because Vue.js has wrap the
      // object with observable properties.
      const blueprint = {
        localId: this.blueprint.localId,
        name: this.blueprint.name,
        description: this.blueprint.description,
        svg: this.svg.toString()
      }
      if (this.blueprint.id) {
        blueprint.id = this.blueprint.id
      }

      if (this.hasLogin) {
        // If user has login, save blueprint remotely
        // But if we failed to save at server, then just save at localStorage
        request.saveBlueprints(blueprint)
        .then((savedBlueprint) => {
          // Set id here in case blueprint has no id before.
          this.blueprint.id = savedBlueprint.id
          __save(savedBlueprint)
          Materialize.toast('保存成功', 2000)
        })
        .catch((err) => {
          __save(blueprint)
          Materialize.toast(`同步失败(${err})，修改已保存在本地`, 2000)
        })
      } else {
        // If use has not login, save blueprint locally
        __save(blueprint)
        Materialize.toast('保存成功', 2000)
      }
    },
    autoSave() {
      if (!this.$route.params.id) {
        return
      }
      const nextSaveMoment = moment(this.saveAt).add(this.autoSaveInterval, 'ms')
      if (!this.saveAt || moment().isAfter(nextSaveMoment)) {
        // Dirty check
        const blueprint = this.localEntities[this.$route.params.id] || this.remoteEntities[this.$route.params.id]
        if (blueprint.svg !== this.svg.toString()) {
          this.saveBlueprint()
        }
      }
      setTimeout(this.autoSave, this.autoSaveInterval)
    },
    gotoBlueprintEditPage(localId) {
      if (this.$route.params.id !== localId) {
        this.$route.router.go({
          name: 'edit',
          params: { id: localId }
        })
      }
    },
    loadFromFragment(fragment) {
      // Restore meta data
      fragment.selectAll('blueprint-meta').forEach((meta) => {
        this.svg.append(meta)
      })
      // Restore walls
      fragment.selectAll('.wall').forEach((wall) => {
        this.svg.append(wall)
      })
      // Restore windows
      fragment.selectAll('.window').forEach((_window) => {
        this.svg.append(_window)
      })
      // Restore doors
      fragment.selectAll('.door').forEach((door) => {
        this.svg.append(door)
      })
    },
    wrapSvgElements() {
      this.svg.selectAll('blueprint-meta').forEach((meta) => {
        meta.toDefs()
      })
      this.svg.selectAll('.wall').forEach((wall) => {
        this.elemEventControl.wrap(wall)
      })
      this.svg.selectAll('.window').forEach((_window) => {
        // Don't forget to restore hoveredLineIds because three canvas need it to render correctly.
        const hoverWallId = _window.attr('hover-elem-id')
        const hoverWall = this.svg.select(`#${hoverWallId}`)
        if (hoverWall) {
          const hoveredLineIds = hoverWall.data('hoveredLineIds') || []
          hoveredLineIds.push(_window.attr('id'))
          hoverWall.data('hoveredLineIds', hoveredLineIds)
          this.elemEventControl.wrap(_window)
        }
      })
      this.svg.selectAll('.door').forEach((door) => {
        const hoverWallId = door.attr('hover-elem-id')
        const hoverWall = this.svg.select(`#${hoverWallId}`)
        if (hoverWall) {
          const hoveredLineIds = hoverWall.data('hoveredLineIds') || []
          hoveredLineIds.push(door.attr('id'))
          hoverWall.data('hoveredLineIds', hoveredLineIds)
          this.elemEventControl.wrap(door)
        }
      })
    }
  },

  ready() {
    // Init materializeCss tooltip
    $('.tooltipped').tooltip()

    const localId = this.$route.params.id
    const blueprint = this.localEntities[localId] || this.remoteEntities[localId]
    if (blueprint) {
      // Prefer editing local blueprint then remote blueprint
      this.blueprint = Object.assign({}, blueprint)
      request.fetchSvgFragment(this.blueprint)
      .then((fragment) => {
        this.loadFromFragment(fragment)
        this.wrapSvgElements()
      })
      .catch(() => {
        Materialize.toast('读取数据失败，请刷新页面重试', 200)
      })
    } else {
      // No blueprint was found, go to create page.
      if (this.$route.name !== 'create') {
        this.$route.router.go({ name: 'create' })
      }
    }

    setTimeout(this.autoSave, this.autoSaveInterval)
  },

  beforeDestroy() {
    // Remove annoying dat.GUI
    $('.dg.main.a').remove()
  }
}
</script>

<style lang="stylus">
@import '../../transition'

.edit
  &__menu-container
    position fixed
    left 40px
    top 50%
    transform translateY(-50%)
  &__switch
    position absolute
    top 100px
    left 10px
  &__save
    position absolute
    right 40px
    bottom 40px
</style>
