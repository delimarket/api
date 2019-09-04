const databaseLoginData = require('./database.json')

const knex = require('knex')(databaseLoginData)

const bookshelf = require('bookshelf')(knex)

const User = bookshelf.Model.extend({ tableName: 'users' })

module.exports = {
  User: User
}
