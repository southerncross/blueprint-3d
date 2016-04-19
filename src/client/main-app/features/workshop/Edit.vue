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
    <a v-if="savable"
      class="waves-effect waves-teal btn-flat"
      @click="openSaveModal">
      <span class="icon-save"></span>保存
    </a>
    <span v-else
      class="tooltipped"
      data-position="left" data-delay="50" data-tooltip="您的浏览器不支持本地存储">
      <span class="icon-report_problem"></span>无法保存
    </span>
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
            v-model="work.name">
          <label for="blueprint-name">名字(必填)</label>
        </div>
        <div class="input-field">
          <textarea
            id="blueprint-description"
            class="materialize-textarea"
            v-model="work.description"></textarea>
          <label for="blueprint-description">简单介绍(选填)</label>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button
        class="modal-action modal-close waves-effect waves-green btn-flat"
        @click="saveWork">确认</button>
    </div>
  </div>
</div>
</template>

<script>
import Snap from 'Snap'
import $ from 'jquery'
import Materialize from 'Materialize'
import moment from 'moment'

import EventControl from '../../libs/svg/EventControl'
import SvgPanel from './svg/SvgPanel'
import ThreePanel from './three/ThreePanel'
import { makeId, localStorageAvailable } from '../../libs/utils'

export default {
  name: 'Edit',

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
      work: {
        name: '',
        description: ''
      },
      autoSaveInterval: 1000 * 60,
      savedAt: null
    }
  },

  computed: {
    savable() {
      return localStorageAvailable()
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
    saveWork() {
      const id = this.$route.params.id || makeId()
      this.work.id = id
      const works = JSON.parse(window.localStorage.getItem('blueprintWorks')) || {}
      works[id] = {
        id,
        name: this.work.name,
        description: this.work.description,
        svg: this.svg.toString()
      }
      window.localStorage.setItem('blueprintWorks', JSON.stringify(works))
      if (!this.$route.params.id) {
        this.$route.router.go({
          name: 'edit',
          params: { id }
        })
      } else {
        this.saveAt = moment()
      }
    },
    autoSave() {
      if (!this.$route.params.id) {
        return
      }
      const nextSaveMoment = moment(this.saveAt).add(this.autoSaveInterval, 'ms')
      if (!this.saveAt || moment().isAfter(nextSaveMoment)) {
        this.saveWork()
        Materialize.toast(`已自动保存: ${this.saveAt.format('LT')}`, 1500, 'rounded')
      }
      setTimeout(this.autoSave, this.autoSaveInterval)
    }
  },

  ready() {
    // Init materializeCss tooltip
    $('.tooltipped').tooltip()

    if (this.$route.params.id && this.savable) {
      const works = JSON.parse(window.localStorage.getItem('blueprintWorks')) || {}
      if (works[this.$route.params.id]) {
        this.work = works[this.$route.params.id]
        const fragment = Snap.parse(this.work.svg)
        // Restore meta data
        fragment.selectAll('blueprint-meta').forEach((meta) => {
          this.svg.append(meta)
        })
        this.svg.selectAll('blueprint-meta').forEach((meta) => {
          meta.toDefs()
        })
        // Restore walls
        fragment.selectAll('.wall').forEach((wall) => {
          this.svg.append(wall)
        })
        this.svg.selectAll('.wall').forEach((wall) => {
          this.elemEventControl.wrap(wall)
        })
        // Restore windows
        fragment.selectAll('.window').forEach((_window) => {
          this.svg.append(_window)
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
        // Restore doors
        fragment.selectAll('.door').forEach((door) => {
          this.svg.append(door)
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
      } else {
        this.$route.router.go({ name: 'new' })
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
