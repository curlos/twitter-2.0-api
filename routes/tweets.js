const express = require('express')
const passport = require('passport')
const Tweet = require('../models/Tweet')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const router = express.Router()

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
    const tweet = await new Tweet({
      userID: req.body.userID,
      text: req.body.text
    })

    await tweet.save()

    res.status(200).json(tweet)
  } catch (err) {
    res.json({error: err})
  }
})

// like or dislike a tweet
router.put('/tweet/like/:tweetID', async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetID)
    console.log(tweet)

    if (!tweet.likes.includes(req.body.userID)) {
      await tweet.updateOne({ $push: { likes: req.body.userID } })
      const updatedTweet = await Tweet.findById(req.params.tweetID)
      res.status(200).json(updatedTweet)
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.userID } })
      const updatedTweet = await Tweet.findById(req.params.tweetID)
      res.status(200).json(updatedTweet)
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

// retweet or un-retweet a tweet
router.put('/tweet/retweet/:tweetID', async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetID)
    console.log(tweet)

    if (!tweet.retweets.includes(req.body.userID)) {
      await tweet.updateOne({ $push: { retweets: req.body.userID } })
      const updatedTweet = await Tweet.findById(req.params.tweetID)
      res.status(200).json(updatedTweet)
    } else {
      await tweet.updateOne({ $pull: { retweets: req.body.userID } })
      const updatedTweet = await Tweet.findById(req.params.tweetID)
      res.status(200).json(updatedTweet)
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router;