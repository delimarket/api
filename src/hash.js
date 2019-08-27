const sha=require('sha.js')//sha('sha256').update(<password>).digest('hex')

const hash = (password) => {
    return sha('sha256').update(password).digest('hex')
}

const check_hash = (plain,hashed) => {
    if(hash(plain)==hashed) {
        return true
    } else {
        return false
    }
}

module.exports=hash;