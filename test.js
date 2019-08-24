const chance = require('chance').Chance()

let userid = chance.bb_pin().substr(0,7)
let token = chance.apple_token()

module.exports=userid
module.exports=token
