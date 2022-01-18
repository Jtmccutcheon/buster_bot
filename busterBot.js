/* eslint-disable no-console */
require('dotenv').config();
const Discord = require('discord.js');
const cron = require('node-cron');
const dbConnect = require('./dbConnect');
const busterOfTheDay = require('./busterOfTheDay');
const busterOfTheMonth = require('./busterOfTheMonth');
const isLastDayOfMonth = require('./utils/isLastDayOfMonth');

// Buster of the day
cron.schedule(
  '9 18 * * *',
  () => {
    const client = new Discord.Client({
      intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
      ],
    });

    client.on('ready', async () => {
      console.log(`Logged in as ${client.user.tag}!`);
      dbConnect();

      busterOfTheDay(client);
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

// buster of the month
cron.schedule(
  '50 2 22 28-31 * *',
  () => {
    if (isLastDayOfMonth()) {
      const client = new Discord.Client({
        intents: [
          Discord.Intents.FLAGS.GUILDS,
          Discord.Intents.FLAGS.GUILD_MEMBERS,
        ],
      });

      client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        dbConnect();

        const date = new Date();

        busterOfTheMonth(date, client);
      });

      client.login(process.env.CLIENT_TOKEN).then(() =>
        setTimeout(() => {
          client.destroy();
        }, 10000),
      );
    }
  },
  {
    scheduled: true,
    timezone: 'America/New_York',
  },
);
