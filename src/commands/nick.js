const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'nick',
  aliases: ['nickname', 'setnick'],
  description: 'Changer le pseudo d\'un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageNicknames)) {
      return message.reply('❌ Permission `Manage Nicknames` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*nick @user [nouveau_pseudo]` (vide = reset)');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    const newNick = args.slice(1).join(' ').replace(/<@!?\d+>/g, '').trim() || null;

    try {
      await target.setNickname(newNick, `Par ${message.author.tag}`);

      const embed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setDescription(
          newNick
            ? `✅ Pseudo de **${target.user.tag}** changé en **${newNick}**.`
            : `✅ Pseudo de **${target.user.tag}** réinitialisé.`
        );

      await message.reply({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ Erreur : ${err.message}`);
    }
  },
};
