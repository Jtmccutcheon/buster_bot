const moment = require('moment');
const createLogs = require('../db/createLogs');
const { getHolidayMessage } = require('./getHolidayMessage');
const getColor = require('./getColor');

const createHolidayRole = async (guild, randomMemberId, members) => {
  if (guild.name === 'Keylords') {
    const roleText = getHolidayMessage();
    const year = moment().format('YYYY');
    if (!roleText) {
      // eslint-disable-next-line no-console
      console.log('Not a holiday');
    } else {
      createLogs({
        log: `CREATING NEW ROLE ${roleText} ${year}`,
        type: 'DISCORD',
      });
      const newRole = {
        name: `${roleText} ${year}`,
        color: getColor(),
        mentionable: true,
      };

      guild.roles.create(newRole);

      const roles = await guild.roles.fetch();
      const role = roles.find(r => r.name === `${roleText.slice(1)} ${year}`);

      const user = members.find(m => m.user.id === randomMemberId);

      user.roles.add(role);
      createLogs({
        log: `CREATING NEW ROLE ${roleText} ${year}`,
        type: 'DISCORD',
      });
    }
  }
};

module.exports = createHolidayRole;
