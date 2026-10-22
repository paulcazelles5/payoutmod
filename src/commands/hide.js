const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'hide',
  description: 'Cacher le salon pour @everyone',
  async execute(message) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ Permission requise.');
    }

    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        ViewChannel: false,
      });
      await message.reply({
        embeds: [new EmbedBuilder().setColor(config.colors.mod).setDescription('👁️ Salon caché pour @everyone.')],
      });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
