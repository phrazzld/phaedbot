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
    request.done(function (msg) {
      writeMessage(msg.result.fulfillment.speech)
    })
  })
}

$(document).ready(function () {
  $("#message-form").submit(function (e) {
    e.preventDefault()
    var query = $("#message-contents").val()
    var userMsg = "<div class='request row'><div class='col-xs-3 col-sm-2 col-sm    -offset-3 col-md-1 col-md-offset-4'><span class='author'>You</span></div><div class='    col-xs-9 col-sm-6 col-md-5'><p class='message'>" + query + "</p></div></div>"
    $("#chat").append(userMsg)
    $("#message-contents").val("")
    processRequest(query)
  })
})
