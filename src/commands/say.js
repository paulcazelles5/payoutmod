const { PermissionFlagsBits } = require('discord.js');
const { hasPermission } = require('../utils/permissions');

module.exports = {
  name: 'say',
  aliases: ['echo'],
  description: 'Faire parler le bot',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ Permission requise.');
    }
    const text = args.join(' ');
    if (!text) return message.reply('Usage : `*say <message>`');
    await message.delete().catch(() => {});
    await message.channel.send({ content: text, allowedMentions: { parse: [] } });
  },
};
