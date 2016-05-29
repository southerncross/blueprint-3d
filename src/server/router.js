import express from 'express'
import passport from 'passport'
import _ from 'lodash'

import sessions from './controllers/sessions'
import blueprints from './controllers/blueprints'
import thirdPartyStorage from './controllers/thirdPartyStorage.js'

const router = express.Router()

function renderMainApp(req, res) {
  if (req.user) {
    const user = _.pick(req.user, [
      'name',
      'lastName',
      'firstName',
      'email',
      'avatar',
      'phone'
    ])
    res.cookie('user_email', req.user.email)
    res.render('main-app', { data: user })
  } else {
    res.render('main-app', { data: {} })
  }
}

/* GET home page. */
router.get('/$', renderMainApp)
router.get('/home*', renderMainApp)
router.get('/workshop*', renderMainApp)
router.get('/share*', passport.authenticate('bearer', {
  session: false
}), blueprints.renderShareApp)

router.post('/api/login', sessions.loginAPI)
router.post('/api/logout', sessions.logoutAPI)
router.get('/api/users', sessions.getUserInfoAPI)

router.post('/api/blueprints', blueprints.saveBlueprintsAPI)
router.get('/api/blueprints', blueprints.getBlueprintsAPI)
router.get('/api/blueprint/:localId', blueprints.getBlueprintByLocalIdAPI)

router.put('/api/share-blueprint/:localId', blueprints.shareBlueprintAPI)
router.put('/api/deshare-blueprint/:localId', blueprints.deshareBlueprintAPI)

router.get('/api/third-party-storage/download-url/:key', thirdPartyStorage.getDownloadUrlAPI)

export default router
