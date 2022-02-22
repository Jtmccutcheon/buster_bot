/* eslint-disable no-console */
const Discord = require('discord.js');
const dbConnect = require('./dbConnect');

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
    setTimeout(() => {
      client.destroy();
    }, 15000),
  );
};

module.exports = createBusterBotClient;
