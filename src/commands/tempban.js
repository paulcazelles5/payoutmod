const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const { parseDuration, formatDuration } = require('../utils/parseDuration');
const { sendModLog } = require('../utils/modlog');
const { readJSON, writeJSON } = require('../utils/storage');
const config = require('../config');

module.exports = {
  name: 'tempban',
  aliases: ['tban'],
  description: 'Bannissement temporaire',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Permission `Ban Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*tempban @user <durée> [raison]` (ex: 1d, 7d)');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    const durArg = args.find((a) => parseDuration(a));
    if (!durArg) return message.reply('Durée invalide. Ex : `1h`, `1d`, `7d`.');

    const durationMs = parseDuration(durArg);
    // tempban peut dépasser 28j (contrairement au timeout)
    const msLib = require('ms');
    const rawMs = msLib(durArg);
    if (!rawMs || rawMs < 60_000) return message.reply('Durée minimum : 1 minute.');

    const reason =
      args.filter((a) => a !== durArg && !a.startsWith('<@')).join(' ').trim() || 'Tempban';

    try {
      await target.send(
        `Tu as été temporairement banni de **${message.guild.name}** pour **${formatDuration(rawMs)}**.\n**Raison :** ${reason}`
      ).catch(() => {});

      await message.guild.members.ban(target.id, {
        reason: `Tempban ${formatDuration(rawMs)} par ${message.author.tag}: ${reason}`,
      });

      const tempbans = readJSON('tempbans.json', {});
      if (!tempbans[message.guild.id]) tempbans[message.guild.id] = {};
      tempbans[message.guild.id][target.id] = {
        expiresAt: Date.now() + rawMs,
        moderatorId: message.author.id,
        reason,
      };
      writeJSON('tempbans.json', tempbans);

      setTimeout(async () => {
        try {
          await message.guild.members.unban(target.id, 'Tempban expiré');
          const tb = readJSON('tempbans.json', {});
          if (tb[message.guild.id]) {
            delete tb[message.guild.id][target.id];
            writeJSON('tempbans.json', tb);
          }
        } catch {}
      }, rawMs);

      const embed = new EmbedBuilder()
        .setColor(config.colors.mod)
        .setDescription(
          `⏳ **${target.user.tag}** banni pour **${formatDuration(rawMs)}**.\n**Raison :** ${reason}`
        );

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'TEMPBAN',
        moderator: message.author,
        target: target.user,
        reason,
        extra: { Durée: formatDuration(rawMs) },
      });
    } catch (err) {
      await message.reply(`❌ Erreur : ${err.message}`);
    }
  },
};
