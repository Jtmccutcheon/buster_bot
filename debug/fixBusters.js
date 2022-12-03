const moment = require('moment');
const Buster = require('../models/Buster');

const dbConnect = require('../db/dbConnect');

// run this locally if busters table gets out of order
// or any other shenanigans
// // replace this with new json file when needed to run
// const busters = require('../backups/2022-02-21.json');
// // Buster.insertMany(busters);
const date = new Date();
console.log(date);
console.log(moment());
console.log(moment().format('YYYY-MM-DD'));
console.log(date.getFullYear());
console.log(date.getDay());
console.log(date.getMonth());
