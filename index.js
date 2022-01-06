/* eslint-disable no-console */
require('dotenv').config();
const Discord = require('discord.js');
const cron = require('node-cron');
const main = require('./main');
const dbConnect = require('./dbConnect');

cron.schedule(
  '9 18 * * *',
  () => {
    const client = new Discord.Client({
      intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
      ],
    });

    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      dbConnect();

      main(client);
    });

    client.login(process.env.CLIENT_TOKEN).then(() =>
      setTimeout(() => {
        client.destroy();
      }, 10000),
    );
  },
  {
    scheduled: true,
    timezone: 'America/New_York',
  },
);
