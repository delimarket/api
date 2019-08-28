const chance = require('chance').Chance();
const sha = require('sha.js')

const generate_sms_code = () => {
    let ret=""

    for(let i=0;i<6;i++) {
        ret+=chance.natural({ min: 0, max: 9 })
    }

    return {
        'plain_text':ret,
        'hashed':sha('sha256').update(ret).digest('hex')
    }
}

module.exports=generate_sms_code;