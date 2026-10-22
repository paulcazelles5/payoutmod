const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'slowmode',
  aliases: ['slow'],
  description: 'Activer/désactiver le slowmode',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ Permission `Manage Channels` requise.');
    }

    const seconds = parseInt(args[0], 10);
    if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
      return message.reply('Usage : `*slowmode <secondes>` (0 à 21600, 0 = désactiver)');
    }

    try {
      await message.channel.setRateLimitPerUser(seconds, `Par ${message.author.tag}`);

      const embed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setDescription(
          seconds === 0
            ? '✅ Slowmode désactivé.'
            : `🐢 Slowmode activé : **${seconds}s** entre chaque message.`
        );

      await message.reply({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ Erreur : ${err.message}`);
    }
  },
};
