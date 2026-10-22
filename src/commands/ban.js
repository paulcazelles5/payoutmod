const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'ban',
  description: 'Bannir un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Permission `Ban Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    // Si pas de membre (déjà parti), on peut bannir par ID
    let userId = target?.id || args[0];
    if (!userId || !/^\d{17,20}$/.test(userId)) {
      return message.reply('Usage : `*ban @user [raison] [jours_messages]`');
    }

    if (target) {
      const check = canModerate(message.member, target);
      if (!check.ok) return message.reply(`❌ ${check.reason}`);
    }

    // Dernier arg numérique = deleteMessageDays (0-7)
    let deleteDays = 0;
    let reasonParts = args.slice(target ? 1 : 1);
    if (reasonParts.length && /^\d+$/.test(reasonParts[reasonParts.length - 1])) {
      deleteDays = Math.min(7, Math.max(0, parseInt(reasonParts.pop(), 10)));
    }
    const reason = reasonParts.join(' ') || 'Aucune raison fournie';

    try {
      await message.guild.members.ban(userId, {
        deleteMessageSeconds: deleteDays * 24 * 60 * 60,
        reason: `${message.author.tag}: ${reason}`,
      });

      const embed = new EmbedBuilder()
        .setColor(config.colors.mod)
        .setDescription(`🔨 **${target?.user?.tag || userId}** a été banni.\n**Raison :** ${reason}`)
        .setFooter({ text: `Par ${message.author.tag}` });

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'BAN',
        moderator: message.author,
        target: target?.user || { id: userId },
        reason,
        extra: { 'Messages supprimés': `${deleteDays} jour(s)` },
      });
    } catch (err) {
      await message.reply(`❌ Impossible de bannir : ${err.message}`);
    }
  },
};
