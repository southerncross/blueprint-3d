import request from 'superagent'
import Snap from 'Snap'

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

  console.error('boring', blueprints)

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

function fetchSvgFragment(blueprint) {
  return new Promise((resolve, reject) => {
    if (blueprint.svg) {
      resolve(Snap.parse(blueprint.svg))
    } else {
      Snap.load(`http://7xrvhn.com1.z0.glb.clouddn.com/${blueprint.id}.svg`, (svg) => {
        if (!svg) {
          reject('加载失败')
        } else {
          resolve(Snap.parse(svg.toString()))
        }
      })
    }
  })
}

export default {
  saveBlueprints,
  deleteBlueprint,
  fetchBlueprints,
  fetchSvgFragment
}
