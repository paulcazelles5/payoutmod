const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'roles',
  aliases: ['rolelist'],
  description: 'Liste des rôles du serveur',
  async execute(message) {
    const roles = message.guild.roles.cache
      .filter((r) => r.id !== message.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((r) => `${r} — ${r.members.size} membre(s)`)
      .slice(0, 40);

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle(`Rôles (${message.guild.roles.cache.size - 1})`)
      .setDescription(roles.join('\n') || 'Aucun');

    await message.reply({ embeds: [embed] });
  },
};
