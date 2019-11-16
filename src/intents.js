// phaedbot/src/intents.js

const formatTrainingPhrases = trainingPhrases => {
  return trainingPhrases.map(trainingPhrase => {
    return {type: 'EXAMPLE', parts: [{text: trainingPhrase}]};
  });
};

const formatResponses = responses => {
  return responses.map(response => {
    return {text: {text: [response]}};
  });
};

// Given a string, array of strings, and array of strings
// Return a blob
const createIntentBlob = blob => {
  return {
    displayName: blob.displayName,
    trainingPhrases: formatTrainingPhrases(blob.trainingPhrases),
    messages: formatResponses(blob.responses),
    priority: blob.priority || 500000,
    isFallback: blob.isFallback || false,
    mlDisabled: blob.mlDisabled || false,
    inputContextNames: blob.inputContextNames || [],
    outputContexts: blob.outputContexts || [],
    resetContexts: blob.resetContexts || false,
    events: blob.events || [],
    action: blob.action || '',
    parameters: blob.parameters || [],
  };
};

const workExperience = () => {
  return createIntentBlob({
    displayName: 'Work Experience',
    trainingPhrases: [
      'Work experience',
      'Tell me about your work experience',
      'What is your work history like?',
    ],
    responses: [
      'In the past, people have given me money in exchange for goods an services.',
      'I have worked at places for people doing things.',
    ],
  });
};

const sideProjects = () => {
  return createIntentBlob({
    displayName: 'Side Projects',
    trainingPhrases: [
      'Side projects',
      'Tell me about your side projects.',
      'What projects have you worked on?',
    ],
    responses: [
      'I started a sustainable food production company on the faulty premise that aquaponics could substitute fish for ground coffee waste.',
      'I built this Phaedbot here.',
    ],
  });
};

const activeIntents = () => {
  return [workExperience(), sideProjects()];
};

module.exports = activeIntents();
