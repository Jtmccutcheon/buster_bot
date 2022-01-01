const axios = require('axios');
const { first } = require('lodash');

const fetchQuote = () =>
  axios
    .get('https://zenquotes.io/api/random/')
    .then(res => res.data)
    .then(data => first(data))
    .catch(() => ({
      q: 'qoute not found',
      a: 'buster_bot',
    }));

module.exports = fetchQuote;
