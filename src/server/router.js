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

router.post('/login', sessions.login)
router.post('/logout', sessions.logout)

router.post('/api/blueprints', blueprints.saveGalleryAPI)
router.get('/api/blueprints', blueprints.getBlueprintsAPI)

router.put('/api/share-gallery/:galleryId', blueprints.shareGalleryAPI)
router.put('/api/deshare-gallery/:galleryId', blueprints.deshareGalleryAPI)

export default router
