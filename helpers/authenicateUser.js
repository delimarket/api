const authenticateUser = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    const err = new Error('User not logged in')
    next(err)
  }
}

module.exports = authenticateUser
