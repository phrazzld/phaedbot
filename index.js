// base setup
var express = require('express')
var app = express()
var randomstring = require('randomstring')

// use static files
app.use(express.static('public'))

// set unique SESSION_ID as env var
process.env.SESSION_ID = randomstring.generate({ length: 12, charset: "numeric" })

// define our port
var port = process.env.PORT || 8080

// define some header handling middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials")
  res.header("Access-Control-Allow-Credentials", "true")
  next()
})

// define our router
var router = express.Router()

router.use(function (req, res, next) {
  console.log("Woooo middleware party!")
  next()
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.get('/env', (req, res) => {
  res.send(process.env)
})

app.listen(port)
console.log("port " + port + " goes 'whirrrrrrr...'")


