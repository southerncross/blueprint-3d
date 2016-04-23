import express from 'express'
import _ from 'lodash'

import sessions from './controllers/sessions'
import blueprints from './controllers/blueprints'

const router = express.Router()

/* GET home page. */
router.get('/*', (req, res) => {
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
})

router.post('/login', sessions.loginAPI)
router.post('/logout', sessions.logoutAPI)
router.get('/api/users', sessions.getUserInfoAPI)

router.post('/api/blueprints', blueprints.saveBlueprintAPI)
router.get('/api/blueprints', blueprints.getBlueprintsAPI)

router.put('/api/share-gallery/:galleryId', blueprints.shareBlueprintAPI)
router.put('/api/deshare-gallery/:galleryId', blueprints.deshareBlueprintAPI)

export default router
