var writeMessage = function (req, res) {
  // append msg content with author
  var requestMessage = "<div class='request row'><div class='col-xs-3 col-sm-2 col-sm-offset-3 col-md-1 col-md-offset-4'><span class='author'>You</span></div><div class='col-xs-9 col-sm-6 col-md-5'><p class='message'>" + req + "</p></div></div>"
  var responseMessage = "<div class='response row'><div class='col-xs-3 col-sm-2 col-sm-offset-3 col-md-1 col-md-offset-4'><span class='author'>Phaedbot</span></div><div class='col-xs-9 col-sm-6 col-md-5><p class='message'>" + res + "</p></div></div>"
  $("#chat").append(requestMessage)
  $("#chat").append(responseMessage)
  $("#message-contents").val("")
  scrollChat()
}

var scrollChat = function () {
  var chat = $("#chat")
  chat.scrollTop(chat[0].scrollHeight)
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
    request.done(function (msg) {
      writeMessage(query, msg.result.fulfillment.speech)
    })
  })
}

$(document).ready(function () {
  $("#message-form").submit(function (e) {
    e.preventDefault()
    var query = $("#message-contents").val()
    processRequest(query)
  })
})
