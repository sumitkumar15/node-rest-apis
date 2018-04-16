const Hapi = require('hapi')
const helper = require('./dbhandler')
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
})

const init = async () => {
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

// returns true if current time is in Range
function verifyTime (lowerRange, upperRange) {
  let t = new Date()
  let h = t.getHours()
  return (h >= lowerRange && h < upperRange)
}

// Endpoint 1
server.route({
  method: 'GET',
  path: '/',
  handler: async function (request, reply) {
    if (verifyTime(12, 19)) {
      let data = await helper.getQuestion({questionId: 11})
      return {
        statuscode: 0,
        data: data
      }
    } else return {statusCode: -1, message: 'Event not started'}
  }
})
// Endpoint 2
server.route({
  method: 'POST',
  path: '/submit',
  handler: function (request, reply) {
    if (verifyTime(12, 19)) {
      const body = request.payload
      if (helper.saveResponse(body)) {
        return {statusCode: 0, message: 'success'}
      }
    } else return {statusCode: -1, message: 'Event not started'}
  }
})
// Endpoint 3
server.route({
  method: 'POST',
  path: '/predict',
  handler: async function (request, reply) {
    if (verifyTime(19, 20)) {
      const body = request.payload
      if (await helper.getPrediction(body)) {
        return {statusCode: 0, message: 'In Range'}
      } else {
        return {statusCode: 1, message: 'Not in Range'}
      }
    } else return {statusCode: -1, message: 'Event running'}
  }
})

init()
