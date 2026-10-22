const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const { clearWarns, getWarns } = require('../utils/warns');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'clearwarns',
  aliases: ['clearwarnings', 'delwarns'],
  description: 'Supprimer tous les warns d\'un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ Permission de modération requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*clearwarns @user`');

    const before = getWarns(message.guild.id, target.id).length;
    clearWarns(message.guild.id, target.id);

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setDescription(`✅ ${before} avertissement(s) supprimé(s) pour **${target.user.tag}**.`);

    await message.reply({ embeds: [embed] });
    await sendModLog(message.guild, {
      action: 'CLEAR_WARNS',
      moderator: message.author,
      target: target.user,
      reason: `${before} warn(s) effacés`,
    });
  },
};
