const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'vckick',
  aliases: ['voicekick', 'disconnect'],
  description: 'Déconnecter un membre du vocal',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.MoveMembers)) {
      return message.reply('❌ Permission `Move Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*vckick @user`');
    if (!target.voice.channel) return message.reply('❌ Ce membre n\'est pas en vocal.');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    try {
      await target.voice.disconnect(`Par ${message.author.tag}`);
      const embed = new EmbedBuilder()
        .setColor(config.colors.mod)
        .setDescription(`🔇 **${target.user.tag}** a été déconnecté du vocal.`);
      await message.reply({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
