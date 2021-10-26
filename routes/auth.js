const express = require('express')
const passport = require('passport')
const Tweet = require('../models/Tweet')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const router = express.Router()

module.exports = router;