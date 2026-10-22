const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'announce',
  aliases: ['announcement'],
  description: 'Annonce en embed',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageGuild) &&
        !hasPermission(message.member, PermissionFlagsBits.Administrator)) {
      return message.reply('❌ Permission requise.');
    }

    const text = args.join(' ');
    if (!text) return message.reply('Usage : `*announce <message>`');

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle('📢 Annonce')
      .setDescription(text)
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
      .setTimestamp();

    await message.delete().catch(() => {});
    await message.channel.send({ embeds: [embed] });
  },
};
