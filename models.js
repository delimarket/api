const token = require('./test')
const chance = require('chance').Chance()
const databaseLoginData = require('./database.json')
const sha=require('sha.js')//sha('sha256').update(<password>).digest('hex')

module.exports.hash = (password) => {
    return sha('sha256').update(password).digest('hex')
}

const knex = require('knex')(databaseLoginData)

const bookshelf=require('bookshelf')(knex)

const User = bookshelf.Model.extend({tableName:'users'})

module.exports={
    User,
    create: (json) => {
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
}

//module.exports=bookshelf;
//module.exports=chance;

/*module.exports.create=(json) => {
    return new User({
        id: token.userid,
        phone:json.phone,
        name:json.name,
        password:json.password,
        is_deliver:json.is_deliver,
        active:1,
        token:token.token
    }).save()
}*/
