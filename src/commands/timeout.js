const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const { sendModLog } = require('../utils/modlog');
const { parseDuration, formatDuration } = require('../utils/parseDuration');
const config = require('../config');

module.exports = {
  name: 'timeout',
  aliases: ['mute', 'to'],
  description: 'Mettre en timeout un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ Permission `Moderate Members` (Timeout) requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*timeout @user <durée> [raison]` (ex: 10m, 1h, 1d)');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    // Trouver la durée dans les args
    const durationArg = args.find((a) => parseDuration(a));
    if (!durationArg) {
      return message.reply('Durée invalide. Exemples : `10m`, `1h`, `2d` (max 28 jours).');
    }

    const durationMs = parseDuration(durationArg);
    const reason =
      args
        .filter((a) => a !== durationArg && !a.startsWith('<@'))
        .join(' ')
        .trim() || 'Aucune raison fournie';

    try {
      await target.timeout(durationMs, `${message.author.tag}: ${reason}`);

      const embed = new EmbedBuilder()
        .setColor(config.colors.warn)
        .setDescription(
          `⏱️ **${target.user.tag}** est en timeout pour **${formatDuration(durationMs)}**.\n**Raison :** ${reason}`
        );

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'TIMEOUT',
        moderator: message.author,
        target: target.user,
        reason,
        extra: { Durée: formatDuration(durationMs) },
      });
    } catch (err) {
      await message.reply(`❌ Impossible de timeout : ${err.message}`);
    }
  },
};
