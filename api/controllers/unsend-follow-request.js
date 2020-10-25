const { Request } = require('../../js/models/Request')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { reqId } = req.params
    if(!reqId || reqId === '') return res.status(400).json({ error: 'RequestID is missing' })
    
    updateUserActivity(user._id)
    
    await Request.deleteRequest(reqId)

    return res.status(201).json({ requestCancelled: true })    
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}
  