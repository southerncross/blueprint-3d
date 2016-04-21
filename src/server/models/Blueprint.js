import uuid from 'node-uuid'

import Base from './Base'
import User from './User'
import AccessToken from './AccessToken'

export default Base.extend({
  tableName: 'blueprints',

  owner() {
    return this.belongsTo(User)
  },

  accessToken() {
    return this.hasOne(AccessToken)
  },

  initialize() {
    this.on('creating', this.generateId, this)
  },

  generateId: function(model, attrs, options) {
    model.set('id', uuid.v4())
    return Promise.resolve(model)
  }
})
