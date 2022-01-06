/* eslint-disable no-console */
const { get, sample } = require('lodash');
const Buster = require('./models/Buster');
const Logs = require('./models/Logs');
const fetchQuote = require('./utils/fetchQuote');

const main = client =>
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

      const qoute = await fetchQuote();

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
            timestamp: dateWon,
            log: `POSTING TO GUILD ${guild.name} IN CHANNELS ${generals
              .map(general => general.name)
              .join(',')}`,
            type: 'DISCORD_CHANNEL',
          });

          channelLog.save();
          generals.map(general =>
            general.send(
              `Its 6:09 again which means its time to announce Buster of the Day! Congratulations <@${randomMemberUsername}>!!! You did it!! \nAnd remember, "${qoute.q}" - ${qoute.a}\nFor advanced buster analytics please visit https://busteranalytics-beta.netlify.app/`,
            ),
          );
        })
        .catch(err => {
          const channelErrorLog = new Logs({
            timestamp: dateWon,
            log: 'ERROR FINDING TEXT CHANNEL',
            error: JSON.stringify(err),
            type: 'DISCORD_CHANNEL',
          });

          channelErrorLog.save();
        });

      if (guild.name === 'Keylords') {
        const existingBuster = await Buster.findOne({
          discordId: randomMemberId,
        });

        if (!existingBuster) {
          const createBusterLog = new Logs({
            timestamp: dateWon,
            log: `BUSTER RECORD DOES NOT EXIST ...CREATING NEW BUSTER RECORD FOR ${randomMemberUsername}`,
            type: 'BUSTER_DATABASE',
          });

          await createBusterLog.save();

          const newBuster = new Buster({
            discordId: randomMemberId,
            username: randomMemberUsername,
            avatarUrl: randomMemberAvatarURL,
            datesWon: [dateWon],
          });

          await newBuster.save();
          console.log('new buster record sucessfully created');
        } else {
          const busterFoundLog = new Logs({
            timestamp: dateWon,
            log: `BUSTER RECORD ${existingBuster.id} FOUND ...UPDATING BUSTER`,
            type: 'BUSTER_DATABASE',
          });

          await busterFoundLog.save();

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
                console.log('error updating buster record \n', err);
                const updateBusterErrorLog = new Logs({
                  error: JSON.stringify(err),
                  timestamp: dateWon,
                  log: `ERROR UPDATING BUSTER RECORD ${existingBuster.id}`,
                  type: 'BUSTER_DATABASE',
                });

                await updateBusterErrorLog.save();
              }
              if (busterAfterUpdate) {
                console.log('buster record sucessfully updated');
                const busterUpdatedLog = new Logs({
                  timestamp: dateWon,
                  log: `BUSTER RECORD ${existingBuster.id} SUCESSFULLY UPDATED`,
                  type: 'BUSTER_DATABASE',
                });

                await busterUpdatedLog.save();
              }
            },
          );
        }
      }
    }),
  )
    .then(() => {
      const timestamp = new Date().toISOString();
      const mainLog = new Logs({
        timestamp,
        log: 'MAIN SUCESSFULLY EXECUTED',
        type: 'MAIN',
      });

      mainLog.save();
    })
    .catch(err => {
      const timestamp = new Date().toISOString();
      const errLog = new Logs({
        timestamp,
        log: 'MAIN_ERROR',
        error: JSON.stringify(err),
        type: 'MAIN',
      });

      errLog.save();
    });

module.exports = main;
