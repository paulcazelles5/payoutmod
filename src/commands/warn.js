const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const { addWarn, getWarns } = require('../utils/warns');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'warn',
  description: 'Avertir un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ Permission de modération requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*warn @user [raison]`');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    const reason = args.slice(1).join(' ').replace(/<@!?\d+>/g, '').trim() || 'Aucune raison fournie';

    const warn = addWarn(message.guild.id, target.id, message.author.id, reason);
    const total = getWarns(message.guild.id, target.id).length;

    const embed = new EmbedBuilder()
      .setColor(config.colors.warn)
      .setDescription(
        `⚠️ **${target.user.tag}** a reçu un avertissement.\n**Raison :** ${reason}\n**Total :** ${total} warn(s)`
      );

    await message.reply({ embeds: [embed] });

    try {
      await target.send(
        `Tu as reçu un avertissement sur **${message.guild.name}**.\n**Raison :** ${reason}\n**Total :** ${total}`
      ).catch(() => {});
    } catch {}

    await sendModLog(message.guild, {
      action: 'WARN',
      moderator: message.author,
      target: target.user,
      reason,
      extra: { 'Total warns': String(total), 'Warn ID': warn.id },
    });
  },
};
