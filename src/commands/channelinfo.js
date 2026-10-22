const { EmbedBuilder, ChannelType } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'channelinfo',
  aliases: ['ci'],
  description: 'Infos sur un salon',
  async execute(message, args) {
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      message.channel;

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle(`#${channel.name}`)
      .addFields(
        { name: 'ID', value: channel.id, inline: true },
        { name: 'Type', value: ChannelType[channel.type] || String(channel.type), inline: true },
        { name: 'Créé', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Topic', value: channel.topic || 'Aucun', inline: false }
      );

    if (channel.rateLimitPerUser) {
      embed.addFields({ name: 'Slowmode', value: `${channel.rateLimitPerUser}s`, inline: true });
    }

    await message.reply({ embeds: [embed] });
  },
};
