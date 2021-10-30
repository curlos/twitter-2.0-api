const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true},
  username: { type: String },
  email: { type: String, required: true},
  password: { type: String, required: true},
  profilePic: { type: String },
  bio: { type: String },
  birthDate: { type: Date },
  location: { type: String },
  website: { type: String },
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lowerCaseEmail: { type: String, lowercase: true, trim: true, required: true },
  },
{ timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User;