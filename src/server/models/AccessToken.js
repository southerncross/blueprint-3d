import uuid from 'node-uuid'

import Base from './Base'
import Blueprint from './Blueprint'

export default Base.extend({
  tableName: 'access_tokens',

  idAttribute: 'token',

  blueprint() {
    return this.belongsTo(Blueprint)
  },

  initialize() {
    this.on('creating', this.generateToken, this)
  },

  generateToken: function(model, attrs, options) {
    model.set('token', uuid.v4())
    return Promise.resolve(model)
  }
})
