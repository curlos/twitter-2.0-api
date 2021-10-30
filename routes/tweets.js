const express = require('express')
const passport = require('passport')
const Tweet = require('../models/Tweet')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const router = express.Router()
const mongoose = require('mongoose')

router.get('/', async (req, res) => {
  try {
    const allTweets = await Tweet.find({})
    res.json(allTweets)
  } catch (err) {
    res.json({error: err})
  }
})

router.get('/user/:userID', async (req, res) => {
  try {
    const userTweets = await Tweet.find({_id: req.params.userID})
    res.json(userTweets)
  } catch (err) {
    res.json({error: err})
  }
})

router.get('/tweet/:id', async (req, res) => {
  try {
    const tweet = await Tweet.findOne({_id: req.params.id})
    res.json(tweet)
  } catch (err) {
    res.json({error: err})
  }
})

router.post('/tweet', async (req, res) => {
  try {
    const user = await User.findOne({_id: req.body.userID})
    const tweet = await new Tweet({
      userID: req.body.userID,
      text: req.body.text
    })
    await tweet.save()

    console.log(req.body)
    console.log(tweet)

    user.tweets = [...user.tweets, tweet]
    await user.save()

    res.status(200).json(tweet)
  } catch (err) {
    res.json({error: err})
  }
})

// like or dislike a tweet
router.put('/tweet/like/:tweetID', async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetID)
    const user = await User.findById(req.body.userID)
    console.log(tweet)

    if (!tweet.likes.includes(req.body.userID)) {
      await tweet.updateOne({ $push: { likes: req.body.userID } })
      await user.updateOne({ $push: { likes: req.params.tweetID } })
      const updatedTweet = await Tweet.findById(req.params.tweetID)
      const updatedUser = await User.findById(req.body.userID)
      res.status(200).json({updatedTweet, updatedUser})
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.userID } })
      await user.updateOne({ $pull: { likes: req.params.tweetID } })
      const updatedTweet = await Tweet.findById(req.params.tweetID)
      const updatedUser = await User.findById(req.body.userID)
      res.status(200).json({updatedTweet, updatedUser})
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

// retweet or un-retweet a tweet
router.put('/tweet/retweet/:tweetID', async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetID)
    const user = await User.findById(req.body.userID)
    console.log(tweet)

    if (!tweet.retweets.includes(req.body.userID)) {
      await tweet.updateOne({ $push: { retweets: req.body.userID } })
      await user.updateOne({ $push: { retweets: req.params.tweetID } })
      const updatedTweet = await Tweet.findById(req.params.tweetID)
      const updatedUser = await User.findById(req.body.userID)
      res.status(200).json({updatedTweet, updatedUser})
    } else {
      await tweet.updateOne({ $pull: { retweets: req.body.userID } })
      await user.updateOne({ $pull: { retweets: req.params.tweetID } })
      const updatedTweet = await Tweet.findById(req.params.tweetID)
      const updatedUser = await User.findById(req.body.userID)
      res.status(200).json({updatedTweet, updatedUser})
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.delete('/tweet/:id', async (req, res) => {
  const tweet = await Tweet.findOneAndDelete({_id: req.params.id})
  const user = await User.findOne({_id: tweet.userID})

  console.log(user)

  user.tweets = user.tweets.filter((tweetID) => {
    console.log(tweetID)
    console.log(req.params.id)
    console.log(tweetID.equals(req.params.id))
    return !tweetID.equals(req.params.id)
  })

  await user.save()
  res.json(tweet)
})

module.exports = router;