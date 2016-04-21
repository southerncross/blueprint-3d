import Blueprint from '../models/Blueprint'
import AccessToken from '../models/AccessToken'

function saveBlueprintAPI(req, res) {
  const userId = req.user.id
  const { name, url, description } = req.body
  new Blueprint({ user_id: userId, name, url, description })
  .save()
  .then((blueprint) => res.status(200).json(blueprint.serialize()))
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
  getBlueprintsAPI,
  shareBlueprintAPI,
  deshareBlueprintAPI,
  renderSharePage
}
