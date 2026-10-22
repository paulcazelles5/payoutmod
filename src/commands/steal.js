const { PermissionFlagsBits, EmbedBuilder, parseEmoji } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'steal',
  aliases: ['addemoji', 'stealemoji'],
  description: 'Voler un emoji et l\'ajouter au serveur',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageGuildExpressions) &&
        !hasPermission(message.member, PermissionFlagsBits.ManageEmojisAndStickers) &&
        !hasPermission(message.member, PermissionFlagsBits.Administrator)) {
      return message.reply('❌ Permission Manage Emojis requise.');
    }

    const emojiInput = args[0];
    if (!emojiInput) return message.reply('Usage : `*steal <emoji> [nom]`');

    const parsed = parseEmoji(emojiInput);
    if (!parsed?.id) return message.reply('Emoji personnalisé invalide (pas un emoji Discord standard).');

    const ext = parsed.animated ? 'gif' : 'png';
    const url = `https://cdn.discordapp.com/emojis/${parsed.id}.${ext}`;
    const name = args[1] || parsed.name;

    try {
      const emoji = await message.guild.emojis.create({ attachment: url, name });
      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setDescription(`✅ Emoji ${emoji} ajouté sous le nom \`${name}\`.`);
      await message.reply({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
