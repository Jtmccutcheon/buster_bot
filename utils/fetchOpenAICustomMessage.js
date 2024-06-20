const { OpenAI } = require('openai');
const { createLogs } = require('../db/createLogs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fetchOpenAICustomMessage = async (
  randomMemberUsername,
  datesWon,
  quote,
  randomMemberId,
  randomMemberNickname,
  // eslint-disable-next-line consistent-return
) => {
  // const prompt = `write an over the top extremely sarcastic or ridiculous congratulations message for ${randomMemberNickname} on their ${
  //   datesWon.length + 1
  // } overall wins including the meaning of this quote ${
  //   quote.q
  // }  and add some overly aggressive positive smack talk for them and absolutely dunk on everyone else and sprinkle emojis throughout especially the flexing one`;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      max_tokens: 600,
      messages: [
        {
          role: 'system',
          content:
            'imagine you are a bird human hyrbid race that thinks they are better than humanity',
        },
        {
          role: 'user',
          content: `friendly trash talk my friend ${randomMemberUsername}`,
        },
      ],
    });
    console.log(completion.choices[0].message);
    return completion.choices[0].message.content;
  } catch (error) {
    console.log(error.response);
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
