const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const { removeWarn, getWarns } = require('../utils/warns');
const config = require('../config');

module.exports = {
  name: 'delwarn',
  aliases: ['rmwarn', 'removewarn'],
  description: 'Supprimer un warn par ID',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ Permission de modération requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    const warnId = args.find((a) => !a.startsWith('<@') && a !== target?.id);

    if (!target || !warnId) {
      return message.reply('Usage : `*delwarn @user <warn_id>`\n(vois les IDs avec `*warnings @user`)');
    }

    const ok = removeWarn(message.guild.id, target.id, warnId);
    if (!ok) return message.reply('❌ Warn introuvable.');

    const remaining = getWarns(message.guild.id, target.id).length;

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setDescription(`✅ Warn \`${warnId}\` supprimé pour **${target.user.tag}**.\nRestants : ${remaining}`);

    await message.reply({ embeds: [embed] });
  },
};
