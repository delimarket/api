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

  let generatedOrderId, rows

  do {
    generatedOrderId = chance.bb_pin()
    rows = await models.Order.where('id', generatedOrderId).count()
  } while (rows > 0)

  const order = new models.Order({
    user_id: req.session.user.id,
    order_id: generatedOrderId
  })
  order.save(null, { method: 'insert' }).then(() => {
    return res.status(200).json({
      message: order
    })
  })
})

module.exports = router
