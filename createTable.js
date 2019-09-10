const databaseLoginData = require('./database.json')

const knex = require('knex')(databaseLoginData)
const bookshelf = require('bookshelf')(knex)

bookshelf.knex.schema.createTable('orders', t => {
  t.increments('id')
  t.integer('userid')
})
