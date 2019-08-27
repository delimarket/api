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

console.log(check_hash("password","5e884s898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"))

module.exports=hash;