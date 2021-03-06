const viewFollowers = require('../../graphql/resolvers/view-followings')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1 } = require('../utils/client')

const view = async _ => {
  try {
    const followers = await viewFollowers(client1._id, 1, client1)
    console.log(followers)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => view())