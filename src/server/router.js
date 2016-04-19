import express from 'express'

import sessions from './controllers/sessions'

const router = express.Router()

/* GET home page. */
router.get('/*', (req, res) => {
  if (req.user) {
    res.cookie('user_email', req.user.email)
    res.render('main-app', { data: req.user })
  } else {
    res.render('main-app')
  }
})

router.post('/login', sessions.login)
router.post('/logout', sessions.logout)

export default router
