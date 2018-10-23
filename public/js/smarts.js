var v = "20150930"
var workHistory = ["RingRevenue", "FarmPlus", "ASAP", "BettermentLabs", "Novacoast"]
var projectHistory = ["TimeIsMoney", "Insights", "FeedingTube", "TIMO", "Rubberduck"]
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
    if (message.result.fulfillment.speech !== "") {
      writeBotMessage(message)
    }
    if (message.result.action === "getBitcoinPrice") {
      setTimeout(getBitcoinPrice, 1500)
    } else if (message.result.action === "getCurrentAge") {
      setTimeout(getCurrentAge, 1500)
    } else if (message.result.action === "getProjectDetails") {
      setTimeout(getDetails, 1500, message.result.parameters.Project)
    } else if (message.result.action === "getWorkDetails") {
      setTimeout(getDetails, 1500, message.result.parameters.Work)
    } else if (message.result.action === "getResume") {
      writeResumeMessage()
    } else if (message.result.action === "expandWork") {
      // confirm request
      writeMessage("Sure thing!", false)
      // hit each work details endpoint
      setTimeout(expandAllDetails, 1000, workHistory)
    } else if (message.result.action === "expandProjects") {
      writeMessage("Alright!", false)
      setTimeout(expandAllDetails, 1000, projectHistory)
    }
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
  requestEvent("WELCOME")
}

// send event request
var requestEvent = function (event) {
  var request = $.ajax({
    data: { "v": v, "e": event },
    dataType: "json",
    type: "POST",
    url: "/event-handler"
  })
  request.done(function (message) {
    writeBotMessage(message)
  })
}

// trigger event for specific details
var getDetails = function (exp) {
  var event = exp + "-details"
  requestEvent(event)
}

// loop over array of items, make -details calls for each
var expandAllDetails = function (items) {
  var request = $.ajax({
    url: "/event-handler",
    type: "POST",
    dataType: "json",
    data: { "v": v, "e": items.splice(0,1) + "-details" },
    success: function (data, status, xhr) {
      var numMessages = data.result.fulfillment.messages.length
      writeBotMessage(data)
      if (items.length > 0)
        setTimeout(expandAllDetails, 3500*numMessages, items)
      else
        setTimeout(requestEvent, 3500*numMessages, "upto")
    }
  })
}

// fetch the current Bitcoin price from the CoinDesk API
var getBitcoinPrice = function () {
  var btcRequest = $.ajax({
    type: "GET",
    url: "http://api.coindesk.com/v1/bpi/currentprice.json",
    error: function (data, textStatus, jqXHR) {
      console.log("Error! Could not fetch Coindesk access token.")
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

// write message with link to resume
var writeResumeMessage = function () {
  var wrapperDiv = document.createElement("div")
  wrapperDiv.className = "response row"
  var authorDiv = document.createElement("div")
  authorDiv.className = "col-xs-3 col-sm-2 col-sm-offset-3 col-md-1 col-md-offset-4"
  var authorSpan = document.createElement("span")
  authorSpan.className = "author"
  var author = document.createTextNode("Phaedbot")
  authorSpan.appendChild(author)
  authorDiv.appendChild(authorSpan)
  var messageDiv = document.createElement("div")
  messageDiv.className = "col-xs-9 col-sm-6 col-md-4"
  var messageP = document.createElement("p")
  messageP.className = "message"
  messageP.innerHTML = "You can see Phaedrus's resume by clicking the PDF icon at the top of the page, or by clicking <a href='../images/resume.pdf' target='_blank'>this link</a>."
  messageDiv.appendChild(messageP)
  wrapperDiv.appendChild(authorDiv)
  wrapperDiv.appendChild(messageDiv)
  $("#chat").append(wrapperDiv)
  $("#chat div.response").last()
    .css("opacity", 0)
    .slideDown(500)
    .animate({ opacity: 1 }, { queue: false }, { duration: 1500 })
  setTimeout(scrollChat, 1000)
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
  messageDiv.className = "col-xs-9 col-sm-6 col-md-4"
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
      .animate({ opacity: 1 }, { queue: false }, { duration: 1500 })
  }
  setTimeout(scrollChat, 1000)
}


// page lifecycle
$(document).ready(function () {
  // Set copyright year
  $("#copyright").innerHTML = "Copyright \u00A9 " + Date.getYear() + " Phaedrus"
  // focus on user input element
  $("#message-contents").focus()
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
