const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'vcunmute',
  description: 'Unmute vocal un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.MuteMembers)) {
      return message.reply('❌ Permission `Mute Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*vcunmute @user`');
    if (!target.voice.channel) return message.reply('❌ Pas en vocal.');

    try {
      await target.voice.setMute(false, `Par ${message.author.tag}`);
      await message.reply({ embeds: [new EmbedBuilder().setColor(config.colors.success).setDescription(`🔊 **${target.user.tag}** unmute vocal.`)] });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
