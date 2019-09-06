const chance = require('chance').Chance()
const sha = require('sha.js')

const generateSMSCode = () => {
  let ret = ''

  for (let i = 0; i < 6; i++) {
    ret += chance.natural({ min: 0, max: 9 })
  }

  const smsCodeObject = {
    plain_text: ret,
    hashed: sha('sha256')
      .update(ret)
      .digest('hex')
  }

  return smsCodeObject
}

module.exports = generateSMSCode
