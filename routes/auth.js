const express = require('express')
const passport = require('passport')
const Tweet = require('../models/Tweet')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.get("/logout", (req, res) => {
  console.log('Logging out user')
  const user = req.user
  req.logout();
  res.json({...user})
});

router.post("/register", async (req, res, next) => {
  const newEmail = req.body.email
  const newPassword = req.body.password

  const userFound = await User.find({lowerCaseEmail: newEmail.toLowerCase().trim()})

  if (userFound.length > 0) {
    return res.json({error: 'Email taken'})
  }

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      return err
    }

    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      lowerCaseEmail: req.body.email.toLowerCase()
    }).save((err, result) => {
      if (err) { 
        return next(err);
      }
      console.log('no err')
      res.json({'result': result})
    });
  })
});

router.post("/login", (req, res, next) => {

  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    console.log(user)
    if (!user) res.send("Wrong credentials");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json({user: req.user});
        console.log(req.user);
      });
    }
  })(req, res, next);
});

module.exports = router;