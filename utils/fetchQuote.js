const axios = require('axios');

const fetchQuote = () =>
  axios
    .get('https://zenquotes.io/api/random/')
    .then(res => res.data[0])
    .catch(() => ({
      q: 'quote not found',
      a: 'buster_bot',
    }));

module.exports = fetchQuote;
