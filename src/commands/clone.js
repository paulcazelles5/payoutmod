const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'clone',
  description: 'Cloner le salon actuel',
  async execute(message) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ Permission requise.');
    }

    try {
      const cloned = await message.channel.clone({ reason: `Par ${message.author.tag}` });
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(`✅ Salon cloné : ${cloned}`),
        ],
      });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
