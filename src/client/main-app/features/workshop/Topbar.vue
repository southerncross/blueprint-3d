<template>
<div class="navbar-fixed workshop__top-bar">
  <nav>
    <div class="nav-wrapper cyan">
      <a v-link="{ name: 'home' }"><span class="icon-cube logo"></span></a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a v-link="{ name: 'gallery' }">我的作品</a></li>
        <li><a v-link="{ name: 'create' }">新建作品</a></li>
        <li v-if="hasLogin">
          <a class="dropdown-button" data-activates="logout">{{ user.name }}</a>
        </li>
        <li v-else>
          <a @click="openLoginModal">登陆</a>
        </li>
      </ul>
    </div>
    <!-- Logout panel -->
    <ul id='logout' class='dropdown-content'>
      <li><a @click="requestLogout">登出</a></li>
    </ul>
    <!-- Login modal -->
    <div id="login" class="modal topbar__login">
      <div class="modal-content">
        <h4>登陆</h4>
        <form>
          <div class="input-field">
            <input placeholder="请输入邮箱" id="login-email" type="email"
              class="validate topbar__login__input" v-model="email">
            <label for="login-email">邮箱</label>
          </div>
          <div class="input-field">
            <input placeholder="请输入密码" id="login-password" type="password"
              class="validate topbar__login__input" v-model="password">
            <label for="login-password">密码</label>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="modal-action modal-close waves-effect waves-green btn-flat" @click="requestLogin">登陆</button>
      </div>
    </div>
  </nav>
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
      request.post('/login')
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
      this.logout()
    }
  }
}
</script>

<style lang="stylus">
.logo
  font-size x-large
  vertical-align middle

.workshop__top-bar
  position fixed
  left 0
  top 0

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
