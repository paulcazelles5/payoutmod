const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'poll',
  aliases: ['sondage'],
  description: 'Créer un sondage rapide',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageMessages) &&
        !hasPermission(message.member, PermissionFlagsBits.Administrator)) {
      return message.reply('❌ Permission requise.');
    }

    const text = args.join(' ');
    if (!text) return message.reply('Usage : `*poll <question>`');

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle('📊 Sondage')
      .setDescription(text)
      .setFooter({ text: `Par ${message.author.tag}` });

    const msg = await message.channel.send({ embeds: [embed] });
    await msg.react('👍');
    await msg.react('👎');
    await message.delete().catch(() => {});
  },
};
