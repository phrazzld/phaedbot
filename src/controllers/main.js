// phaedbot/src/controllers/main.js

const agent = require('@root/agent');

// TODO: Switch to EJS
const getHome = (req, res) => {
  res.render('home');
};

const postMessage = async (req, res) => {
  console.log('POST /message');
  try {
    const agentResponse = await agent.query(req.body.message);
    res
      .status(200)
      .json({agentResponse: agentResponse.queryResult.fulfillmentText});
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const postEvent = async (req, res) => {
  console.log('POST /event');
  try {
    const agentResponse = await agent.triggerEvent(req.body.eventName);
    res
      .status(200)
      .json({agentResponse: agentResponse.queryResult.fulfillmentText});
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

module.exports = {
  getHome,
  postMessage,
  postEvent,
};
