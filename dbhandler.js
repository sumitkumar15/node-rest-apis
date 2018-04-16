let models = require('./schema')
let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test')

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('were connected!')
})

/**
 * @param {*} query -  question id of the question to be fetched
 * @returns returns the question object if present in database
 */
function getQuestion (query) {
  return models.QuestionM.find(query, function (err, data) {
    if (err) console.error(err)
    console.log(data)
    return data
  })
}
/**
 * @param {*} data 
 * @returns true if successful else false
 */
function saveResponse (data) {
  const randId = Math.floor(Math.random() * 100000)
  const respData = new models.AnswerM({
    userId: randId,
    '11': data['11'],
    '22': data['22']
  })
  respData.save(function (err) {
    if (err) {
      console.log(err)
      return false
    }
    return true
  })
}

function inRange (predict, actual) {
  if (predict <= actual + 10 && predict >= actual - 10) return true
  return false
}
/**
 * @param {*} data - object of incoming request data 
 * @returns true if predicetion if within +/- 10 of actual value
 */
async function getPrediction (data) {
  const sel_op1 =  await models.AnswerM.count({[data.question]: 'op1'})
  const sel_op2 =  await models.AnswerM.count({[data.question]: 'op2'})
  const percent_op1 = (sel_op1 / (sel_op1 + sel_op2)) * 100
  const percent_op2 = 100 - percent_op1
  return inRange(data.op1, percent_op1) && inRange(data.op2, percent_op2)
}

module.exports = {
  getQuestion,
  saveResponse,
  getPrediction
}
