const Buster = require('../models/Buster');
const BusterOTM = require('../models/BusterOTM');
const createLogs = require('../db/createLogs');
const {
  getColor,
  getMonthString,
  getMonthName,
  getPrevMonthIndex,
  getMostWins,
  createWinnerString,
} = require('../utils');

const busterOfTheMonth = client =>
  Promise.all(
    client.guilds.cache.map(async guild => {
      // we are only tracking botm for my server
      if (guild.name === 'Keylords') {
        const date = new Date();
        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        const searchString = `${year}-${getMonthString(monthIndex)}`;

        createLogs({
          log: `BOTM ${getMonthName(monthIndex)} ${year} INITIATED`,
          type: 'BOTM',
        });

        const busters = await Buster.find({});

        const bustersWithWinsThisMonth = busters.filter(b => {
          const dates = b.datesWon.filter(d => d.startsWith(searchString));
          return dates.length > 0;
        });

        // filters datesWons to only current month
        // as well as extra mongo db metadata
        const busterDoodle = bustersWithWinsThisMonth.map(b => ({
          discordId: b.discordId,
          username: b.username,
          avatarUrl: b.avatarUrl,
          datesWon: b.datesWon.filter(d => d.startsWith(searchString)),
        }));

        // get most wins for this current month
        const maxWins = getMostWins(busterDoodle);

        // filter busters with most wins
        const winners = busterDoodle.filter(b => b.datesWon.length === maxWins);

        createLogs({
          log: `winners: ${winners.map(w => w.username).join(',')}`,
          type: 'BOTM',
        });

        // create a string to mention winners
        const winnerString = createWinnerString(winners);

        // get winner ids
        const winnerIds = winners.map(w => w.discordId);

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

          createLogs({
            log: `POSTING BOTM TO GUILD ${guild.name} IN CHANNELS ${generals
              .map(general => general.name)
              .join(',')}`,
            type: 'DISCORD',
          });

          // message channel with buster winners
          generals.map(general =>
            general.send(
              `Congratulations ${winnerString}on becoming Buster(s) of the Month ${getMonthName(
                monthIndex,
              )} ${year}`,
            ),
          );
        });

        // create role for current month
        const serverRoles = await guild.roles.fetch();

        const prevMonthRole = serverRoles.find(
          r =>
            r.name ===
            `BOTM ${getMonthName(getPrevMonthIndex(monthIndex))} ${year}`,
        );

        const position = prevMonthRole.position + 1;

        const newRole = {
          name: `BOTM ${getMonthName(monthIndex)} ${year}`,
          color: getColor(),
          mentionable: true,
          hoist: true,
          position,
        };
        guild.roles.create(newRole);

        createLogs({
          log: `CREATING NEW ROLE BOTM ${getMonthName(monthIndex)} ${year}`,
          type: 'DISCORD',
        });

        // get members from server that match winnerIds
        const members = await guild.members
          .fetch()
          .then(allGuildMembers =>
            allGuildMembers.toJSON().filter(m => winnerIds.includes(m.user.id)),
          )
          .catch(() => []);

        // get role we created earlier from the server
        const refetchRoles = await guild.roles.fetch();
        const botmRole = refetchRoles.find(
          r => r.name === `BOTM ${getMonthName(monthIndex)} ${year}`,
        );

        // add role to winners
        members.map(m => m.roles.add(botmRole));

        createLogs({
          log: `ADDING ROLE ${botmRole.name} TO MEMBERS ${members
            .map(m => m.user.username)
            .join(',')}`,
          type: 'DISCORD',
        });

        const newBusterOTM = new BusterOTM({
          year,
          month: getMonthName(monthIndex),
          busters: winners,
        });

        await newBusterOTM.save();
        createLogs({
          log: `CREATING BOTM RECORD for ${getMonthName(monthIndex)} ${year}`,
          type: 'DATABASE',
        });
      }

      return null;
    }),
  )
    .then(() => {
      createLogs({
        log: 'BOTM SUCESSFULLY EXECUTED',
        type: 'BOTM',
      });
    })
    .catch(err => {
      createLogs({
        log: 'BOTM ERROR',
        error: JSON.stringify(err),
        type: 'BOTM',
      });
    });

module.exports = busterOfTheMonth;
