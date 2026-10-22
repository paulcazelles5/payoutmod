const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const { clearNotes, getNotes } = require('../utils/notes');
const config = require('../config');

module.exports = {
  name: 'clearnotes',
  description: 'Effacer toutes les notes d\'un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.Administrator)) {
      return message.reply('❌ Permission requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*clearnotes @user`');

    const count = getNotes(message.guild.id, target.id).length;
    clearNotes(message.guild.id, target.id);

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setDescription(`✅ ${count} note(s) effacée(s) pour **${target.user.tag}**.`);

    await message.reply({ embeds: [embed] });
  },
};
