const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const { addNote } = require('../utils/notes');
const config = require('../config');

module.exports = {
  name: 'note',
  aliases: ['addnote'],
  description: 'Ajouter une note staff sur un membre',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.KickMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ Permission staff requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*note @user <texte>`');

    const content = args.slice(1).join(' ').replace(/<@!?\d+>/g, '').trim();
    if (!content) return message.reply('Écris le contenu de la note.');

    const note = addNote(message.guild.id, target.id, message.author.id, content);

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setDescription(`📝 Note ajoutée sur **${target.user.tag}** (\`${note.id}\`)\n> ${content}`);

    await message.reply({ embeds: [embed] });
  },
};
