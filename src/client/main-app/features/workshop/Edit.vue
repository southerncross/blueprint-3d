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
    :svg.once="svg"></svg-panel>
  <three-panel
    v-if="showThreePanel()"
    transition="fade"
    :svg.once="svg"></three-panel>

  <div class="edit__save">
    <a v-if="savable"
      class="waves-effect waves-teal btn-flat"
      @click="saveWork">
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
        @click="createWork">确认</button>
    </div>
  </div>
</div>
</template>

<script>
import Snap from 'Snap'
import $ from 'jquery'

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
      svg: new Snap('100%', '100%'),
      work: {
        name: '',
        description: ''
      }
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
    saveWork() {
      if (this.$route.params.id) {

      } else {
        $('#save-modal').openModal()
      }
    },
    createWork() {
      const id = makeId()
      this.work.id = id
      const works = JSON.parse(window.localStorage.getItem('blueprintWorks')) || {}
      works[id] = {
        id,
        name: this.work.name,
        description: this.work.description,
        svg: this.svg.toString()
      }
      window.localStorage.setItem('blueprintWorks', JSON.stringify(works))
      this.$route.router.go({
        name: 'edit',
        params: { id }
      })
    }
  },

  ready() {
    // Init materializeCss tooltip
    $('.tooltipped').tooltip()

    if (this.$route.params.id && this.savable) {
      const works = JSON.parse(window.localStorage.getItem('blueprintWorks')) || {}
      if (works[this.$route.params.id]) {
        this.work = works[this.$route.params.id]
      } else {
        this.$route.router.go({ name: 'new' })
      }
    }
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
