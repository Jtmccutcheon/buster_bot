/* eslint-disable no-console */
const { get, sample } = require('lodash');
const Buster = require('../models/Buster');
const Logs = require('../models/Logs');
const fetchQuote = require('../utils/fetchQuote');
const createLogs = require('../utils/createLogs');

const busterOfTheDay = client =>
  Promise.all(
    client.guilds.cache.map(async guild => {
      const members = await guild.members
        .fetch()
        .then(allGuildMembers =>
          allGuildMembers.toJSON().filter(m => !m.user.bot),
        )
        .catch(() => []);

      const randomMember = sample(members);

      const randomMemberId = get(
        randomMember,
        'user.id',
        '404 Buster not found',
      );
      const randomMemberAvatarURL = randomMember.displayAvatarURL();
      const randomMemberUsername = get(
        randomMember,
        'user.username',
        '404 buster not found',
      );
      const dateWon = new Date().toISOString();

      const quote = await fetchQuote();

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

          // only collect logs for my server
          if (guild.name === 'Keylords') {
            createLogs({
              log: `POSTING TO GUILD ${guild.name} IN CHANNELS ${generals
                .map(general => general.name)
                .join(',')}`,
              type: 'DISCORD',
            });
          }

          generals.map(general =>
            general.send(
              `Its 6:09 again which means its time to announce Buster of the Day! Congratulations <@${randomMemberId}>!!! You did it!! \nAnd remember, "${quote.q}" - ${quote.a}\nFor advanced buster analytics please visit https://busteranalytics-beta.netlify.app/`,
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

      // only save buster data for my server
      if (guild.name === 'Keylords') {
        const existingBuster = await Buster.findOne({
          discordId: randomMemberId,
        });

        if (!existingBuster) {
          createLogs({
            log: `BUSTER RECORD DOES NOT EXIST ...CREATING NEW BUSTER RECORD FOR ${randomMemberId}`,
            type: 'DATABASE',
          });

          const newBuster = new Buster({
            discordId: randomMemberId,
            username: randomMemberUsername,
            avatarUrl: randomMemberAvatarURL,
            datesWon: [dateWon],
          });

          await newBuster.save();
        } else {
          createLogs({
            log: `BUSTER RECORD ${existingBuster.username} FOUND ...UPDATING BUSTER`,
            type: 'DATABASE',
          });

          const { datesWon } = existingBuster;

          const updatedBuster = {
            username: randomMemberUsername,
            avatarUrl: randomMemberAvatarURL,
            datesWon: [...datesWon, dateWon],
          };

          Buster.updateOne(
            { discordId: randomMemberId },
            updatedBuster,
            { new: true },
            async (err, busterAfterUpdate) => {
              if (err) {
                createLogs({
                  log: `ERROR UPDATING BUSTER RECORD ${existingBuster.username}`,
                  type: 'DATABASE',
                  error: JSON.stringify(err),
                });
              }
              if (busterAfterUpdate)
                createLogs({
                  log: `BUSTER RECORD ${existingBuster.username} SUCESSFULLY UPDATED`,
                  type: 'DATABASE',
                });
            },
          );
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
        log: 'BOTD_ERROR',
        error: JSON.stringify(err),
        type: 'BOTD',
      }),
    );

module.exports = busterOfTheDay;
