const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const { unjailMember } = require('../utils/jail');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'unjail',
  aliases: ['unprison', 'free'],
  description: 'Sortir un membre de jail',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ Permission de modération requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*unjail @user [raison]`');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    const reason = args.slice(1).join(' ').replace(/<@!?\d+>/g, '').trim() || 'Aucune raison fournie';

    try {
      const result = await unjailMember(target, message.author, reason);
      if (!result.ok) return message.reply(`❌ ${result.error}`);

      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setDescription(
          `🔓 **${target.user.tag}** est sorti de jail.\n**Rôles restaurés :** ${result.restored}\n**Raison :** ${reason}`
        );

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'UNJAIL',
        moderator: message.author,
        target: target.user,
        reason,
        color: config.colors.success,
      });

      await target.send(`Tu as été libéré de jail sur **${message.guild.name}**.\n**Raison :** ${reason}`).catch(() => {});
    } catch (err) {
      await message.reply(`❌ Erreur unjail : ${err.message}`);
    }
  },
};
