const { EmbedBuilder } = require('discord.js');
const { getDeleted } = require('../utils/snipe');
const config = require('../config');

module.exports = {
  name: 'snipe',
  aliases: ['s'],
  description: 'Voir le dernier message supprimé du salon',
  async execute(message) {
    const data = getDeleted(message.channel.id);
    if (!data) return message.reply('Rien à sniper dans ce salon.');

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setAuthor({ name: data.authorTag, iconURL: data.authorAvatar || undefined })
      .setDescription(data.content || '*pièce jointe uniquement*')
      .setFooter({ text: 'Message supprimé' })
      .setTimestamp(data.deletedAt);

    if (data.image) embed.setImage(data.image);

    await message.reply({ embeds: [embed] });
  },
};
