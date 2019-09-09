const databaseLoginData = require('./database.json')

const knex = require('knex')(databaseLoginData)
const bookshelf = require('bookshelf')(knex)

const User = bookshelf.Model.extend({
  tableName: 'users',
  orders: function() {
    return this.hasMany(Order)
  }
})
const Order = bookshelf.Model.extend({
  tableName: 'orders',
  user: function() {
    return this.belongsTo(User)
  }
})

module.exports = {
  User: User,
  Order: Order
}
