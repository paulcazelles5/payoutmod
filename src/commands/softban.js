const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'softban',
  description: 'Ban + unban immédiat (supprime les messages)',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Permission `Ban Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*softban @user [raison]`');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    const reason = args.slice(1).join(' ').replace(/<@!?\d+>/g, '').trim() || 'Softban';

    try {
      await target.send(`Tu as été softban de **${message.guild.name}**.\n**Raison :** ${reason}`).catch(() => {});
      await message.guild.members.ban(target.id, {
        deleteMessageSeconds: 7 * 24 * 60 * 60,
        reason: `Softban par ${message.author.tag}: ${reason}`,
      });
      await message.guild.members.unban(target.id, 'Softban — unban automatique');

      const embed = new EmbedBuilder()
        .setColor(config.colors.soft)
        .setDescription(`💨 **${target.user.tag}** a été softban (messages des 7 derniers jours supprimés).\n**Raison :** ${reason}`);

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'SOFTBAN',
        moderator: message.author,
        target: target.user,
        reason,
        color: config.colors.soft,
      });
    } catch (err) {
      await message.reply(`❌ Erreur : ${err.message}`);
    }
  },
};
