const { Message } = require('../../js/models/Message')
const { Conversation } = require('../../js/models/Conversation')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { convId } = req.body
    if(!convId) return res.status(400).json({ error: 'Conversation ID is missing' })

    updateUserActivity(user._id)

    await Message.viewMessages(convId, user._id) 
    await Conversation.unsetUnseenMessages(convId)

    return res.status(201).json({ messagesViewed: true })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}