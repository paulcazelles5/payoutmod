const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'embed',
  description: 'Envoyer un embed simple',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ Permission requise.');
    }
    const text = args.join(' ');
    if (!text) return message.reply('Usage : `*embed <texte>`');

    const embed = new EmbedBuilder().setColor(config.colors.info).setDescription(text);
    await message.delete().catch(() => {});
    await message.channel.send({ embeds: [embed] });
  },
};
