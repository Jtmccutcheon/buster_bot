const { Configuration, OpenAIApi } = require('openai');
const { createLogs } = require('../db/createLogs');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const fetchOpenAICustomMessage = async (
  randomMemberUsername,
  datesWon,
  quote,
  randomMemberId,
  randomMemberNickname,
  // eslint-disable-next-line consistent-return
) => {
  const prompt = `write an over the top extremely sarcastic or ridiculous congratulations message for ${randomMemberNickname} on their ${
    datesWon.length + 1
  } overall wins including the meaning of this quote ${
    quote.q
  }  and add some overly aggressive positive smack talk for them and absolutely dunk on everyone else and sprinkle emojis throughout especially the flexing one`;
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      // curie sucks
      // model: 'text-curie-001',
      max_tokens: 600,
      prompt,
    });
    return completion.data.choices[0].text;
  } catch (error) {
    if (error.response) {
      const log = {
        status: error.response.status,
        data: error.response.data,
      };
      createLogs({
        log: 'ERROR WITH RESPONSE',
        error: JSON.stringify(log),
        type: 'OPENAI',
      });
    } else {
      createLogs({
        log: 'ERROR WITHOUT RESPONSE',
        error: JSON.stringify(error),
        type: 'OPENAI',
      });
    }
  }
};

module.exports = fetchOpenAICustomMessage;
