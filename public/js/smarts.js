var writeMessage = function (res) {
  var responseMessage = "<div class='response row'><div class='col-xs-3 col-sm-2 col-sm-offset-3 col-md-1 col-md-offset-4'><span class='author'>Phaedbot</span></div><div class='col-xs-9 col-sm-6 col-md-5'><p class='message'>" + res + "</p></div></div>"
  $("#chat").append(responseMessage)
  $("#chat div.response").last().css("opacity", 0).slideDown(500).animate( { opacity: 1 }, { queue: false, duration: 2000 })
  setTimeout(scrollChat, 500)
}

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
    })
  })
}

var writeBotMessage = function (message) {
  var response = message.result.fulfillment
  if (response.messages.length === 1)
    writeMessage(response.speech)
  else {
    for (var i = 0; i < response.messages.length; i++) {
      setTimeout(writeMessage, 1500 * i+1, response.messages[i].speech)
    }
  }
}

var writeUserMessage = function (query) {
  var requestDiv = document.createElement("div")
  requestDiv.className = "request row"
  var authorDiv = document.createElement("div")
  authorDiv.className = "col-xs-3 col-sm-2 col-sm-offset-3 col-md-1 col-md-offset-4"
  var authorSpan = document.createElement("span")
  authorSpan.className = "author"
  var author = document.createTextNode("You")
  authorSpan.appendChild(author)
  authorDiv.appendChild(authorSpan)
  var msgDiv = document.createElement("div")
  msgDiv.className = "col-xs-9 col-sm-6 col-md-5"
  var msgP = document.createElement("p")
  msgP.className = "message"
  var msg = document.createTextNode(query)
  msgP.appendChild(msg)
  msgDiv.appendChild(msgP)
  requestDiv.appendChild(authorDiv)
  requestDiv.appendChild(msgDiv)
  $("#chat").append(requestDiv)
  $("#message-contents").val("")
}


$(document).ready(function () {
  $("#message-form").submit(function (e) {
    e.preventDefault()
    var query = $("#message-contents").val()
    writeUserMessage(query)
    processRequest(query)
  })
})
