const Buster = require('./models/Buster');
const BusterOTM = require('./models/BusterOTM');
const getMonthString = require('./utils/getMonthString');
const getMonthName = require('./utils/getMonthName');
const getColor = require('./utils/getColor');

const busterOfTheMonth = async (date, client) => {
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

    // if my server save data
    if (guild.name === 'Keylords') {
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
