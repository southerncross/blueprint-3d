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
  }
})
