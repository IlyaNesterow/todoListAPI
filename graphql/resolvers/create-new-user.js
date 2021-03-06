const bycrypt = require('bcryptjs')
const { User } = require('../../js/models/User')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const randomBytes = require('../../assistants/random-bytes')
const saveUserModels = require('../assistants/save-user-models')
const { sendAcceptEmail } = require('../../assistants/email-sender')


module.exports = async function(userInput) {
  try {
    const { email, username, password } = userInput
    const userExists = await User.findUser({ $or: [ { email: email }, { username: username } ] })
    if(userExists) throwAnError('User with that username or email already exists', 404)

    const approveEmailToken = (await randomBytes(24)).toString('hex')

    sendAcceptEmail(email, 'accept email', approveEmailToken)
    
    const hashedPw = await bycrypt.hash(password, 16)

    await saveUserModels(userInput, approveEmailToken, hashedPw)

    return true
  } catch (err) {
    checkAndThrowError(err)
  }
}
  