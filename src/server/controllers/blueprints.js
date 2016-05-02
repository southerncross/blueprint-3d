import qiniu from 'qiniu'

import configs from '../configs'
import Blueprint from '../models/Blueprint'
import AccessToken from '../models/AccessToken'

qiniu.conf.ACCESS_KEY = configs.qiniu.accessKey
qiniu.conf.SECRET_KEY = configs.qiniu.secretKey

function uploadHelper(blueprint) {
  const key = `${blueprint.id}.svg`
  const uptoken = new qiniu.rs.PutPolicy(`${configs.qiniu.bucket}:${key}`).token()
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
  const { blueprints = [] } = req.body

  if (blueprints.length === 0) {
    res.status(403).json({ message: '缺少图样' })
    return
  }
  const savePromises = blueprints.map((blueprint) => {
    const newBlueprint = Object.assign({}, blueprint)
    delete newBlueprint.svg
    newBlueprint.userId = userId
    return new Blueprint(newBlueprint).save()
  })

  let savedBlueprints = null

  Promise.all(savePromises)
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
  .then(() => {
    res.status(200).json(savedBlueprints)
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
  saveBlueprintsAPI,
  getBlueprintsAPI,
  shareBlueprintAPI,
  deshareBlueprintAPI,
  renderSharePage
}
