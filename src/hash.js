const sha=require('sha.js')//sha('sha256').update(<password>).digest('hex')

const hash = (password) => {
    return sha('sha256').update(password).digest('hex')
}

//console.log(hash('admin'))

module.exports=hash;