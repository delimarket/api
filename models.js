//const hashlib = require('hashlib')

const knex = require('knex')({
    client:'mysql',
    connection: {
        host:'mysql.cba.pl',
        user:'instabotapi',
        password:'B06dea8a3f',
        database:'instabotapi',
        charset:'utf8'
    }
})

const bookshelf=require('bookshelf')(knex)

const User = bookshelf.Model.extend({tableName:'users'})

const generateid = (x=7) => {
    const alfabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"];
    let token;
    let regexp= /[a-z]/
    do {
        token=""
        for(let i=0;i<x;i++) {
            let rand = Math.floor(Math.random()*(alfabet.length-1))
            token += alfabet[rand];
        }
    } while (!regexp.test(token))

    return token
}

module.exports=bookshelf;

module.exports.create=(json) => {
    return new User({
        id: generateid(),
        phone:json.phone,
        name:json.name,
        password:json.password,
        is_deliver:json.is_deliver,
        active:1,
        token:generateid(64)
    }).save()
}