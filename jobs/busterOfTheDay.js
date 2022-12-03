/* eslint-disable no-console */
const Buster = require('../models/Buster');
const { createBuster, updateBuster, createLogs } = require('../db');
const {
  fetchQuote,
  getBotd,
  getBotdMessage,
  createHolidayRole,
} = require('../utils');

const busterOfTheDay = client =>
  Promise.all(
    client.guilds.cache.map(async guild => {
      const members = await guild.members
        .fetch()
        .then(allGuildMembers =>
          allGuildMembers.toJSON().filter(m => !m.user.bot),
        )
        .catch(() => []);

      const {
        randomMemberId,
        randomMemberAvatarURL,
        randomMemberUsername,
        dateWon,
        datesWon,
        mostWins,
      } = await getBotd(members);

      const quote = await fetchQuote();

      await guild.channels
        .fetch()
        .then(async channels => {
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

          // only collect logs for my server
          if (guild.name === 'Keylords') {
            createLogs({
              log: `POSTING TO GUILD ${guild.name} IN CHANNELS ${generals
                .map(general => general.name)
                .join(',')}`,
              type: 'DISCORD',
            });
          }

          await createHolidayRole(guild, randomMemberId, members);

          generals.map(general =>
            general.send(
              getBotdMessage({ quote, datesWon, randomMemberId, mostWins }),
            ),
          );
        })
        .catch(err => {
          // only collect logs for my server
          if (guild.name === 'Keylords') {
            createLogs({
              log: 'ERROR FINDING TEXT CHANNEL',
              error: JSON.stringify(err),
              type: 'DISCORD',
            });
          }
        });

      // only save buster data for my server
      if (guild.name === 'Keylords') {
        const existingBuster = await Buster.findOne({
          discordId: randomMemberId,
        });

        if (!existingBuster) {
          createBuster({
            discordId: randomMemberId,
            username: randomMemberUsername,
            avatarUrl: randomMemberAvatarURL,
            datesWon: [dateWon],
          });
        } else {
          const updatedBuster = {
            username: randomMemberUsername,
            avatarUrl: randomMemberAvatarURL,
            datesWon: [...existingBuster.datesWon, dateWon],
          };

          updateBuster({
            discordId: randomMemberId,
            updatedBuster,
          });
        }
      }
    }),
  )
    .then(() =>
      createLogs({
        log: 'BOTD SUCESSFULLY EXECUTED',
        type: 'BOTD',
      }),
    )
    .catch(err =>
      createLogs({
        log: 'BOTD ERROR',
        error: JSON.stringify(err),
        type: 'BOTD',
      }),
    );

module.exports = busterOfTheDay;
