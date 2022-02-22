const Buster = require('../models/Buster');
const BusterOTY = require('../models/BusterOTY');
const Logs = require('../models/Logs');
const getColor = require('../utils/getColor');

const busterOfTheYear = async client =>
  Promise.all(
    client.guilds.cache.map(async guild => {
      // we are only saving data for my server
      if (guild.name === 'Keylords') {
        const year = new Date().getFullYear().toString();
        const botyLog = new Logs({
          timestamp: new Date().toISOString(),
          log: `BOTY ${year} INITIATED`,
          type: 'BOTY',
        });
        await botyLog.save();

        const busters = await Buster.find({});

        const bustersWithWinsThisYear = busters.filter(b => {
          const { datesWon } = b;
          const dates = datesWon.filter(d => d.startsWith(year));
          return dates.length > 0;
        });

        // filters datesWons to only current year
        // as well as extra mongo db metadata
        const busterDoodle = bustersWithWinsThisYear.map(b => ({
          id: b.id,
          discordId: b.discordId,
          username: b.username,
          avatarUrl: b.avatarUrl,
          datesWon: b.datesWon.filter(d => d.startsWith(year)),
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
          type: 'BOTY',
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

        await guild.channels
          .fetch()
          .then(channels => {
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
              log: `POSTING BOTY TO GUILD ${guild.name} IN CHANNELS ${generals
                .map(general => general.name)
                .join(',')}`,
              type: 'DISCORD_CHANNEL',
            });

            channelLog.save();
            // message channel with buster winners
            generals.map(general =>
              general.send(
                `Congratulations to your Buster(s) of the Year for ${year} ${winnerString()}`,
              ),
            );
          })
          .catch(err => {
            const channelErrorLog = new Logs({
              timestamp: new Date().toISOString(),
              log: 'ERROR FINDING TEXT CHANNEL',
              error: JSON.stringify(err),
              type: 'DISCORD_CHANNEL',
            });

            channelErrorLog.save();
          });

        // create role for boty
        const { roles } = await guild;
        const serverRoles = await roles.fetch();
        const prevYearRole = serverRoles.find(r =>
          r.name.includes(`BOTY ${Number(year) - 1}`),
        );

        const position = prevYearRole.position + 1;

        const newRole = {
          name: `BOTY ${year}`,
          color: getColor(),
          mentionable: true,
          hoist: true,
          position,
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
        const refetchRoles = await roles.fetch();
        const botyRole = refetchRoles.find(r => r.name === `BOTY ${year}`);

        // add role to winners
        members.map(m => m.roles.add(botyRole));

        const newBusterOTY = new BusterOTY({
          year,
          busters: winners,
        });

        await newBusterOTY.save();

        const newBusterOTYLog = new Logs({
          timestamp: new Date().toISOString(),
          log: `CREATING BOTY RECORD ${year}`,
          type: 'BUSTER_DATABASE',
        });

        await newBusterOTYLog.save();
      }

      return null;
    }),
  )
    .then(() => {
      const mainLog = new Logs({
        timestamp: new Date().toISOString(),
        log: 'BOTY SUCESSFULLY EXECUTED',
        type: 'BOTY',
      });

      mainLog.save();
    })
    .catch(err => {
      const errLog = new Logs({
        timestamp: new Date().toISOString(),
        log: 'BOTY_ERROR',
        error: JSON.stringify(err),
        type: 'BOTY',
      });

      errLog.save();
    });

module.exports = busterOfTheYear;
