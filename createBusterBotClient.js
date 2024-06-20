/* eslint-disable no-console */
const Discord = require('discord.js');
const { dbConnect, dbDisconnect } = require('./db');
require('dotenv').config();

const createBusterBotClient = operation => {
  dbConnect();
  const client = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
    ],
  });

  client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    await operation(client);
  });

  client.login(process.env.CLIENT_TOKEN).then(() =>
    // wait 15 seconds and log out of discord
    // may need to be longer the more servers
    // buster bot is invited too
    setTimeout(() => {
      client.destroy();
    }, 15000),
  );

  // wait 5 minutes for all cron jobs to finish
  // and close mongo connection
  // setTimeout(() => {
  //   console.log('...disconnecting from mongoDB');
  //   dbDisconnect();
  // }, 300000);
};

module.exports = createBusterBotClient;
