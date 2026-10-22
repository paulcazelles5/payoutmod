const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const ms = require('ms');

module.exports = {
  name: 'uptime',
  description: 'Temps de fonctionnement',
  async execute(message) {
    const up = ms(message.client.uptime, { long: true });
    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setDescription(`⏱️ En ligne depuis **${up}**.`);
    await message.reply({ embeds: [embed] });
  },
};
