const Buster = require('../models/Buster');
const BusterOTY = require('../models/BusterOTY');
const createLogs = require('../db/createLogs');
const { getColor, getMostWins, createWinnerString } = require('../utils');

const busterOfTheYear = client =>
  Promise.all(
    client.guilds.cache.map(async guild => {
      // we are only saving data for my server
      if (guild.name === 'Keylords') {
        const year = new Date().getFullYear().toString();

        createLogs({
          log: `BOTY ${year} INITIATED`,
          type: 'BOTY',
        });

        const busters = await Buster.find({});

        const bustersWithWinsThisYear = busters.filter(b => {
          const { datesWon } = b;
          const dates = datesWon.filter(d => d.startsWith(year));
          return dates.length > 0;
        });

        // filters datesWons to only current year
        // as well as extra mongo db metadata
        const busterDoodle = bustersWithWinsThisYear.map(b => ({
          discordId: b.discordId,
          username: b.username,
          avatarUrl: b.avatarUrl,
          datesWon: b.datesWon.filter(d => d.startsWith(year)),
        }));

        // get most wins for this current month
        const maxWins = getMostWins(busterDoodle);

        // filter busters with most wins
        const winners = busterDoodle.filter(b => b.datesWon.length === maxWins);

        createLogs({
          log: `winners: ${winners.map(w => w.username).join(',')}`,
          type: 'BOTY',
        });

        // create a string to mention winners
        const winnerString = createWinnerString(winners);

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
              ['text-lords'].includes(textChannel.name),
            );

            createLogs({
              log: `POSTING BOTY TO GUILD ${guild.name} IN CHANNELS ${generals
                .map(general => general.name)
                .join(',')}`,
              type: 'DISCORD',
            });

            // message channel with buster winners
            generals.map(general =>
              general.send(
                `Congratulations to your Buster(s) of the Year for ${year} ${winnerString}`,
              ),
            );
          })
          .catch(err => {
            createLogs({
              log: 'ERROR FINDING TEXT CHANNEL',
              error: JSON.stringify(err),
              type: 'DISCORD',
            });
          });

        // create role for boty
        const { roles } = await guild;
        const serverRoles = await roles.fetch();
        const prevYearRole = serverRoles.find(r =>
          // have to use includes for now instead of === because
          // 2021 has an * can updat next year
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

        createLogs({
          log: `CREATING BOTY RECORD ${year}`,
          type: 'DATABASE',
        });
      }

      return null;
    }),
  )
    .then(() => {
      createLogs({
        log: 'BOTY SUCESSFULLY EXECUTED',
        type: 'BOTY',
      });
    })
    .catch(err => {
      createLogs({
        log: 'BOTY ERROR',
        error: JSON.stringify(err),
        type: 'BOTY',
      });
    });

module.exports = busterOfTheYear;
