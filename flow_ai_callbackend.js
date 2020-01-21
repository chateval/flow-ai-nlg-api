/**
@param {object} payload - data and info
@param {string} payload.channelName - type of channel
@param {string} payload.query - what the user sends
@param {object} payload.params - data detected by AI
@param {object} payload.user - user that triggered the action
@param {string} payload.user.name - name of the user
@param {string} [payload.user.profile.firstName] - first name of the user
@param {string} [payload.user.profile.lastName] - Last name of the user
@param {string} [payload.user.profile.fullName] - first and last name combined
@param {string} [payload.user.profile.picture] - profile picture
@param {string} [payload.user.profile.locale] - user language
@param {string} [payload.user.profile.gender] - user gender
*/
(async payload => {
  try {
    const URL='http://chateval.serveo.net/'
    /* const URL='http://ec2-3-93-163-208.compute-1.amazonaws.com:8080/' */
    let input = payload.query
    const response = await request({ 
      method: 'POST',
      url: URL,
      headers: { 
         Accept: 'application/json',
         'Content-Type': 'application/json'
      },
      data: { 
        'input': input
      }
    })

    const {
      status,
      data
    } = response
  console.log(data)
  
  const text = new Text(data["output"])
  const message = new Message(`Could not connect to NLG backend.`)
  
  /* const text = new Text(`Could not connect to NLG backend. There is a chance that the model is loading and that this is a timeout, but if this is your second message the system might be down :( ... feel free to email us at chatevalteam@gmail.com.`)
  const message = new Message(`Could not connect to NLG backend.`)  */

  message.addResponse(text)

  return message

  } catch(err) {
    console.error('Something bad', err)
    const text = new Text(`Could not connect to NLG backend. There is a chance that the model is loading and that this is a timeout, but if this is your second message the system might be down :( ... feel free to email us at chatevalteam@gmail.com.`)
    const message = new Message(`Could not connect to NLG backend.`)
    message.addResponse(text)
    return message
  }
})
