const { EmbedBuilder } = require('discord.js');
const { getEdited } = require('../utils/snipe');
const config = require('../config');

module.exports = {
  name: 'editsnipe',
  aliases: ['esnipe', 'es'],
  description: 'Voir le dernier message édité du salon',
  async execute(message) {
    const data = getEdited(message.channel.id);
    if (!data) return message.reply('Aucune édition récente dans ce salon.');

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setAuthor({ name: data.authorTag, iconURL: data.authorAvatar || undefined })
      .addFields(
        { name: 'Avant', value: data.oldContent.slice(0, 1024) || '*vide*' },
        { name: 'Après', value: data.newContent.slice(0, 1024) || '*vide*' }
      )
      .setTimestamp(data.editedAt);

    await message.reply({ embeds: [embed] });
  },
};
