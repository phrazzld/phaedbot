// base setup
var express = require('express')
var app = express()
var randomstring = require('randomstring')
var sanitizer = require('express-sanitizer')
var bodyParser = require('body-parser')
var request = require('request')

// use static files
app.use(express.static('public'))

// parse POSTs
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sanitizer())

// set unique SESSION_ID as env var
process.env.SESSION_ID = randomstring.generate({ length: 12, charset: "numeric" })

// check for CLIENT_ACCESS_TOKEN
if (process.env.CLIENT_ACCESS_TOKEN === undefined) {
  console.log("Check your environment variables, you're missing your access token!")
}

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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.get("/env", (req, res) => {
  res.send(process.env)
})

app.post("/message", (req, res) => {
  // sanitize user input
  req.body.sanitizedQuery = req.sanitize(req.body.query)
  var url = "https://api.api.ai/v1/query?v=" + req.body.v + "&query=" + req.body.sanitizedQuery + "&lang=en&sessionId=" + req.body.sessionId
  var opts = {
    "url": url,
    "headers": { "Authorization": req.body.token }
  }
  // build and submit GET request to API.AI
  request(opts, function (error, response, body) {
    res.send(body)
  })
})

app.listen(port)
console.log("port " + port + " goes 'whirrrrrrr...'")
