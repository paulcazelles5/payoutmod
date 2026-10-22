const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'hackban',
  aliases: ['forceban'],
  description: 'Bannir un utilisateur par ID (même hors serveur)',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Permission `Ban Members` requise.');
    }

    const userId = args[0];
    if (!userId || !/^\d{17,20}$/.test(userId)) {
      return message.reply('Usage : `*hackban <id_utilisateur> [raison]`');
    }

    const reason = args.slice(1).join(' ') || 'Hackban';

    try {
      const user = await message.client.users.fetch(userId).catch(() => null);
      await message.guild.members.ban(userId, {
        reason: `${message.author.tag}: ${reason}`,
      });

      const embed = new EmbedBuilder()
        .setColor(config.colors.mod)
        .setDescription(
          `🔨 **${user?.tag || userId}** a été hackban.\n**Raison :** ${reason}`
        );

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'HACKBAN',
        moderator: message.author,
        target: user || { id: userId },
        reason,
      });
    } catch (err) {
      await message.reply(`❌ Erreur : ${err.message}`);
    }
  },
};
