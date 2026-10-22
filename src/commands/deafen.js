const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'deafen',
  aliases: ['vcdeafen'],
  description: 'Assourdir un membre en vocal',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.DeafenMembers)) {
      return message.reply('❌ Permission `Deafen Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target?.voice.channel) return message.reply('Usage : `*deafen @user` (doit être en vocal)');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    try {
      await target.voice.setDeaf(true, `Par ${message.author.tag}`);
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.warn)
            .setDescription(`🔇 **${target.user.tag}** a été assourdi.`),
        ],
      });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
