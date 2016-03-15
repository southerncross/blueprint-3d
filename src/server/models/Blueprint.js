import Base from './Base'
import User from './User'

export default Base.extend({
  tableName: 'blueprints',

  user() {
    return this.belongsTo(User)
  }
})
