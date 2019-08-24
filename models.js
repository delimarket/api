const token = require('./test')

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

const bookshelf=require('bookshelf')(knex)

const User = bookshelf.Model.extend({tableName:'users'})
module.exports=bookshelf;
module.exports=chance;

module.exports.create=(json) => {
    return new User({
        id: token.userid,
        phone:json.phone,
        name:json.name,
        password:json.password,
        is_deliver:json.is_deliver,
        active:1,
        token:token.token
    }).save()
}
