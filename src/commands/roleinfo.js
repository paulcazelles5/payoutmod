const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'roleinfo',
  aliases: ['ri'],
  description: 'Infos sur un rôle',
  async execute(message, args) {
    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[0]) ||
      message.guild.roles.cache.find((r) => r.name.toLowerCase() === args.join(' ').toLowerCase());

    if (!role) return message.reply('Usage : `*roleinfo @role`');

    const embed = new EmbedBuilder()
      .setColor(role.color || config.colors.info)
      .setTitle(role.name)
      .addFields(
        { name: 'ID', value: role.id, inline: true },
        { name: 'Couleur', value: role.hexColor, inline: true },
        { name: 'Membres', value: String(role.members.size), inline: true },
        { name: 'Position', value: String(role.position), inline: true },
        { name: 'Mentionnable', value: role.mentionable ? 'Oui' : 'Non', inline: true },
        { name: 'Affiché séparément', value: role.hoist ? 'Oui' : 'Non', inline: true },
        { name: 'Créé', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true }
      );

    await message.reply({ embeds: [embed] });
  },
};
