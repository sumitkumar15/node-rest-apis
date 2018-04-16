let mongoose = require('mongoose')

let QuestionSchema = mongoose.Schema({
  questionId: Number,
  question: String,
  op1: String,
  op2: String
})

let AnswerSchema = mongoose.Schema({
  userId: String,
  '11': String,
  '22': String
})

let QuestionM = mongoose.model('Question', QuestionSchema)
let AnswerM = mongoose.model('Answer', AnswerSchema)

module.exports = {
  QuestionM,
  AnswerM
}
