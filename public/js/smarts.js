var scrollChat = function () {
  var chat = $("#chat")
  chat.animate({ scrollTop: chat.prop("scrollHeight") }, 2000)
}

var processRequest = function (query) {
  var envRequest = $.ajax({
    error: function (data, textStatus, jqXHR) {
      console.log("Error! Could not fetch access token")
    },
    type: "GET",
    url: "/env"
  })
  envRequest.done(function (configs) {
    var token = "Bearer " + configs.CLIENT_ACCESS_TOKEN
    var request = $.ajax({
      data: {
        "query": query,
        "sessionId": configs.SESSION_ID,
        "token": token
      },
      dataType: "json",
      type: "POST",
      url: "/message"
    })
    request.done(function (message) {
      writeBotMessage(message)
      if (message.result.action === "getBitcoinPrice") {
        setTimeout(getBitcoinPrice, 1000)
      }
    })
  })
}

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
  setTimeout(writeMessage, 1000, "Hey there! I'm Phaedbot, a chatbot made by Phaedrus to add some pizzazz to his profile site.", false)
  setTimeout(writeMessage, 2500, "You can ask me anything, but I'm best at talking about Phaedrus.", false)

  // process messages on form submit
  $("#message-form").submit(function (e) {
    e.preventDefault()
    var query = $("#message-contents").val()
    writeMessage(query, true)
    processRequest(query)
  })
})
