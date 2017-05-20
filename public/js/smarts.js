var v = "20150930"
// scroll the chat as messages are added
var scrollChat = function () {
  var chat = $("#chat")
  chat.animate({ scrollTop: chat.prop("scrollHeight") }, 2000)
}

// handle user queries
var processRequest = function (query) {
  var request = $.ajax({
    data: { "query": query, "v": v },
    dataType: "json",
    type: "POST",
    url: "/message"
  })
  request.done(function (message) {
    if (message.result.fulfillment.speech !== "")
      writeBotMessage(message)
    if (message.result.action === "getBitcoinPrice")
      setTimeout(getBitcoinPrice, 1000)
    else if (message.result.action === "getCurrentAge")
      setTimeout(getCurrentAge, 1000)
  })
}

// calculate Phaedrus's current age
var getCurrentAge = function () {
  var birthday = new Date("08/30/1992")
  var today = new Date()
  var age = Math.floor((today - birthday) / (365.25 * 24 * 60 * 60 * 1000))
  var nextAge = age + 1
  var monthsTillBirthday = birthday.getMonth() - today.getMonth()
  var ageMessage = "He is " + age
  if (monthsTillBirthday >= 0 && monthsTillBirthday < 4) {
    ageMessage += ", turning " + nextAge + " on August 30"
  }
  if (monthsTillBirthday === 0) {
    ageMessage += " (so soon!)"
  }
  ageMessage += "."
  writeMessage(ageMessage, false)
}

// welcome logic
var howdy = function () {
  var request = $.ajax({
    data: { "e": "WELCOME", "v": v },
    dataType: "json",
    type: "POST",
    url: "/welcome"
  })
  request.done(function (message) {
    writeBotMessage(message)
  })
}

// fetch the current Bitcoin price from the CoinDesk API
var getBitcoinPrice = function () {
  var btcRequest = $.ajax({
    type: "GET",
    url: "http://api.coindesk.com/v1/bpi/currentprice.json",
    error: function (data, textStatus, jqXHR) {
      console.log("Error! Could not fetch access token.")
    }
  })
  btcRequest.done(function (message) {
    var btcMsg = "$" + JSON.parse(message).bpi.USD.rate
    writeMessage(btcMsg, false)
  })
}

// is Phaedbot writing one message or a chain?
var writeBotMessage = function (message) {
  var response = message.result.fulfillment
  if (response.messages.length === 1)
    writeMessage(response.speech, false)
  else {
    for (var i = 0; i < response.messages.length; i++) {
      setTimeout(writeMessage, 1500 * i+1, response.messages[i].speech, false)
    }
  }
}

// write a message to the chat
var writeMessage = function (message, fromUser) {
  var wrapperDiv = document.createElement("div")
  wrapperDiv.className = fromUser ? "request row" : "response row"
  var authorDiv = document.createElement("div")
  authorDiv.className = "col-xs-3 col-sm-2 col-sm-offset-3 col-md-1 col-md-offset-4"
  var authorSpan = document.createElement("span")
  authorSpan.className = "author"
  var author = document.createTextNode(fromUser ? "You" : "Phaedbot")
  authorSpan.appendChild(author)
  authorDiv.appendChild(authorSpan)
  var messageDiv = document.createElement("div")
  messageDiv.className = "col-xs-9 col-sm-6 col-md-5"
  var messageP = document.createElement("p")
  messageP.className = "message"
  var messageText = document.createTextNode(message)
  messageP.appendChild(messageText)
  messageDiv.appendChild(messageP)
  wrapperDiv.appendChild(authorDiv)
  wrapperDiv.appendChild(messageDiv)
  $("#chat").append(wrapperDiv)
  if (fromUser) {
    $("#message-contents").val("")
  } else {
    $("#chat div.response").last()
      .css("opacity", 0)
      .slideDown(500)
      .animate({ opacity: 1 }, { queue: false }, { duration: 2000 })
    setTimeout(scrollChat, 500)
  }
}


// page lifecycle
$(document).ready(function () {
  // Phaedbot starts the conversation
  howdy()

  // process messages on form submit
  $("#message-form").submit(function (e) {
    e.preventDefault()
    var query = $("#message-contents").val()
    writeMessage(query, true)
    processRequest(query)
  })
})
