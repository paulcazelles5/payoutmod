const { PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'nuke',
  aliases: ['clonechannel'],
  description: 'Recréer le salon (supprime tous les messages)',
  async execute(message) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ Permission `Manage Channels` requise.');
    }

    const channel = message.channel;
    if (channel.type !== ChannelType.GuildText) {
      return message.reply('❌ Uniquement sur un salon textuel.');
    }

    try {
      const position = channel.position;
      const newChannel = await channel.clone({
        reason: `Nuke par ${message.author.tag}`,
      });
      await channel.delete(`Nuke par ${message.author.tag}`);
      await newChannel.setPosition(position);

      const embed = new EmbedBuilder()
        .setColor(config.colors.mod)
        .setDescription(`💥 Salon recréé par ${message.author}.`)
        .setTimestamp();

      await newChannel.send({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ Erreur : ${err.message}`);
    }
  },
};
