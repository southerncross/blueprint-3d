import qiniu from 'qiniu'
import uuid from 'node-uuid'

import configs from '../configs'
import Blueprint from '../models/Blueprint'
import AccessToken from '../models/AccessToken'

qiniu.conf.ACCESS_KEY = configs.qiniu.accessKey
qiniu.conf.SECRET_KEY = configs.qiniu.secretKey

function uploadHelper(blueprint) {
  blueprint.svgKey = blueprint.svgKey || `${uuid.v4()}.svg`
  const key = blueprint.svgKey
  const uptoken = new qiniu.rs.PutPolicy(`${configs.qiniu.bucket}:${key}`).token()
  const extra = new qiniu.io.PutExtra()

  return new Promise((resolve, reject) => {
    qiniu.io.put(uptoken, key, blueprint.svg, extra, function(err, ret) {
      if (err) {
        reject(err)
        return
      }
      resolve(ret.key)
    })
  })
}

function saveHelper(blueprint) {
  const _blueprint = Object.assign({}, blueprint)
  delete _blueprint.svg
  return new Blueprint(_blueprint).save()
}

function saveBlueprintsAPI(req, res) {
  const userId = req.user.id
  const { blueprints = [] } = req.body

  if (blueprints.length === 0) {
    res.status(403).json({ message: '缺少图样' })
    return
  }
  blueprints.forEach((blueprint) => {
    blueprint.userId = userId
  })

  Promise.all(blueprints.map(uploadHelper))
  .then(() => Promise.all(blueprints.map(saveHelper)))
  .then((models) => {
    return models.map((model) => model.toJSON())
  })
  .then((_savedBlueprints) => {
    _savedBlueprints.forEach((_savedBlueprint) => {
      const tmp = blueprints.find((_blueprint) => _blueprint.localId === _savedBlueprint.localId)
      tmp.id = _savedBlueprint.id
    })
    return Promise.all(blueprints.map(uploadHelper))
  })
  .then((ret) => {
    res.status(200).json(blueprints)
  })
  .catch((err) => res.status(403).json({ message: err }))
}

function getBlueprintsAPI(req, res) {
  const userId = req.user.id
  new Blueprint({ user_id: userId })
  .fetchAll()
  .then((blueprints) => {
    return blueprints.fetch({ withRelated: ['accessToken'] })
  })
  .then((blueprints) => {
    res.status(200).json(blueprints.toJSON())
  })
  .catch((err) => res.status(403).json({ message: err }))
}

function getBlueprintByLocalIdAPI(req, res) {
  const userId = req.user.id
  const { localId } = req.params
  new Blueprint({ userId, localId })
  .fetch()
  .then((model) => {
    res.status(200).json(model && model.toJSON())
  })
  .catch((err) => res.status(403).json({ message: err }))
}

function shareBlueprintAPI(req, res) {
  const userId = req.user.id
  const { localId } = req.params

  new Blueprint({ localId, userId })
  .fetch({ withRelated: 'accessToken' })
  .then((blueprint) => {
    if (!blueprint) {
      throw new Error('找不到图样')
    }
    if (!blueprint.related('accessToken').get('token')) {
      return new AccessToken({ blueprintId: blueprint.get('id'), valid: true }).save()
    } else {
      return new AccessToken({
        token: blueprint.related('accessToken').get('token'),
        blueprintId: blueprint.get('id'),
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
  const { localId } = req.params

  new Blueprint({ localId, userId })
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
      blueprintId: blueprint.get('id'), valid: false
    })
    .save()
    .then((accessToken) => res.status(200).json(accessToken.toJSON()))
  })
  .catch((err) => res.status(403).json({ message: err }))
}

function renderShareApp(req, res) {
  const blueprintId = req.user.blueprint.id

  new Blueprint({ id: blueprintId })
  .then((blueprint) => res.render('share-app', { data: blueprint }))
  .catch((err) => res.status(403).json({ message: err }))
}

export default {
  saveBlueprintsAPI,
  getBlueprintsAPI,
  getBlueprintByLocalIdAPI,
  shareBlueprintAPI,
  deshareBlueprintAPI,
  renderShareApp
}
