const Discord = require('discord.js');
const getMonthName = require('../utils/getMonthName');
const getPrevMonthIndex = require('../utils/getPrevMonthIndex');
const getColor = require('../utils/getColor');
require('dotenv').config();

const date = new Date();
const year = date.getFullYear();

const buster = client => {
  client.guilds.cache.map(async guild => {
    if (guild.name === 'Keylords') {
      const { roles } = await guild;

      const serverRoles = await roles.fetch();

      const role = serverRoles.find(r =>
        r.name.includes(`BOTY ${Number(year) - 1}`),
      );
      const position = role.position + 1;
      console.log({ position });
      const newRole = {
        name: `BOTY ${year}`,
        color: getColor(),
        mentionable: true,
        hoist: true,
        position,
      };
      // roles.create(newRole);

      const refetchRoles = await roles.fetch('', { force: true });
      const keylords = refetchRoles
        .map(r => ({ name: r.name, position: r.position }))
        .sort((a, b) => b.position - a.position);

      console.log(keylords);
    }
  });
};

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS],
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  await buster(client);
});

client.login(process.env.CLIENT_TOKEN).then(() =>
  setTimeout(() => {
    client.destroy();
  }, 15000),
);
