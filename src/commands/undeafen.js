const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'undeafen',
  description: 'Retirer l\'assourdissement vocal',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.DeafenMembers)) {
      return message.reply('❌ Permission requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target?.voice.channel) return message.reply('Usage : `*undeafen @user`');

    try {
      await target.voice.setDeaf(false, `Par ${message.author.tag}`);
      await message.reply({ embeds: [new EmbedBuilder().setColor(config.colors.success).setDescription(`✅ **${target.user.tag}** n\'est plus assourdi.`)] });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
