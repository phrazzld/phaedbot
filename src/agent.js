// phaedbot/src/agent.js

const config = require('@root/config');
const dialogflow = require('dialogflow');
const uuid = require('uuid');

const generateSessionId = () => {
  return uuid.v4();
};

const generateDialogflowRequest = (query, languageCode, formattedSession) => {
  return {
    session: formattedSession,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };
};

const generateNewSession = (client, projectId = config.projectId) => {
  return client.sessionPath(projectId, generateSessionId());
};

// TODO: Right now every fresh query to the agent generates and uses a new session.
// It should not.
const query = async (query, projectId = config.projectId) => {
  const client = new dialogflow.v2.SessionsClient();
  const formattedSession = generateNewSession(client, projectId);
  const request = generateDialogflowRequest(query, 'en-US', formattedSession);
  const responses = await client.detectIntent(request);
  const response = responses[0];
  return response;
};

const triggerEvent = async (eventName, projectId = config.projectId) => {
  const client = new dialogflow.v2.SessionsClient();
  const formattedSession = generateNewSession(client, projectId);
  const request = {
    session: formattedSession,
    queryInput: {
      event: {
        name: eventName,
        languageCode: 'en-US',
      },
    },
  };
  const responses = await client.detectIntent(request);
  const response = responses[0];
  return response;
};

module.exports = {
  query,
  triggerEvent,
};
