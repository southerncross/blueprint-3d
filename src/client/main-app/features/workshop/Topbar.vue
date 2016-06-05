<template>
<div>
  <nav class="navbar-fixed topbar">
    <div class="nav-wrapper cyan">
      <a v-link="{ name: 'home' }"><span class="icon-cube logo"></span></a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a v-link="{ name: 'gallery' }">我的作品</a></li>
        <li><a v-link="{ name: 'create' }">新建作品</a></li>
        <li v-show="hasLogin">
          <a class="dropdown-button" data-activates="logout">{{ user.name }}</a>
          <!-- Logout panel -->
          <ul id='logout' class='dropdown-content'>
            <li><a @click="requestLogout">登出</a></li>
          </ul>
        </li>
        <li v-else>
          <a @click="openLoginModal">登陆</a>
        </li>
      </ul>
    </div>
  </nav>
  <!-- Login modal -->
  <div id="login" class="modal topbar__login">
    <div class="modal-content">
      <h4>登陆</h4>
      <form>
        <div class="input-field">
          <input id="login-email" type="email"
            class="validate topbar__login__input" v-model="email">
          <label for="login-email">邮箱</label>
        </div>
        <div class="input-field">
          <input id="login-password" type="password"
            class="validate topbar__login__input" v-model="password">
          <label for="login-password">密码</label>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button class="modal-action modal-close waves-effect waves-green btn-flat" @click="requestLogin">登陆</button>
    </div>
  </div>
</div>
</template>

<script>
import request from 'superagent'
import $ from 'jquery'
import Materialize from 'Materialize'

import {
  login,
  logout
} from '../../vuex/actions'

export default {
  name: 'Topbar',

  vuex: {
    getters: {
      hasLogin: state => Object.keys(state.user).length > 0,
      user: state => state.user
    },
    actions: {
      login,
      logout
    }
  },

  data() {
    return {
      email: '',
      password: ''
    }
  },

  methods: {
    openLoginModal() {
      $('#login').openModal()
    },
    requestLogin() {
      request.post('/api/login')
      .send({ email: this.email, password: this.password })
      .end((err, res) => {
        if (err || !res || !res.ok) {
          Materialize.toast(`登陆失败: ${err || '未知错误'}`, 4000)
          return
        } else {
          this.login(res.body)
        }
      })
    },
    requestLogout() {
      request.post('/api/logout')
      .end((err, res) => {
        if (err || !res || !res.ok) {
          return
        }
        this.logout()
      })
    }
  }
}
</script>

<style lang="stylus">
@require '../../../palette'

.logo
  font-size x-large
  vertical-align middle

.nav-wrapper
  padding 0 2%

.topbar
  &__login
    color color-grey-darken-4
    input[type=email]&__input , input[type=password]&__input
      width 90%
  &__logout
    background-color red
</style>
