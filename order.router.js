const express = require('express')
const router = express.Router()
const models = require('./models')
const chance = require('chance')()
// const { check, validationResult } = require('express-validator')

router.post('/new', async (req, res) => {
  /* const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  } */

  let generated_order_id,rows

  do {
    generated_order_id=chance.string({'length':11,'alpha': true,'casing':"lower",'numeric':true})
    rows=await models.Order.where('id',generated_order_id).count()
  } while (rows>0);

  const order = new models.Order({
    user_id: req.session.user.id,
    order_id: generated_order_id
  })
  order.save(null, { method: 'insert' }).then(() => {
    return res.status(200).json({
      message: order
    })
  })
})

module.exports = router
