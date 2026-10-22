const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'emojis',
  aliases: ['emotelist', 'emotes'],
  description: 'Liste des emojis du serveur',
  async execute(message) {
    const emojis = message.guild.emojis.cache.map((e) => `${e} \`:${e.name}:\``).slice(0, 50);
    if (!emojis.length) return message.reply('Aucun emoji personnalisé.');

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle(`Emojis (${message.guild.emojis.cache.size})`)
      .setDescription(emojis.join(' '));

    await message.reply({ embeds: [embed] });
  },
};
