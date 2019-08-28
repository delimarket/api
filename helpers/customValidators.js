const isPhoneUsed = (phone) => {
  return models.User.where('phone', `+48${phone}`).fetchAll().then((users) => {
    if (users.length !== 0) {
      return Promise.reject(new Error('Phone already in use'))
    }
  })
}

const isFullName = (name) => {
  const fullName = name.split(" ");
  if (validator.isAlpha(fullName[0]) && validator.isLength(fullName[0],{min:3,max:30}) && fullName[1]) {
    return true
  } else {
    throw new Error('Invalid name or surname')
  }
}

module.exports = {
  isPhoneUsed,
  isFullName
}