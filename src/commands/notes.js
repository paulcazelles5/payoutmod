const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const { getNotes } = require('../utils/notes');
const config = require('../config');

module.exports = {
  name: 'notes',
  description: 'Voir les notes staff d\'un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.KickMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ Permission staff requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*notes @user`');

    const notes = getNotes(message.guild.id, target.id);
    if (!notes.length) return message.reply(`Aucune note pour **${target.user.tag}**.`);

    const list = notes
      .slice(-15)
      .map(
        (n) =>
          `**\`${n.id}\`** <t:${Math.floor(n.timestamp / 1000)}:R> — <@${n.moderatorId}>\n> ${n.content}`
      )
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle(`Notes — ${target.user.tag}`)
      .setDescription(list)
      .setFooter({ text: `${notes.length} note(s)` });

    await message.reply({ embeds: [embed] });
  },
};
