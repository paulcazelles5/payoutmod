const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'vcmute',
  description: 'Mute vocal un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.MuteMembers)) {
      return message.reply('❌ Permission `Mute Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*vcmute @user`');
    if (!target.voice.channel) return message.reply('❌ Pas en vocal.');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    try {
      await target.voice.setMute(true, `Par ${message.author.tag}`);
      await message.reply({ embeds: [new EmbedBuilder().setColor(config.colors.warn).setDescription(`🔇 **${target.user.tag}** mute vocal.`)] });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
