const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

router.post('/new', async (req, res) => {
  /* const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  } */

  const order = {
    user: req.session.user
  }

  res.json(order)
})

module.exports = router
