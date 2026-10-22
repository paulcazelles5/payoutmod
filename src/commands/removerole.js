const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'removerole',
  aliases: ['rr'],
  description: 'Retirer un rôle d\'un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageRoles)) {
      return message.reply('❌ Permission requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[1]) ||
      message.guild.roles.cache.find((r) => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

    if (!target || !role) return message.reply('Usage : `*removerole @user @role`');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    try {
      await target.roles.remove(role, `Par ${message.author.tag}`);
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(`✅ ${role} retiré de **${target.user.tag}**.`),
        ],
      });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
