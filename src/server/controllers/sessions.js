import passport from 'passport'

import log from '../log'

function login(req, res, next) {
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
      res.status(200).json(user)
    })
  })(req, res, next)
}

function logout(req, res) {
  req.logout()
  res.clearCookie('user_email')
  res.status(200).json()
}

export default {
  login,
  logout
}
