import express from 'express'

const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  if (req.user) {
    res.cookie('user_email', req.user.email)
    res.render('main-app', { data: req.user })
  } else {
    res.render('main-app')
  }
})

export default router
