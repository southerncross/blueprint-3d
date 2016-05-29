import request from 'superagent'
import Snap from 'Snap'

import { getLocalBlueprintEntities } from '../libs/utils'

const DEFAULT_ERROR = '未知错误'

/**
 * Save some blueprints to server.
 * @param  {Array | Object} blueprints
 * @return {Promise}        Resolves to saved blueprint array or blueprint object
 */
function saveBlueprints(blueprints) {
  const isArray = Array.isArray(blueprints)
  if (!isArray) {
    blueprints = [blueprints]
  }

  return new Promise((resolve, reject) => {
    request
    .post('/api/blueprints')
    .send({ blueprints })
    .end((err, res) => {
      if (err || !res || !res.ok) {
        reject(err || DEFAULT_ERROR)
      } else {
        resolve(isArray ? res.body : res.body[0])
      }
    })
  })
}

function deleteBlueprint(blueprint) {
  return new Promise((resolve, reject) => {
    request
    .del(`/api/blueprints/${blueprint.id}`)
    .end((err, res) => {
      if (err || !res || !res.ok) {
        reject(err || DEFAULT_ERROR)
      } else {
        resolve(res.body)
      }
    })
  })
}

function fetchBlueprints() {
  return new Promise((resolve, reject) => {
    request
    .get('/api/blueprints')
    .end((err, res) => {
      if (err || !res || !res.ok) {
        reject(err || DEFAULT_ERROR)
      } else {
        resolve(res.body)
      }
    })
  })
}

function fetchBlueprintByLocalId(localId) {
  return new Promise((resolve, reject) => {
    request
    .get(`/api/blueprint/${localId}`)
    .end((err, res) => {
      if (err || !res || !res.ok) {
        reject(err || DEFAULT_ERROR)
      } else if (res.body) {
        resolve(res.body)
      } else {
        const blueprint = getLocalBlueprintEntities()[localId]
        if (blueprint) {
          resolve(blueprint)
        } else {
          reject('找不到图样')
        }
      }
    })
  })
}

function shareBlueprint(blueprint) {
  return new Promise((resolve, reject) => {
    request
    .put(`/api/share-blueprint/${blueprint.localId}`)
    .end((err, res) => {
      if (err || !res || !res.ok) {
        reject(err || DEFAULT_ERROR)
      } else {
        resolve(res.body)
      }
    })
  })
}

function deshareBlueprint(blueprint) {
  return new Promise((resolve, reject) => {
    request
    .put(`/api/deshare-blueprint/${blueprint.localId}`)
    .end((err, res) => {
      if (err || !res || !res.ok) {
        reject(err || DEFAULT_ERROR)
      } else {
        resolve(res.body)
      }
    })
  })
}

function fetchSvgFragment(blueprint) {
  return new Promise((resolve, reject) => {
    if (blueprint.svg) {
      resolve(Snap.parse(blueprint.svg))
    } else {
      request
      .get(`/api/third-party-storage/download-url/${blueprint.svgKey}`)
      .end((err, res) => {
        if (err || !res || !res.ok) {
          reject(err || DEFAULT_ERROR)
        } else {
          Snap.load(res.body.url, (svg) => {
            if (!svg) {
              reject('加载失败')
            } else {
              resolve(Snap.parse(svg.node.innerHTML))
            }
          })
        }
      })
    }
  })
}

export default {
  saveBlueprints,
  deleteBlueprint,
  fetchBlueprints,
  fetchBlueprintByLocalId,
  shareBlueprint,
  deshareBlueprint,
  fetchSvgFragment
}
