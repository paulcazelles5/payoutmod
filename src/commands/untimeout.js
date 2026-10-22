const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'untimeout',
  aliases: ['unmute'],
  description: 'Retirer le timeout',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ Permission `Moderate Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*untimeout @user [raison]`');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    const reason = args.slice(1).join(' ').replace(/<@!?\d+>/g, '').trim() || 'Aucune raison fournie';

    try {
      await target.timeout(null, `${message.author.tag}: ${reason}`);

      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setDescription(`✅ Timeout retiré pour **${target.user.tag}**.\n**Raison :** ${reason}`);

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'UNTIMEOUT',
        moderator: message.author,
        target: target.user,
        reason,
      });
    } catch (err) {
      await message.reply(`❌ Impossible de retirer le timeout : ${err.message}`);
    }
  },
};
