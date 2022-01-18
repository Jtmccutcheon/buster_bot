const Buster = require('./models/Buster');
const BusterOTM = require('./models/BusterOTM');
const Logs = require('./models/Logs');
const getMonthString = require('./utils/getMonthString');
const getMonthName = require('./utils/getMonthName');
const getColor = require('./utils/getColor');

const busterOfTheMonth = async (date, client) => {
  const timestamp = new Date().toISOString();
  const botmLog = new Logs({
    timestamp,
    log: 'BOTM Started',
    type: 'BOTM',
  });
  await botmLog.save();

  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const searchString = `${year}-${getMonthString(monthIndex)}`;

  const busters = await Buster.find({});

  const bustersWithWinsThisMonth = busters.filter(b => {
    const { datesWon } = b;
    const dates = datesWon.filter(d => d.startsWith(searchString));
    return dates.length > 0;
  });

  // filters datesWons to only current month
  // as well as extra mongo db metadata
  const busterDoodle = bustersWithWinsThisMonth.map(b => ({
    id: b.id,
    discordId: b.discordId,
    username: b.username,
    avatarUrl: b.avatarUrl,
    datesWon: b.datesWon.filter(d => d.startsWith(searchString)),
  }));

  // get most wins for this current month
  const getMostWins = () => {
    let max = 0;
    busterDoodle.forEach(b => {
      if (max < b.datesWon.length) {
        max = b.datesWon.length;
      }
    });
    return max;
  };

  // filter busters with most wins
  const winners = busterDoodle.filter(b => b.datesWon.length === getMostWins());
  const winnerLog = new Logs({
    timestamp,
    log: `winners ${JSON.stringify(winners)}`,
    type: 'BOTM',
  });
  await winnerLog.save();

  // create a string to mention winners
  const winnerString = () => {
    let str = '';
    // eslint-disable-next-line no-return-assign
    winners.map(w => (str += `<@${w.discordId}> `));
    return str;
  };

  // get winner ids
  const winnerIds = winners.map(w => w.discordId);

  client.guilds.cache.map(async guild => {
    if (guild.name === 'Keylords') {
      await guild.channels.fetch().then(channels => {
        const textChannels = channels.filter(
          channel => channel.type === 'GUILD_TEXT',
        );

        // debug channel
        // ['buster-testing']

        // channels
        // ['text-lords', 'general', 'buster']

        const generals = textChannels.filter(textChannel =>
          ['text-lords', 'general', 'buster'].includes(textChannel.name),
        );

        const channelLog = new Logs({
          timestamp,
          log: `POSTING TO GUILD ${guild.name} IN CHANNELS ${generals
            .map(general => general.name)
            .join(',')}`,
          type: 'DISCORD_CHANNEL',
        });
        channelLog.save();

        // message channel with buster winners
        generals.map(general =>
          general.send(
            `Congratulations ${winnerString()} on becoming Buster(s) of the Month ${getMonthName(
              monthIndex,
            )} ${year}`,
          ),
        );
      });

      // create role for current month
      const { roles } = await guild;
      const newRole = {
        name: `BOTM ${getMonthName(monthIndex)} ${year}`,
        color: getColor(),
      };
      roles.create(newRole);
      const createRoleLog = new Logs({
        timestamp,
        log: `creating role BOTM ${getMonthName(monthIndex)} ${year}`,
        type: 'DISCORD_CHANNEL',
      });
      createRoleLog.save();

      // get members from server that match winnerIds
      const members = await guild.members
        .fetch()
        .then(allGuildMembers =>
          allGuildMembers.toJSON().filter(m => winnerIds.includes(m.user.id)),
        )
        .catch(() => []);

      // get role we created earlier from the server
      const serverRoles = await roles.fetch();
      const botmRole = serverRoles.find(
        r => r.name === `BOTM ${getMonthName(monthIndex)} ${year}`,
      );

      // add role to winners
      members.map(m => m.roles.add(botmRole));

      const addedRoleLog = new Logs({
        timestamp,
        log: `Adding role ${botmRole.name} to members ${members
          .map(m => m.user.username)
          .join(',')}`,
        type: 'DISCORD_CHANNEL',
      });

      addedRoleLog.save();

      const newBusterOTM = new BusterOTM({
        year,
        month: getMonthName(monthIndex),
        busters: winners,
      });

      await newBusterOTM.save();
    }
  });
};

module.exports = busterOfTheMonth;
