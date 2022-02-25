// run this locally if busters table gets out of order
// or any other shenanigans

const Buster = require('../models/Buster');
// // replace this with new json file when needed to run
// const busters = require('../backups/2022-02-21.json');
const dbConnect = require('../db/dbConnect');

// // Buster.insertMany(busters);

async function bust() {
  dbConnect();
  await Buster.syncIndexes();
}

bust();
