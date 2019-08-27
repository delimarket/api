const token = require('./test')
const chance = require('chance').Chance()
const sha = require('sha.js')

const knex = require('knex')({
    client:'mysql',
    connection: {
        host:'localhost',
        user:'root',
        password:'',
        database:'delimarket',
        charset:'utf8'
    }
})

const bookshelf = require('bookshelf')(knex)

const User = bookshelf.Model.extend({tableName:'users'})

const createUser = (data) => {
    let userid = chance.bb_pin().substr(0,7)
    let token = chance.apple_token()

    return new User({
        id: userid,
        phone: data.phone,
        name: data.name,
        password: sha('sha256').update(data.password).digest('hex'),
        is_deliver: data.is_deliver,
        active: 1,
        token: token
    }).save()
}

module.exports = {
    createUser
}