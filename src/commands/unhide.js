const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'unhide',
  description: 'Rendre le salon visible pour @everyone',
  async execute(message) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ Permission requise.');
    }

    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        ViewChannel: null,
      });
      await message.reply({
        embeds: [new EmbedBuilder().setColor(config.colors.success).setDescription('👁️ Salon visible pour @everyone.')],
      });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
