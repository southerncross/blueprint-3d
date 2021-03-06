import passport from 'passport'
import _ from 'lodash'

import log from '../log'

function loginAPI(req, res, next) {
  passport.authenticate('local', {
    badRequestMessage: '请填写邮箱/密码'
  }, (err, user, info) => {
    if (err) {
      log.error(err)
      return next(err)
    }
    if (!user || user.deactivated) {
      return res.status(403).json(info)
    }
    req.login(user, (error) => {
      if (error) {
        return next(error)
      }
      const pickedUser = _.pick(req.user, [
        'name',
        'lastName',
        'firstName',
        'email',
        'avatar',
        'phone'
      ])
      res.status(200).json(pickedUser)
    })
  })(req, res, next)
}

function logoutAPI(req, res) {
  req.logout()
  res.clearCookie('user_email')
  res.status(200).json()
}

function getUserInfoAPI(req, res) {
}

export default {
  loginAPI,
  logoutAPI,
  getUserInfoAPI
}
