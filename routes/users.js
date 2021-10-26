const express = require('express')
const passport = require('passport')
const Tweet = require('../models/Tweet')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.get('/user/:id', async (req, res) => {
  const user = await User.findOne({_id: req.params.id})
  res.json(user)
})

// follow or unfollow a user
router.put('/user/follow/:parentUserID', async (req, res) => {
  const parentUser = await User.findById(req.params.parentUserID)
  const childUser = await User.findById(req.body.childUserID)

  if (!parentUser.followers.includes(req.body.childUserID)) {
    await parentUser.updateOne({ $push: { followers: req.body.childUserID } })
    await childUser.updateOne({ $push: { following: req.params.parentUserID } })
    const updatedParentUser = await User.findById(req.params.parentUserID)
    const updatedChildUser = await User.findById(req.body.childUserID)
    res.status(200).json({updatedParentUser, updatedChildUser})
  } else {
    await parentUser.updateOne({ $pull: { followers: req.body.childUserID } })
    await childUser.updateOne({ $pull: { following: req.params.parentUserID } })
    const updatedParentUser = await User.findById(req.params.parentUserID)
    const updatedChildUser = await User.findById(req.body.childUserID)
    res.status(200).json({updatedParentUser, updatedChildUser})
  }
})

// update user
router.put('/user/:id', async (req, res) => {
  if (req.body.email) {
    const userFound = await User.findOne({email: req.body.email})

    if (userFound) {
      res.json({error: 'Email already in use'})
      return
    }
  }

  if (req.body.username) {
    const userFound = await User.findOne({username: req.body.username})

    if (userFound) {
      res.json({error: 'Username taken'})
      return
    }
  }

  const user = await User.findById(req.params.id)
  await user.updateOne({ $set: req.body })
  const updatedUser = await User.findById(req.params.id)
  res.json(updatedUser)
})

module.exports = router;