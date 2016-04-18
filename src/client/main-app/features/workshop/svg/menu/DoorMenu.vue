<template>
<li>
  <div class="collapsible-header edit-menu__header">
    <button
      class="btn-floating btn-large waves-effect waves-light tooltipped"
      data-position="right" data-delay="500" data-tooltip="画门模式"
      :class="menuBtnClassName"
      @click="setMode('door')"
    >
      <i class="icon-directions_run" :class="menuIconClassName"></i>
    </button>
  </div>
  <div class="collapsible-body edit-menu__body">
    <ul>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="锁定"
          @click="toggleDoorLock"
        >
          <i :class="lockIconClassName"></i>
        </button>
      </li>
      <li>
        <button
          class="btn-floating btn-small waves-effect waves-light tooltipped"
          data-position="right" data-delay="0" data-tooltip="可见性"
          @click="toggleDoorVisibility"
        >
          <i :class="visibilityIconClassName"></i>
        </button>
      </li>
    </ul>
  </div>
</li>
</template>

<script>
import {
  toggleDoorVisibility,
  toggleDoorLock,
  addDoor
} from '../../../../vuex/actions'

export default {
  name: 'DoorMenu',

  vuex: {
    getters: {
      existed: state => state.door.count > 0,
      visibility: state => state.door.visible ? 'visible' : 'hidden',
      locked: state => state.door.lock
    },
    actions: {
      toggleDoorVisibility,
      toggleDoorLock,
      addDoor
    }
  },

  props: {
    mode: String,
    svg: Object,
    elemEventControl: Object,
    svgEventControl: Object,
    doorPainter: Object,
    setMode: Function
  },

  computed: {
    isDoorMode: function() {
      return this.mode === 'door'
    },
    menuBtnClassName: function() {
      return this.mode === 'door' ? 'green' : 'white'
    },
    menuIconClassName: function() {
      return this.mode === 'door' ? 'white-text' : 'black-text'
    },
    lockIconClassName: function() {
      return this.locked ? 'icon-lock' : 'icon-lock_open'
    },
    visibilityIconClassName: function() {
      return this.visibility === 'visible' ? 'icon-visibility' : 'icon-visibility_off'
    }
  },

  created() {
    this.elemEventControl
    .register('mousedown', (event) => {
      if (!this.isDoorMode) {
        return
      }
      const elem = this.svg.select(`#${event.target.id}`)
      if (elem.data('locked')) {
        return
      }
      if (elem.attr('class') !== 'wall') {
        return
      }
      this.doorPainter.draw(event.target.id, event.offsetX, event.offsetY)
      event.bypass = true
    })

    // We have to handle half-click event inside of svg canvas otherwise the finishing-click
    // event will not be triggered.
    this.svgEventControl
    .register('mousedown', (event) => {
      if (event.bypass) {
        return
      }
      if (!this.isDoorMode) {
        return
      }
      if (this.doorPainter.isDrawing) {
        const door = this.doorPainter.draw(event.target.id, event.offsetX, event.offsetY)
        if (door) {
          this.elemEventControl.wrap(door)
          this.addDoor()
        }
      }
    })

    // Wrap initial doors
    this.svg.selectAll('.door').forEach((door) => {
      this.elemEventControl.wrap(door)
    })
  }
}
</script>

<style lang="stylus">

</style>