// scroll the chat as messages are added
const scrollChat = function() {
  const chat = $('#chat');
  chat.animate({scrollTop: chat.prop('scrollHeight')}, 2000);
};

const triggerEvent = eventName => {
  const req = $.ajax({
    data: {eventName: eventName},
    dataType: 'json',
    type: 'POST',
    url: '/event',
  });
  req.done(res => {
    const message = res.agentResponse;
    writeBotMessage(message);
  });
};

// handle user queries
const processRequest = query => {
  const req = $.ajax({
    data: {message: query},
    dataType: 'json',
    type: 'POST',
    url: '/message',
  });
  req.done(function(res) {
    const message = res.agentResponse;
    writeBotMessage(message);
    /*
    if (message.result.action === 'getBitcoinPrice') {
      setTimeout(getBitcoinPrice, 1500);
    } else if (message.result.action === 'getCurrentAge') {
      setTimeout(getCurrentAge, 1500);
    } else if (message.result.action === 'getProjectDetails') {
      setTimeout(getDetails, 1500, message.result.parameters.Project);
    } else if (message.result.action === 'getWorkDetails') {
      setTimeout(getDetails, 1500, message.result.parameters.Work);
    } else if (message.result.action === 'getResume') {
      writeResumeMessage();
    } else if (message.result.action === 'expandWork') {
      // confirm request
      writeMessage('Sure thing!', false);
      // hit each work details endpoint
      setTimeout(expandAllDetails, 1000, workHistory);
    } else if (message.result.action === 'expandProjects') {
      writeMessage('Alright!', false);
      setTimeout(expandAllDetails, 1000, projectHistory);
    }
    */
  });
};

// calculate Phaedrus's current age
const getCurrentAge = function() {
  const birthday = new Date('08/30/1992');
  const today = new Date();
  const age = Math.floor((today - birthday) / (365.25 * 24 * 60 * 60 * 1000));
  const nextAge = age + 1;
  const monthsTillBirthday = birthday.getMonth() - today.getMonth();
  let ageMessage = 'He is ' + age;
  if (monthsTillBirthday >= 0 && monthsTillBirthday < 4) {
    ageMessage += ', turning ' + nextAge + ' on August 30';
  }
  if (monthsTillBirthday === 0) {
    ageMessage += ' (so soon!)';
  }
  ageMessage += '.';
  writeMessage(ageMessage, false);
};

// welcome logic
const howdy = function() {
  console.log('howdy() called');
  //processRequest('Hello');
  triggerEvent('Welcome');
};

// send event request
const requestEvent = function(event) {
  const request = $.ajax({
    data: {v: v, e: event},
    dataType: 'json',
    type: 'POST',
    url: '/event-handler',
  });
  request.done(function(message) {
    writeBotMessage(message);
  });
};

// trigger event for specific details
const getDetails = function(exp) {
  const event = exp + '-details';
  requestEvent(event);
};

// loop over array of items, make -details calls for each
const expandAllDetails = function(items) {
  const request = $.ajax({
    url: '/event-handler',
    type: 'POST',
    dataType: 'json',
    data: {v: v, e: items.splice(0, 1) + '-details'},
    success: function(data, status, xhr) {
      const numMessages = data.result.fulfillment.messages.length;
      writeBotMessage(data);
      if (items.length > 0)
        setTimeout(expandAllDetails, 3500 * numMessages, items);
      else setTimeout(requestEvent, 3500 * numMessages, 'upto');
    },
  });
};

// fetch the current Bitcoin price from the CoinDesk API
const getBitcoinPrice = function() {
  const btcRequest = $.ajax({
    type: 'GET',
    url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
    error: function(data, textStatus, jqXHR) {
      console.log('Error! Could not fetch Coindesk access token.');
    },
  });
  btcRequest.done(function(message) {
    const btcMsg = '$' + JSON.parse(message).bpi.USD.rate;
    writeMessage(btcMsg, false);
  });
};

// is Phaedbot writing one message or a chain?
const writeBotMessage = function(message) {
  writeMessage(message, false);
  /*
  if (response.messages.length === 1) writeMessage(response.speech, false);
  else {
    for (const i = 0; i < response.messages.length; i++) {
      setTimeout(
        writeMessage,
        1500 * i + 1,
        response.messages[i].speech,
        false,
      );
    }
  }
  */
};

// write message with link to resume
const writeResumeMessage = function() {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'response row';
  const authorDiv = document.createElement('div');
  authorDiv.className =
    'col-xs-3 col-sm-2 col-sm-offset-3 col-md-1 col-md-offset-4';
  const authorSpan = document.createElement('span');
  authorSpan.className = 'author';
  const author = document.createTextNode('Phaedbot');
  authorSpan.appendChild(author);
  authorDiv.appendChild(authorSpan);
  const messageDiv = document.createElement('div');
  messageDiv.className = 'col-xs-9 col-sm-6 col-md-4';
  const messageP = document.createElement('p');
  messageP.className = 'message';
  messageP.innerHTML =
    "You can see Phaedrus's resume by clicking the PDF icon at the top of the page, or by clicking <a href='../images/resume.pdf' target='_blank'>this link</a>.";
  messageDiv.appendChild(messageP);
  wrapperDiv.appendChild(authorDiv);
  wrapperDiv.appendChild(messageDiv);
  $('#chat').append(wrapperDiv);
  $('#chat div.response')
    .last()
    .css('opacity', 0)
    .slideDown(500)
    .animate({opacity: 1}, {queue: false}, {duration: 1500});
  setTimeout(scrollChat, 1000);
};

// write a message to the chat
const writeMessage = function(message, fromUser) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = fromUser ? 'request row' : 'response row';
  const authorDiv = document.createElement('div');
  authorDiv.className =
    'col-xs-3 col-sm-2 col-sm-offset-3 col-md-1 col-md-offset-4';
  const authorSpan = document.createElement('span');
  authorSpan.className = 'author';
  const author = document.createTextNode(fromUser ? 'You' : 'Phaedbot');
  authorSpan.appendChild(author);
  authorDiv.appendChild(authorSpan);
  const messageDiv = document.createElement('div');
  messageDiv.className = 'col-xs-9 col-sm-6 col-md-4';
  const messageP = document.createElement('p');
  messageP.className = 'message';
  const messageText = document.createTextNode(message);
  messageP.appendChild(messageText);
  messageDiv.appendChild(messageP);
  wrapperDiv.appendChild(authorDiv);
  wrapperDiv.appendChild(messageDiv);
  $('#chat').append(wrapperDiv);
  if (fromUser) {
    $('#message-contents').val('');
  } else {
    $('#chat div.response')
      .last()
      .css('opacity', 0)
      .slideDown(500)
      .animate({opacity: 1}, {queue: false}, {duration: 1500});
  }
  setTimeout(scrollChat, 1000);
};

// page lifecycle
$(document).ready(function() {
  // Set copyright year
  const year = new Date().getFullYear();
  document.getElementById('copyright').innerHTML =
    'Copyright \u00A9 ' + year + ' Phaedrus';
  // focus on user input element
  $('#message-contents').focus();
  // Phaedbot starts the conversation
  howdy();
  // process messages on form submit
  $('#message-form').submit(function(e) {
    e.preventDefault();
    const query = $('#message-contents').val();
    writeMessage(query, true);
    processRequest(query);
  });
});
