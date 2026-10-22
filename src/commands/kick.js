const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'kick',
  description: 'Expulser un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ Permission `Kick Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*kick @user [raison]`');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    const reason = args.slice(1).join(' ').replace(/<@!?\d+>/g, '').trim() || 'Aucune raison fournie';

    try {
      await target.kick(`${message.author.tag}: ${reason}`);

      const embed = new EmbedBuilder()
        .setColor(config.colors.mod)
        .setDescription(`👢 **${target.user.tag}** a été expulsé.\n**Raison :** ${reason}`);

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'KICK',
        moderator: message.author,
        target: target.user,
        reason,
      });
    } catch (err) {
      await message.reply(`❌ Impossible d'expulser : ${err.message}`);
    }
  },
};
