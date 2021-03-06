const { ObjectID } = require('mongodb')
const { Todo } = require('../../js/models/Todo')
const { UserInfo } = require('../../js/models/UserInfo')
const S3 = require('../../assistants/AWS/index')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(todoInput, todoId, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    const ifClientIsAuthor = await Todo.getSpecificFields({ _id: new ObjectID(todoId), "creator._id" : client._id }, { _id: 1, completed: 1, imageUrl: 1 })
  
    !ifClientIsAuthor && throwAnError('Cannot update this todo', 400)

    if(todoInput.imageUrl && ifClientIsAuthor.imageUrl && todoInput.imageUrl !== ifClientIsAuthor.imageUrl){
      if(todoInput.imageUrl === 'remove') todoInput.imageUrl = null
      await S3.deleteFile(ifClientIsAuthor.imageUrl)
    }

    const updatedTodo =  await Todo.updateTodo(todoId, { $set: todoInput })
 
    if(ifClientIsAuthor.completed !== updatedTodo.completed){
      if(updatedTodo.completed) {
        await UserInfo.decreaseActiveTodos(client._id)
        await UserInfo.increaseCompletedTodos(client._id)
      } else {
        await UserInfo.decreaseCompletedTodos(client._id)
        await UserInfo.increaseActiveTodos(client._id)
      }
    }

    return {
      ...updatedTodo,
      createdAt: updatedTodo.createdAt.toISOString(),
      _id: updatedTodo._id.toString()
    }
  } catch(err) {
    checkAndThrowError(err)
  }
}