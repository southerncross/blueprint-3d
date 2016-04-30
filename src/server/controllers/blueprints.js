import bookshelf from 'bookshelf'
import qiniu from 'qiniu'

import config from '../configs'
import Blueprint from '../models/Blueprint'
import AccessToken from '../models/AccessToken'

qiniu.conf.ACCESS_KEY = config.qiniu.accessKey
qiniu.conf.SECRET_KEY = config.qiniu.secretKey

function saveBlueprintAPI(req, res) {
  const userId = req.user.id
  const { name, url, description } = req.body
  new Blueprint({ user_id: userId, name, url, description })
  .save()
  .then((blueprint) => res.status(200).json(blueprint.serialize()))
  .catch((err) => res.status(403).json({ message: err }))
}

function uploadHelper(blueprint) {
  const key = `${blueprint.id}.svg`
  const uptoken = new qiniu.rs.PutPolicy(`${config.qiniu.bucketName}:${key}`).token()
  const extra = new qiniu.io.PutExtra()

  return new Promise((resolve, reject) => {
    qiniu.io.put(uptoken, key, blueprint.svg, extra, function(err, ret) {
      if (err) {
        reject(err)
        return
      }
      resolve(ret)
    })
  })
}

function saveBlueprintsAPI(req, res) {
  const userId = req.user.id
  const { blueprints } = req.body
  const Blueprints = bookshelf.Collection.extend({
    model: Blueprint
  })

  const collection = Blueprints.forge(blueprints)
  Promise.all(collection.invoke('save'))
  .then((data) => {
    console.log('boring', data)
    // collection models should now be saved...
  })
  .then(() => res.status(200).json())
  .catch((err) => res.status(403).json({ message: err }))
}

function getBlueprintsAPI(req, res) {
  const userId = req.user.id
  new Blueprint({ user_id: userId })
  .fetchAll()
  .then((blueprints) => blueprints.fetch({ withRelated: ['blueprints', 'accessToken'] }))
  .then((blueprints) => res.status(200).json(blueprints.toJSON()))
  .catch((err) => res.status(403).json({ message: err }))
}

function shareBlueprintAPI(req, res) {
  const userId = req.user.id
  const { blueprintId } = req.params

  new Blueprint({ id: blueprintId, user_id: userId })
  .fetch({ withRelated: 'accessToken' })
  .then((blueprint) => {
    if (!blueprint) {
      throw new Error('找不到图样')
    }
    if (!blueprint.related('accessToken').get('token')) {
      return new AccessToken({ blueprint_id: blueprintId, valid: true })
      .save()
    } else {
      return new AccessToken({
        token: blueprint.related('accessToken').get('token'),
        blueprint_id: blueprintId,
        valid: true
      })
      .save()
    }
  })
  .then((accessToken) => res.status(200).json(accessToken.toJSON()))
  .catch((err) => res.status(400).json({ message: err.message }))
}

function deshareBlueprintAPI(req, res) {
  const userId = req.user.id
  const { blueprintId } = req.params

  new Blueprint({ id: blueprintId, user_id: userId })
  .fetch({ withRelated: 'accessToken' })
  .then((blueprint) => {
    if (!blueprint) {
      return res.status(400).json({ message: '找不到该图样' })
    }
    if (!blueprint.related('accessToken').get('token')) {
      return res.status(403).json({ message: '该图样没有被分享' })
    }
    return new AccessToken({
      token: blueprint.related('accessToken').get('token'),
      blueprint_id: blueprintId, valid: false
    })
    .save()
    .then((accessToken) => res.status(200).json(accessToken.toJSON()))
  })
  .catch((err) => res.status(403).json({ message: err }))
}

function renderSharePage(req, res) {
  const blueprintId = req.user.blueprint.id

  new Blueprint({ id: blueprintId })
  .then((blueprint) => res.render('share-app', { data: blueprint }))
  .catch((err) => res.status(403).json({ message: err }))
}

export default {
  saveBlueprintAPI,
  saveBlueprintsAPI,
  getBlueprintsAPI,
  shareBlueprintAPI,
  deshareBlueprintAPI,
  renderSharePage
}
