const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const tweetRoute = require('./routes/tweets')

dotenv.config()
const database = require('./database/connection')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/images', express.static(path.join(__dirname, '/images')))

app.use(session({ secret: "cats", resave: false, saveUnitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
require('./passport/config')(passport)

app.use('/users', userRoute)
app.use('/auth', authRoute)
app.use('/tweets', tweetRoute)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name || file.name)
  }
})

const upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json('File has been uploaded')
})

const PORT = process.env.PORT || 8888

app.listen(PORT, () => {
  database.connectToServer((err) => {
    if (err) {
      console.error(err)
    }
  })

  console.log(`Server is listening on port ${PORT}`)
})


