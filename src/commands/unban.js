const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'unban',
  description: 'Débannir un utilisateur',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Permission `Ban Members` requise.');
    }

    const userId = args[0];
    if (!userId || !/^\d{17,20}$/.test(userId)) {
      return message.reply('Usage : `*unban <id_utilisateur> [raison]`');
    }

    const reason = args.slice(1).join(' ') || 'Aucune raison fournie';

    try {
      await message.guild.members.unban(userId, `${message.author.tag}: ${reason}`);

      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setDescription(`✅ Utilisateur \`${userId}\` a été débanni.\n**Raison :** ${reason}`);

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'UNBAN',
        moderator: message.author,
        target: { id: userId },
        reason,
      });
    } catch (err) {
      await message.reply(`❌ Impossible de débannir : ${err.message}`);
    }
  },
};
