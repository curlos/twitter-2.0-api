const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  img: { type: String },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  totalReplies: { type: Number },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
{ timestamps: true })

const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet;