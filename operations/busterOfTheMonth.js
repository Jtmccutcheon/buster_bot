const Buster = require('../models/Buster');
const BusterOTM = require('../models/BusterOTM');
const Logs = require('../models/Logs');
const getMonthString = require('../utils/getMonthString');
const getMonthName = require('../utils/getMonthName');
const getPrevMonthIndex = require('../utils/getPrevMonthIndex');
const getColor = require('../utils/getColor');

const busterOfTheMonth = async client =>
  Promise.all(
    client.guilds.cache.map(async guild => {
      // we are only saving data for my server
      if (guild.name === 'Keylords') {
        const date = new Date();
        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        const searchString = `${year}-${getMonthString(monthIndex)}`;

        const botmLog = new Logs({
          timestamp: new Date().toISOString(),
          log: `BOTM ${getMonthName(monthIndex)} ${year} INITIATED`,
          type: 'BOTM',
        });
        await botmLog.save();

        const busters = await Buster.find({});

        const bustersWithWinsThisMonth = busters.filter(b => {
          const { datesWon } = b;
          const dates = datesWon.filter(d => d.startsWith(searchString));
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
        const winners = busterDoodle.filter(
          b => b.datesWon.length === getMostWins(),
        );

        const winnerLog = new Logs({
          timestamp: new Date().toISOString(),
          log: `winners: ${winners.map(w => w.username).join(',')}`,
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
            timestamp: new Date().toISOString(),
            log: `POSTING BOTM TO GUILD ${guild.name} IN CHANNELS ${generals
              .map(general => general.name)
              .join(',')}`,
            type: 'DISCORD_CHANNEL',
          });
          channelLog.save();

          // message channel with buster winners
          generals.map(general =>
            general.send(
              `Congratulations ${winnerString()}on becoming Buster(s) of the Month ${getMonthName(
                monthIndex,
              )} ${year}`,
            ),
          );
        });

        // create role for current month
        const { roles } = await guild;
        const serverRoles = await roles.fetch();

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
        roles.create(newRole);
        const createRoleLog = new Logs({
          timestamp: new Date().toISOString(),
          log: `CREATING NEW ROLE BOTM ${getMonthName(monthIndex)} ${year}`,
          type: 'DISCORD_CHANNEL',
        });
        await createRoleLog.save();

        // get members from server that match winnerIds
        const members = await guild.members
          .fetch()
          .then(allGuildMembers =>
            allGuildMembers.toJSON().filter(m => winnerIds.includes(m.user.id)),
          )
          .catch(() => []);

        // get role we created earlier from the server
        const refetchRoles = await roles.fetch();
        const botmRole = refetchRoles.find(
          r => r.name === `BOTM ${getMonthName(monthIndex)} ${year}`,
        );

        // add role to winners
        members.map(m => m.roles.add(botmRole));

        const addedRoleLog = new Logs({
          timestamp: new Date().toISOString(),
          log: `ADDING ROLE ${botmRole.name} TO MEMBERS ${members
            .map(m => m.user.username)
            .join(',')}`,
          type: 'DISCORD_CHANNEL',
        });

        await addedRoleLog.save();

        const newBusterOTM = new BusterOTM({
          year,
          month: getMonthName(monthIndex),
          busters: winners,
        });

        await newBusterOTM.save();
      }

      return null;
    }),
  )
    .then(() => {
      const mainLog = new Logs({
        timestamp: new Date().toISOString(),
        log: 'BOTM SUCESSFULLY EXECUTED',
        type: 'BOTM',
      });

      mainLog.save();
    })
    .catch(err => {
      const errLog = new Logs({
        timestamp: new Date().toISOString(),
        log: 'BOTM_ERROR',
        error: JSON.stringify(err),
        type: 'BOTM',
      });

      errLog.save();
    });

module.exports = busterOfTheMonth;
