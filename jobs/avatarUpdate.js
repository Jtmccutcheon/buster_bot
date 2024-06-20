/* eslint-disable no-underscore-dangle */
const { createLogs, updateBuster } = require('../db');
const Buster = require('../models/Buster');

const avatarUpdate = client =>
  Promise.all(
    client.guilds.cache.map(async guild => {
      const members = await guild.members
        .fetch()
        .then(allGuildMembers =>
          allGuildMembers.toJSON().filter(m => !m.user.bot),
        )
        .catch(() => []);

      const memberIdsWithAvatarUrl = members.map(m => ({
        discordId: m.user.id,
        avatarUrl: m.displayAvatarURL(),
      }));

      Promise.allSettled(
        memberIdsWithAvatarUrl.map(async m => {
          const buster = await Buster.findOne({
            discordId: m.discordId,
          });

          if (buster && buster._doc.avatarUrl !== m.avatarUrl) {
            const updatedBuster = {
              ...buster._doc,
              avatarUrl: m.avatarUrl,
            };

            updateBuster({
              discordId: m.discordId,
              updatedBuster,
            });
          }
        }),
      );
    }),
  )
    .then(() =>
      createLogs({
        log: 'AVATAR JOB SUCESSFULLY EXECUTED',
        type: 'AVATAR',
      }),
    )
    .catch(err =>
      createLogs({
        log: 'AVATAR JOB ERROR',
        error: JSON.stringify(err),
        type: 'AVATAR',
      }),
    );

module.exports = avatarUpdate;
